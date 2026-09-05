import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { seedData } from './seed.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const dataDir = join(__dirname, 'data');
const dbPath = join(dataDir, 'db.json');
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'school-erp-development-secret';
const editableCollections = ['students', 'teachers', 'classes', 'subjects', 'attendance', 'fees', 'expenses', 'exams', 'results', 'timetable', 'notices', 'users'];

function initialiseDatabase() {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  if (!existsSync(dbPath)) writeFileSync(dbPath, JSON.stringify(seedData, null, 2));
}

function readDb() {
  initialiseDatabase();
  return JSON.parse(readFileSync(dbPath, 'utf-8'));
}

function writeDb(db) {
  writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function publicUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'Missing authorization token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function getCollection(req, res, next) {
  const { collection } = req.params;
  if (!editableCollections.includes(collection)) return res.status(404).json({ message: 'Unknown module' });
  next();
}

function normaliseStatusForFee(fee) {
  const net = Number(fee.amount || 0) - Number(fee.discount || 0);
  const paid = Number(fee.paid || 0);
  if (paid <= 0) return 'Unpaid';
  if (paid >= net) return 'Paid';
  return 'Partial';
}

function gradeFor(marks, maxMarks = 100) {
  const percent = maxMarks ? (Number(marks) / Number(maxMarks)) * 100 : 0;
  if (percent >= 90) return 'A+';
  if (percent >= 80) return 'A';
  if (percent >= 70) return 'B';
  if (percent >= 60) return 'C';
  if (percent >= 50) return 'D';
  return 'F';
}

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true, app: 'School ERP', date: new Date().toISOString() }));

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  const user = db.users.find((item) => item.email?.toLowerCase() === String(email || '').toLowerCase());
  if (!user || user.status !== 'Active') return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password || '', user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign(publicUser(user), JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: publicUser(user) });
});

app.get('/api/me', requireAuth, (req, res) => res.json({ user: req.user }));

app.get('/api/dashboard', requireAuth, (req, res) => {
  const db = readDb();
  const totalRevenue = db.fees.reduce((sum, fee) => sum + Number(fee.paid || 0), 0);
  const totalDues = db.fees.reduce((sum, fee) => sum + Math.max(Number(fee.amount || 0) - Number(fee.discount || 0) - Number(fee.paid || 0), 0), 0);
  const expenses = db.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const todaysAttendance = db.attendance.filter((item) => item.date === '2026-09-01');
  const presentToday = todaysAttendance.filter((item) => ['Present', 'Late'].includes(item.status)).length;
  const classWiseStudents = db.classes.map((klass) => ({
    label: `${klass.name}-${klass.section}`,
    value: db.students.filter((student) => student.classId === klass.id && student.status === 'Active').length,
    capacity: klass.capacity
  }));
  const recentNotices = [...db.notices].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 5);
  const pendingFees = db.fees.filter((fee) => fee.status !== 'Paid').slice(0, 5).map((fee) => ({ ...fee, student: db.students.find((student) => student.id === fee.studentId)?.name || 'Unknown' }));
  res.json({
    cards: {
      students: db.students.filter((item) => item.status === 'Active').length,
      teachers: db.teachers.filter((item) => item.status === 'Active').length,
      classes: db.classes.length,
      totalRevenue,
      totalDues,
      expenses,
      attendanceRate: todaysAttendance.length ? Math.round((presentToday / todaysAttendance.length) * 100) : 0
    },
    classWiseStudents,
    recentNotices,
    pendingFees
  });
});

app.get('/api/:collection', requireAuth, getCollection, (req, res) => {
  const db = readDb();
  const query = String(req.query.q || '').toLowerCase();
  let rows = db[req.params.collection] || [];
  if (query) rows = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query));
  res.json(rows);
});

