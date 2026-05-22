import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3001;
const dataDir = path.join(__dirname, 'data');
const coursesPath = path.join(dataDir, 'courses.json');
const registrationsPath = path.join(dataDir, 'registrations.json');
const clientDistPath = path.join(__dirname, 'client', 'dist');

app.use(express.json());

async function ensureFile(filePath, fallback) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2));
  }
}

async function readJson(filePath, fallback) {
  await ensureFile(filePath, fallback);
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw || JSON.stringify(fallback));
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

function normalizeText(value) {
  return String(value ?? '').trim();
}

function normalizeInterests(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(normalizeText).filter(Boolean);
  return [normalizeText(value)].filter(Boolean);
}

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

app.get('/api/health', async (_req, res) => {
  const courses = await readJson(coursesPath, []);
  const registrations = await readJson(registrationsPath, []);

  res.json({
    status: 'ok',
    courses: courses.length,
    registrations: registrations.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/courses', async (_req, res) => {
  const courses = await readJson(coursesPath, []);
  const registrations = await readJson(registrationsPath, []);

  const enrichedCourses = courses.map((course) => {
    const count = registrations.filter((registration) => registration.courseId === course.id).length;
    return {
      ...course,
      registeredCount: count,
      availableSeats: Math.max(0, course.capacity - count)
    };
  });

  res.json(enrichedCourses);
});

app.get('/api/registrations', async (_req, res) => {
  const registrations = await readJson(registrationsPath, []);
  res.json(registrations);
});

app.post('/api/register', async (req, res, next) => {
  try {
    const courses = await readJson(coursesPath, []);
    const registrations = await readJson(registrationsPath, []);
    const {
      studentName,
      studentId,
      email,
      program,
      year,
      courseId,
      attendanceMode,
      interests,
      notes
    } = req.body;

    const normalizedStudentName = normalizeText(studentName);
    const normalizedStudentId = normalizeText(studentId);
    const normalizedEmail = normalizeText(email);
    const normalizedProgram = normalizeText(program);
    const normalizedYear = normalizeText(year);
    const normalizedCourseId = normalizeText(courseId);
    const normalizedAttendanceMode = normalizeText(attendanceMode);
    const selectedInterests = normalizeInterests(interests);
    const normalizedNotes = normalizeText(notes);

    if (!normalizedStudentName) throw createValidationError('Student name is required.');
    if (!normalizedStudentId) throw createValidationError('Student ID is required.');
    if (!normalizedEmail || !normalizedEmail.includes('@')) throw createValidationError('A valid email address is required.');
    if (!normalizedProgram) throw createValidationError('Program is required.');
    if (!normalizedYear) throw createValidationError('Year of study is required.');
    if (!normalizedCourseId) throw createValidationError('Course selection is required.');
    if (!normalizedAttendanceMode) throw createValidationError('Attendance mode is required.');

    const course = courses.find((item) => item.id === normalizedCourseId);

    if (!course) throw createValidationError('Selected course does not exist.');

    const duplicate = registrations.find(
      (registration) => registration.studentId.toLowerCase() === normalizedStudentId.toLowerCase() && registration.courseId === normalizedCourseId
    );

    if (duplicate) {
      throw createValidationError('This student is already registered for the selected course.');
    }

    const currentCount = registrations.filter((registration) => registration.courseId === normalizedCourseId).length;
    if (currentCount >= course.capacity) {
      throw createValidationError('That course is already full. Choose another course.');
    }

    const registration = {
      id: crypto.randomUUID(),
      studentName: normalizedStudentName,
      studentId: normalizedStudentId,
      email: normalizedEmail,
      program: normalizedProgram,
      year: normalizedYear,
      courseId: normalizedCourseId,
      courseTitle: course.title,
      attendanceMode: normalizedAttendanceMode,
      interests: selectedInterests,
      notes: normalizedNotes,
      createdAt: new Date().toISOString()
    };

    registrations.push(registration);
    await writeJson(registrationsPath, registrations);

    res.status(201).json({
      message: 'Registration saved successfully.',
      registration
    });
  } catch (error) {
    next(error);
  }
});

app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'API route not found.' });
});

if (await fs.access(clientDistPath).then(() => true).catch(() => false)) {
  app.use(express.static(clientDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || 'Unexpected server error.'
  });
});

app.listen(port, () => {
  console.log(`Student Course Registration System API running on http://localhost:${port}`);
});
