import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { allForDashboard, connectStore, create, findOne, hasCollection, list, remove, update } from './dataStore.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'eduflow-saas-secret';

const money = (rows, key) => rows.reduce((sum, row) => sum + Number(row[key] || 0), 0);
const grade = (marks, max = 100) => {
  const p = (Number(marks) / Number(max || 100)) * 100;
  if (p >= 90) return 'A+';
  if (p >= 80) return 'A';
  if (p >= 70) return 'B';
  if (p >= 60) return 'C';
  if (p >= 50) return 'D';
  return 'F';
};
const feeStatus = (fee) => {
  const due = Number(fee.amount || 0) - Number(fee.discount || 0);
  const paid = Number(fee.paid || 0);
  if (paid <= 0) return 'Unpaid';
  return paid >= due ? 'Paid' : 'Partial';
};
const publicUser = (user) => {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
};

function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Login required' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

function collectionGuard(req, res, next) {
  if (!hasCollection(req.params.collection)) return res.status(404).json({ message: 'Unknown module' });
  next();
}

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true, app: 'EduFlow SaaS School Management', storage: process.env.MONGODB_URI ? 'mongodb' : 'json' }));

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findOne('users', (row) => row.email?.toLowerCase() === String(email || '').toLowerCase());
  if (!user || user.status !== 'Active') return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password || '', user.password || '');
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const safe = publicUser(user);
  const token = jwt.sign(safe, JWT_SECRET, { expiresIn: '10h' });
  res.json({ token, user: safe });
});

app.get('/api/dashboard', requireAuth, async (req, res) => {
  const db = await allForDashboard(req.user.schoolId);
  const revenue = money(db.fees, 'paid');
  const due = db.fees.reduce((sum, row) => sum + Math.max(Number(row.amount || 0) - Number(row.discount || 0) - Number(row.paid || 0), 0), 0);
  const payroll = money(db.payroll, 'netSalary');
  const expenses = money(db.expenses, 'amount');
  const present = db.attendance.filter((row) => ['Present', 'Late'].includes(row.status)).length;
  const classStrength = db.classes.map((klass) => ({
    name: `${klass.name}-${klass.section}`,
    students: db.students.filter((student) => student.className === klass.name && student.section === klass.section).length,
    capacity: klass.capacity
  }));
  res.json({
    kpis: {
      students: db.students.length,
      teachers: db.teachers.length,
      admissions: db.admissions.length,
      revenue,
      due,
      payroll,
      expenses,
      profit: revenue - expenses - payroll,
      attendance: db.attendance.length ? Math.round((present / db.attendance.length) * 100) : 0
    },
    classStrength,
    feeStatus: [
      { name: 'Paid', value: db.fees.filter((row) => row.status === 'Paid').length },
      { name: 'Partial', value: db.fees.filter((row) => row.status === 'Partial').length },
      { name: 'Unpaid', value: db.fees.filter((row) => row.status === 'Unpaid').length }
    ],
    notices: db.notices.slice(0, 5),
    admissions: db.admissions.slice(0, 5)
  });
});

app.get('/api/:collection', requireAuth, collectionGuard, async (req, res) => {
  const rows = await list(req.params.collection, req.user.schoolId, req.query.q);
  res.json(req.params.collection === 'users' ? rows.map(publicUser) : rows);
});

app.post('/api/:collection', requireAuth, collectionGuard, async (req, res) => {
  const payload = { ...req.body };
  if (req.params.collection === 'users') payload.password = await bcrypt.hash(payload.password || 'password123', 10);
  if (req.params.collection === 'fees') payload.status = feeStatus(payload);
  if (req.params.collection === 'results') payload.grade = grade(payload.marks, payload.maxMarks);
  const doc = await create(req.params.collection, req.user.schoolId, payload);
  res.status(201).json(req.params.collection === 'users' ? publicUser(doc) : doc);
});

app.put('/api/:collection/:id', requireAuth, collectionGuard, async (req, res) => {
  const payload = { ...req.body };
  if (req.params.collection === 'users') {
    if (payload.password) payload.password = await bcrypt.hash(payload.password, 10);
    else delete payload.password;
  }
  if (req.params.collection === 'fees') payload.status = feeStatus(payload);
  if (req.params.collection === 'results') payload.grade = grade(payload.marks, payload.maxMarks);
  const doc = await update(req.params.collection, req.params.id, req.user.schoolId, payload);
  if (!doc) return res.status(404).json({ message: 'Record not found' });
  res.json(req.params.collection === 'users' ? publicUser(doc) : doc);
});

app.delete('/api/:collection/:id', requireAuth, collectionGuard, async (req, res) => {
  const ok = await remove(req.params.collection, req.params.id, req.user.schoolId);
  if (!ok) return res.status(404).json({ message: 'Record not found' });
  res.status(204).end();
});

app.post('/api/workflows/mark-attendance', requireAuth, async (req, res) => {
  const { date, className, records = [] } = req.body;
  const created = [];
  for (const record of records) created.push(await create('attendance', req.user.schoolId, { date, className, ...record }));
  res.json({ message: `${created.length} attendance records saved`, records: created });
});

app.post('/api/workflows/generate-fees', requireAuth, async (req, res) => {
  const { month, dueDate } = req.body;
  const students = await list('students', req.user.schoolId);
  const classes = await list('classes', req.user.schoolId);
  let count = 0;
  for (const student of students.filter((row) => row.status === 'Active')) {
    const klass = classes.find((row) => row.name === student.className && row.section === student.section);
    await create('fees', req.user.schoolId, {
      invoiceNo: `INV-${Date.now()}-${count + 1}`,
      studentName: student.name,
      month,
      amount: klass?.monthlyFee || 0,
      discount: 0,
      paid: 0,
      dueDate,
      status: 'Unpaid'
    });
    count += 1;
  }
  res.json({ message: `${count} invoices generated`, count });
});

app.post('/api/workflows/process-payroll', requireAuth, async (req, res) => {
  const { month } = req.body;
  const teachers = await list('teachers', req.user.schoolId);
  let count = 0;
  for (const teacher of teachers) {
    const grossSalary = Number(teacher.salary || 0);
    await create('payroll', req.user.schoolId, { employeeName: teacher.name, month, grossSalary, deductions: 0, bonus: 0, netSalary: grossSalary, status: 'Pending' });
    count += 1;
  }
  res.json({ message: `${count} payroll slips prepared`, count });
});

if (process.env.NODE_ENV === 'production') {
  const distDir = join(rootDir, 'dist');
  app.use(express.static(distDir));
  app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(join(distDir, 'index.html')));
}

await connectStore();
app.listen(PORT, '0.0.0.0', () => console.log(`EduFlow API running on http://0.0.0.0:${PORT}`));