app.post('/api/:collection', requireAuth, getCollection, async (req, res) => {
  const db = readDb();
  const collection = req.params.collection;
  const payload = { ...req.body, id: req.body.id || nanoid(10) };
  if (collection === 'users') payload.password = await bcrypt.hash(payload.password || 'password123', 10);
  if (collection === 'fees') payload.status = normaliseStatusForFee(payload);
  if (collection === 'results') {
    const exam = db.exams.find((item) => item.id === payload.examId);
    payload.grade = gradeFor(payload.marks, exam?.maxMarks || 100);
  }
  db[collection].push(payload);
  writeDb(db);
  res.status(201).json(collection === 'users' ? publicUser(payload) : payload);
});

app.put('/api/:collection/:id', requireAuth, getCollection, async (req, res) => {
  const db = readDb();
  const collection = req.params.collection;
  const index = db[collection].findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Record not found' });
  const existing = db[collection][index];
  const payload = { ...existing, ...req.body, id: existing.id };
  if (collection === 'users') payload.password = req.body.password ? await bcrypt.hash(req.body.password, 10) : existing.password;
  if (collection === 'fees') payload.status = normaliseStatusForFee(payload);
  if (collection === 'results') {
    const exam = db.exams.find((item) => item.id === payload.examId);
    payload.grade = gradeFor(payload.marks, exam?.maxMarks || 100);
  }
  db[collection][index] = payload;
  writeDb(db);
  res.json(collection === 'users' ? publicUser(payload) : payload);
});

app.delete('/api/:collection/:id', requireAuth, getCollection, (req, res) => {
  const db = readDb();
  const collection = req.params.collection;
  const before = db[collection].length;
  db[collection] = db[collection].filter((item) => item.id !== req.params.id);
  if (db[collection].length === before) return res.status(404).json({ message: 'Record not found' });
  writeDb(db);
  res.status(204).end();
});

app.post('/api/attendance/bulk', requireAuth, (req, res) => {
  const { date, classId, records } = req.body;
  if (!date || !classId || !Array.isArray(records)) return res.status(400).json({ message: 'date, classId and records are required' });
  const db = readDb();
  for (const record of records) {
    const existing = db.attendance.find((item) => item.date === date && item.classId === classId && item.studentId === record.studentId);
    if (existing) Object.assign(existing, { status: record.status, remarks: record.remarks || '' });
    else db.attendance.push({ id: nanoid(10), date, classId, studentId: record.studentId, status: record.status, remarks: record.remarks || '' });
  }
  writeDb(db);
  res.json({ message: 'Attendance saved', records: db.attendance.filter((item) => item.date === date && item.classId === classId) });
});

app.post('/api/fees/generate-monthly', requireAuth, (req, res) => {
  const { month, dueDate } = req.body;
  if (!month || !dueDate) return res.status(400).json({ message: 'month and dueDate are required' });
  const db = readDb();
  let created = 0;
  for (const student of db.students.filter((item) => item.status === 'Active')) {
    if (db.fees.some((fee) => fee.studentId === student.id && fee.month === month)) continue;
    const klass = db.classes.find((item) => item.id === student.classId);
    db.fees.push({ id: nanoid(10), invoiceNo: `INV-${Date.now()}-${created + 1}`, studentId: student.id, month, amount: klass?.monthlyFee || 0, discount: 0, paid: 0, dueDate, paidAt: '', status: 'Unpaid' });
    created += 1;
  }
  writeDb(db);
  res.json({ message: `${created} invoices generated`, created });
});

app.get('/api/reports/student/:id', requireAuth, (req, res) => {
  const db = readDb();
  const student = db.students.find((item) => item.id === req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json({
    student,
    class: db.classes.find((item) => item.id === student.classId),
    fees: db.fees.filter((item) => item.studentId === student.id),
    attendance: db.attendance.filter((item) => item.studentId === student.id),
    results: db.results.filter((item) => item.studentId === student.id).map((result) => ({ ...result, exam: db.exams.find((exam) => exam.id === result.examId) }))
  });
});

if (process.env.NODE_ENV === 'production') {
  const distDir = join(rootDir, 'dist');
  app.use(express.static(distDir));
  app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(join(distDir, 'index.html')));
}

initialiseDatabase();
app.listen(PORT, '0.0.0.0', () => {
  console.log(`School ERP API running on http://0.0.0.0:${PORT}`);
});
