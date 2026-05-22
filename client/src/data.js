export const courses = [
  {
    id: 'web-101',
    title: 'Web Development Fundamentals',
    code: 'CSE 210',
    credits: 3,
    schedule: 'Mon & Wed, 09:00 - 10:30',
    capacity: 30,
    instructor: 'Dr. Amina Rahman',
    description: 'Build solid front-end and back-end foundations with HTML, CSS, JavaScript, and modern web workflows.'
  },
  {
    id: 'ui-201',
    title: 'UI Engineering and Design Systems',
    code: 'CSE 312',
    credits: 3,
    schedule: 'Tue & Thu, 11:00 - 12:30',
    capacity: 24,
    instructor: 'Prof. Daniel Cruz',
    description: 'Design and implement polished interfaces with reusable component thinking and accessible styling.'
  },
  {
    id: 'api-220',
    title: 'Node.js API Development',
    code: 'CSE 325',
    credits: 4,
    schedule: 'Mon, 14:00 - 17:00',
    capacity: 20,
    instructor: 'Engr. Maya Singh',
    description: 'Create REST APIs, validation layers, and file-based data storage for production-style applications.'
  },
  {
    id: 'db-150',
    title: 'Database Systems',
    code: 'CSE 240',
    credits: 3,
    schedule: 'Wed, 13:00 - 15:00',
    capacity: 28,
    instructor: 'Dr. Kevin Owusu',
    description: 'Model structured data, manage consistency, and understand how applications persist records safely.'
  },
  {
    id: 'cloud-330',
    title: 'Cloud Deployment Basics',
    code: 'CSE 410',
    credits: 2,
    schedule: 'Fri, 10:00 - 12:00',
    capacity: 18,
    instructor: 'Ms. Elena Park',
    description: 'Prepare applications for hosting, deployment, and online access across different environments.'
  }
];

export const interestOptions = ['Labs', 'Projects', 'Internships', 'Research', 'Exams'];

export const storageKey = 'scrs-registrations-v1';

export const defaultForm = {
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

export function getInitialRegistrations() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRegistrations(registrations) {
  window.localStorage.setItem(storageKey, JSON.stringify(registrations));
}