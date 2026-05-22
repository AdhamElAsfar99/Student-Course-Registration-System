import { useEffect, useMemo, useState } from 'react';

const defaultForm = {
  studentName: '',
  studentId: '',
  email: '',
  program: '',
  year: 'Year 1',
  courseId: '',
  attendanceMode: 'On campus',
  interests: [],
  notes: ''
};

const interestOptions = ['Labs', 'Projects', 'Internships', 'Research', 'Exams'];

function formatDate(value) {
  return new Date(value).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

export default function App() {
  const [courses, setCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [formData, setFormData] = useState(defaultForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [courseResponse, registrationResponse] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/registrations')
        ]);

        const courseData = await courseResponse.json();
        const registrationData = await registrationResponse.json();

        setCourses(courseData);
        setRegistrations(registrationData);
        setFormData((current) => ({
          ...current,
          courseId: courseData[0]?.id ?? ''
        }));
      } catch {
        setStatus({ type: 'error', message: 'Unable to load registration data.' });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === formData.courseId),
    [courses, formData.courseId]
  );

  const filteredCourses = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return courses;
    }

    return courses.filter((course) => {
      const searchableValues = [course.title, course.code, course.schedule, course.instructor, course.description];
      return searchableValues.some((value) => value.toLowerCase().includes(query));
    });
  }, [courses, searchTerm]);

  const filteredRegistrations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return registrations;
    }

    return registrations.filter((registration) => {
      const searchableValues = [
        registration.studentName,
        registration.studentId,
        registration.email,
        registration.program,
        registration.year,
        registration.courseTitle,
        registration.attendanceMode,
        ...(registration.interests || []),
        registration.notes || ''
      ];

      return searchableValues.some((value) => value.toLowerCase().includes(query));
    });
  }, [registrations, searchTerm]);

  const filteredCourseCount = filteredCourses.length;
  const filteredRegistrationCount = filteredRegistrations.length;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleInterestChange(event) {
    const { value, checked } = event.target;
    setFormData((current) => ({
      ...current,
      interests: checked
        ? [...current.interests, value]
        : current.interests.filter((interest) => interest !== value)
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Registration failed.');
      }

      setRegistrations((current) => [payload.registration, ...current]);
      setStatus({ type: 'success', message: payload.message });
      setFormData((current) => ({
        ...defaultForm,
        courseId: current.courseId || courses[0]?.id || ''
      }));
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-shell">
      <main className="app-shell">
        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">University Registration Portal</p>
            <h1>Student Course Registration System</h1>
            <p className="hero-text">
              Register students for courses with a clean, responsive interface and a simple Node.js backend that stores every submission in JSON files.
            </p>
            <div className="hero-stats">
              <div className="stat-card">
                <strong>{courses.length}</strong>
                <span>Available courses</span>
              </div>
              <div className="stat-card">
                <strong>{registrations.length}</strong>
                <span>Saved registrations</span>
              </div>
              <div className="stat-card">
                <strong>{selectedCourse?.availableSeats ?? '--'}</strong>
                <span>Seats left in selected course</span>
              </div>
            </div>
          </div>
          <div className="hero-panel">
            <h2>Today’s registration snapshot</h2>
            <div className="snapshot-list">
              {courses.slice(0, 3).map((course) => (
                <article key={course.id} className="snapshot-item">
                  <div>
                    <h3>{course.title}</h3>
                    <p>
                      {course.code} · {course.schedule}
                    </p>
                  </div>
                  <span>{course.availableSeats} seats</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="search-strip course-board">
          <div className="section-heading search-heading">
            <div>
              <p className="eyebrow">Search and Admin View</p>
              <h2>Filter courses or registrations</h2>
            </div>
            <div className="search-stats">
              <span>{filteredCourseCount} course{filteredCourseCount === 1 ? '' : 's'} visible</span>
              <span>{filteredRegistrationCount} registration{filteredRegistrationCount === 1 ? '' : 's'} visible</span>
            </div>
          </div>

          <label className="search-field">
            Search by student, course, code, or note
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Try 'web', 'adham', 'online', or a student ID"
            />
          </label>
        </section>

        <section className="content-grid">
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="section-heading">
              <p className="eyebrow">Registration Form</p>
              <h2>Submit student details</h2>
            </div>

            <div className="form-grid">
              <label>
                Student Name
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="e.g. Sara Ahmed"
                  required
                />
              </label>

              <label>
                Student ID
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g. STU-2026-014"
                  required
                />
              </label>

              <label>
                Email Address
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  required
                />
              </label>

              <label>
                Program
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  required
                />
              </label>

              <label>
                Year of Study
                <select name="year" value={formData.year} onChange={handleChange} required>
                  <option>Year 1</option>
                  <option>Year 2</option>
                  <option>Year 3</option>
                  <option>Year 4</option>
                </select>
              </label>

              <label>
                Select Course
                <select name="courseId" value={formData.courseId} onChange={handleChange} required>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <fieldset>
              <legend>Attendance Mode</legend>
              <div className="radio-row">
                {['On campus', 'Online', 'Hybrid'].map((mode) => (
                  <label key={mode} className="radio-pill">
                    <input
                      type="radio"
                      name="attendanceMode"
                      value={mode}
                      checked={formData.attendanceMode === mode}
                      onChange={handleChange}
                    />
                    <span>{mode}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>Interest Areas</legend>
              <div className="checkbox-grid">
                {interestOptions.map((interest) => (
                  <label key={interest} className="checkbox-card">
                    <input
                      type="checkbox"
                      name="interests"
                      value={interest}
                      checked={formData.interests.includes(interest)}
                      onChange={handleInterestChange}
                    />
                    <span>{interest}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="notes-field">
              Notes
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Add any timetable, support, or advisor notes."
              />
            </label>

            <button type="submit" disabled={submitting || loading}>
              {submitting ? 'Submitting...' : 'Register Student'}
            </button>

            {status.message ? <p className={`status-message ${status.type}`}>{status.message}</p> : null}
          </form>

          <aside className="info-column">
            <section className="course-board">
              <div className="section-heading">
                <p className="eyebrow">Course Catalog</p>
                <h2>Current offerings</h2>
              </div>

              <div className="course-list">
                {filteredCourses.length === 0 ? (
                  <p className="empty-state">No courses match the current search term.</p>
                ) : (
                  filteredCourses.map((course) => (
                    <article key={course.id} className="course-card">
                      <div className="course-topline">
                        <strong>{course.code}</strong>
                        <span>{course.credits} credits</span>
                      </div>
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                      <div className="course-meta">
                        <span>{course.schedule}</span>
                        <span>{course.availableSeats} seats open</span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="course-board recent-board">
              <div className="section-heading">
                <p className="eyebrow">Recent Activity</p>
                <h2>Latest registrations</h2>
              </div>

              <div className="recent-list">
                {filteredRegistrations.length === 0 ? (
                  <p className="empty-state">No registrations match the current search term.</p>
                ) : (
                  filteredRegistrations.slice(0, 5).map((registration) => (
                    <article key={registration.id} className="recent-item">
                      <div>
                        <h3>{registration.studentName}</h3>
                        <p>
                          {registration.studentId} · {registration.courseTitle}
                        </p>
                      </div>
                      <span>{formatDate(registration.createdAt)}</span>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="course-board admin-board">
              <div className="section-heading">
                <p className="eyebrow">Admin View</p>
                <h2>All registrations</h2>
              </div>

              <div className="admin-summary">
                <div>
                  <strong>{registrations.length}</strong>
                  <span>Total saved</span>
                </div>
                <div>
                  <strong>{filteredRegistrations.length}</strong>
                  <span>Matching filter</span>
                </div>
              </div>

              <div className="admin-list">
                {registrations.length === 0 ? (
                  <p className="empty-state">Registrations saved from the form will appear here for quick admin review.</p>
                ) : filteredRegistrations.length === 0 ? (
                  <p className="empty-state">No admin records match the search term.</p>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <article key={registration.id} className="admin-item">
                      <div className="admin-item-top">
                        <h3>{registration.studentName}</h3>
                        <span>{registration.courseTitle}</span>
                      </div>
                      <div className="admin-item-grid">
                        <span>{registration.studentId}</span>
                        <span>{registration.program}</span>
                        <span>{registration.year}</span>
                        <span>{registration.attendanceMode}</span>
                      </div>
                      <p>
                        {registration.email} {registration.interests?.length ? `· ${registration.interests.join(', ')}` : ''}
                      </p>
                      <small>{formatDate(registration.createdAt)}</small>
                    </article>
                  ))
                )}
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
