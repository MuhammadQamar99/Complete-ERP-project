import { useEffect, useMemo, useState } from 'react';
import { api, clearSession, getSessionUser, setSession } from './api.js';

const navItems = [
  ['dashboard', 'Dashboard', '📊'],
  ['students', 'Students', '🎓'],
  ['teachers', 'Teachers', '👩‍🏫'],
  ['classes', 'Classes', '🏫'],
  ['subjects', 'Subjects', '📚'],
  ['attendance', 'Attendance', '✅'],
  ['fees', 'Fees', '💳'],
  ['exams', 'Exams & Results', '📝'],
  ['timetable', 'Timetable', '🗓️'],
  ['notices', 'Notices', '📢'],
  ['reports', 'Reports', '📈'],
  ['users', 'Users', '🔐']
];

const fields = {
  students: [
    ['admissionNo', 'Admission No'], ['name', 'Student Name'], ['gender', 'Gender', 'select', ['Male', 'Female', 'Other']], ['dob', 'Date of Birth', 'date'], ['guardian', 'Guardian'], ['phone', 'Phone'], ['email', 'Email'], ['classId', 'Class', 'relation', 'classes'], ['rollNo', 'Roll No'], ['address', 'Address'], ['admissionDate', 'Admission Date', 'date'], ['status', 'Status', 'select', ['Active', 'Inactive', 'Graduated']]
  ],
  teachers: [
    ['employeeNo', 'Employee No'], ['name', 'Teacher Name'], ['gender', 'Gender', 'select', ['Male', 'Female', 'Other']], ['phone', 'Phone'], ['email', 'Email'], ['qualification', 'Qualification'], ['department', 'Department'], ['joiningDate', 'Joining Date', 'date'], ['salary', 'Salary', 'number'], ['status', 'Status', 'select', ['Active', 'Inactive']]
  ],
  classes: [
    ['name', 'Class Name'], ['section', 'Section'], ['room', 'Room'], ['capacity', 'Capacity', 'number'], ['teacherId', 'Class Teacher', 'relation', 'teachers'], ['monthlyFee', 'Monthly Fee', 'number']
  ],
  subjects: [
    ['code', 'Subject Code'], ['name', 'Subject Name'], ['classId', 'Class', 'relation', 'classes'], ['teacherId', 'Teacher', 'relation', 'teachers'], ['totalMarks', 'Total Marks', 'number']
  ],
  fees: [
    ['invoiceNo', 'Invoice No'], ['studentId', 'Student', 'relation', 'students'], ['month', 'Month'], ['amount', 'Amount', 'number'], ['discount', 'Discount', 'number'], ['paid', 'Paid', 'number'], ['dueDate', 'Due Date', 'date'], ['paidAt', 'Paid At', 'date']
  ],
  expenses: [
    ['title', 'Expense Title'], ['category', 'Category', 'select', ['Academic', 'Utilities', 'Maintenance', 'Salary', 'Transport', 'Other']], ['amount', 'Amount', 'number'], ['date', 'Date', 'date'], ['paidTo', 'Paid To'], ['status', 'Status', 'select', ['Paid', 'Pending']]
  ],
  exams: [
    ['title', 'Exam Title'], ['classId', 'Class', 'relation', 'classes'], ['subjectId', 'Subject', 'relation', 'subjects'], ['date', 'Date', 'date'], ['maxMarks', 'Max Marks', 'number']
  ],
  results: [
    ['examId', 'Exam', 'relation', 'exams'], ['studentId', 'Student', 'relation', 'students'], ['marks', 'Marks', 'number'], ['remarks', 'Remarks']
  ],
  timetable: [
    ['classId', 'Class', 'relation', 'classes'], ['day', 'Day', 'select', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']], ['period', 'Period'], ['subjectId', 'Subject', 'relation', 'subjects'], ['teacherId', 'Teacher', 'relation', 'teachers']
  ],
  notices: [
    ['title', 'Title'], ['audience', 'Audience', 'select', ['All', 'Students', 'Parents', 'Teachers']], ['date', 'Date', 'date'], ['message', 'Message', 'textarea'], ['priority', 'Priority', 'select', ['Low', 'Medium', 'High']]
  ],
  users: [
    ['name', 'Name'], ['email', 'Email'], ['password', 'Password', 'password'], ['role', 'Role', 'select', ['Administrator', 'Accountant', 'Teacher', 'Reception']], ['status', 'Status', 'select', ['Active', 'Inactive']]
  ]
};

const columns = {
  students: ['admissionNo', 'name', 'classId', 'rollNo', 'guardian', 'phone', 'status'],
  teachers: ['employeeNo', 'name', 'department', 'phone', 'salary', 'status'],
  classes: ['name', 'section', 'room', 'capacity', 'teacherId', 'monthlyFee'],
  subjects: ['code', 'name', 'classId', 'teacherId', 'totalMarks'],
  fees: ['invoiceNo', 'studentId', 'month', 'amount', 'discount', 'paid', 'status'],
  expenses: ['title', 'category', 'amount', 'date', 'paidTo', 'status'],
  exams: ['title', 'classId', 'subjectId', 'date', 'maxMarks'],
  results: ['examId', 'studentId', 'marks', 'grade', 'remarks'],
  timetable: ['classId', 'day', 'period', 'subjectId', 'teacherId'],
  notices: ['title', 'audience', 'date', 'priority', 'message'],
  users: ['name', 'email', 'role', 'status']
};

const relationLabel = {
  students: (item) => item?.name,
  teachers: (item) => item?.name,
  classes: (item) => item ? `${item.name}-${item.section}` : '',
  subjects: (item) => item ? `${item.code} ${item.name}` : '',
  exams: (item, refs) => item ? `${item.title} (${displayValue('subjects', 'subjectId', item.subjectId, refs)})` : ''
};

function titleCase(value) {
  return String(value).replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}

function displayValue(module, key, value, refs) {
  if (!value) return '—';
  const field = (fields[module] || []).find((item) => item[0] === key);
  if (field?.[2] === 'relation') {
    const collection = field[3];
    const found = refs[collection]?.find((item) => item.id === value);
    return relationLabel[collection]?.(found, refs) || value;
  }
  if (typeof value === 'number') return value.toLocaleString();
  return value;
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@school.test');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = await api.login(email, password);
      setSession(payload);
      onLogin(payload.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return <main className="login-page">
    <form className="login-card" onSubmit={submit}>
      <div className="brand-mark">ERP</div>
      <h1>Complete School Management System</h1>
      <p>Manage admissions, academics, attendance, fees, exams, reports, notices and staff from one dashboard.</p>
      {error && <div className="alert error">{error}</div>}
      <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <button disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      <small>Demo: admin@school.test / password123</small>
    </form>
  </main>;
}

function Layout({ user, active, setActive, children, onLogout }) {
  return <div className="shell">
    <aside className="sidebar">
      <div className="logo"><span>🏫</span><strong>School ERP</strong></div>
      <nav>{navItems.map(([id, label, icon]) => <button key={id} className={active === id ? 'active' : ''} onClick={() => setActive(id)}><span>{icon}</span>{label}</button>)}</nav>
    </aside>
    <section className="workspace">
      <header className="topbar">
        <div><h2>{navItems.find((item) => item[0] === active)?.[1]}</h2><p>Welcome back, {user.name}</p></div>
        <div className="user-chip"><span>{user.role}</span><button onClick={onLogout}>Logout</button></div>
      </header>
      {children}
    </section>
  </div>;
}

function Dashboard({ setActive }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.dashboard().then(setData).catch((err) => setError(err.message)); }, []);
  if (error) return <div className="alert error">{error}</div>;
  if (!data) return <div className="loading">Loading dashboard...</div>;
  const cards = [
    ['Students', data.cards.students, '🎓', 'students'], ['Teachers', data.cards.teachers, '👩‍🏫', 'teachers'], ['Classes', data.cards.classes, '🏫', 'classes'], ['Revenue', `Rs ${data.cards.totalRevenue.toLocaleString()}`, '💰', 'fees'], ['Dues', `Rs ${data.cards.totalDues.toLocaleString()}`, '⏳', 'fees'], ['Expenses', `Rs ${data.cards.expenses.toLocaleString()}`, '🧾', 'fees'], ['Attendance', `${data.cards.attendanceRate}%`, '✅', 'attendance']
  ];
  return <div className="stack">
    <div className="cards">{cards.map(([label, value, icon, target]) => <button className="metric-card" key={label} onClick={() => setActive(target)}><span>{icon}</span><p>{label}</p><strong>{value}</strong></button>)}</div>
    <div className="grid two">
      <section className="panel"><h3>Class strength</h3>{data.classWiseStudents.map((item) => <div className="bar-row" key={item.label}><span>{item.label}</span><div><b style={{ width: `${Math.max((item.value / item.capacity) * 100, 4)}%` }} /></div><em>{item.value}/{item.capacity}</em></div>)}</section>
      <section className="panel"><h3>Pending fees</h3>{data.pendingFees.length ? data.pendingFees.map((fee) => <div className="list-item" key={fee.id}><strong>{fee.student}</strong><span>{fee.month} · Rs {(fee.amount - fee.discount - fee.paid).toLocaleString()} due</span></div>) : <p>No pending dues.</p>}</section>
    </div>
    <section className="panel"><h3>Latest notices</h3><div className="notice-grid">{data.recentNotices.map((notice) => <article key={notice.id}><span className={`badge ${notice.priority.toLowerCase()}`}>{notice.priority}</span><h4>{notice.title}</h4><p>{notice.message}</p><small>{notice.date} · {notice.audience}</small></article>)}</div></section>
  </div>;
}

function DataModule({ module, refs, refreshRefs }) {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await api.list(module, query);
    setRows(data);
  }
  useEffect(() => { load().catch((err) => setError(err.message)); }, [module]);

  async function save(form) {
    setSaving(true);
    setError('');
    try {
      if (form.id) await api.update(module, form.id, form);
      else await api.create(module, form);
      setEditing(null);
      await load();
      await refreshRefs();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }
  async function remove(id) {
    if (!confirm('Delete this record?')) return;
    await api.remove(module, id);
    await load();
    await refreshRefs();
  }

  return <div className="stack">
    <div className="toolbar"><input placeholder={`Search ${module}...`} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} /><button onClick={load}>Search</button><button className="primary" onClick={() => setEditing({})}>Add {titleCase(module.slice(0, -1))}</button></div>
    {error && <div className="alert error">{error}</div>}
    <div className="table-wrap"><table><thead><tr>{columns[module].map((col) => <th key={col}>{titleCase(col)}</th>)}<th>Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}>{columns[module].map((col) => <td key={col}>{displayValue(module, col, row[col], refs)}</td>)}<td className="actions"><button onClick={() => setEditing(row)}>Edit</button><button className="danger" onClick={() => remove(row.id)}>Delete</button></td></tr>)}</tbody></table>{!rows.length && <div className="empty">No records found.</div>}</div>
    {editing && <Editor module={module} value={editing} refs={refs} saving={saving} onCancel={() => setEditing(null)} onSave={save} />}
  </div>;
}

function Editor({ module, value, refs, onSave, onCancel, saving }) {
  const [form, setForm] = useState(value);
  const fieldList = fields[module];
  function update(key, next) { setForm((old) => ({ ...old, [key]: next })); }
  return <div className="modal-backdrop"><form className="modal" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
    <header><h3>{form.id ? 'Edit' : 'Add'} {titleCase(module.slice(0, -1))}</h3><button type="button" onClick={onCancel}>×</button></header>
    <div className="form-grid">{fieldList.map(([key, label, type = 'text', options]) => {
      if (module === 'users' && form.id && key === 'password') return null;
      if (type === 'textarea') return <label key={key} className="wide">{label}<textarea value={form[key] || ''} onChange={(e) => update(key, e.target.value)} /></label>;
      if (type === 'select') return <label key={key}>{label}<select value={form[key] || ''} onChange={(e) => update(key, e.target.value)}><option value="">Select</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
      if (type === 'relation') return <label key={key}>{label}<select value={form[key] || ''} onChange={(e) => update(key, e.target.value)}><option value="">Select</option>{(refs[options] || []).map((item) => <option value={item.id} key={item.id}>{relationLabel[options]?.(item, refs) || item.name || item.title}</option>)}</select></label>;
      return <label key={key}>{label}<input type={type} value={form[key] || ''} onChange={(e) => update(key, type === 'number' ? Number(e.target.value) : e.target.value)} required={['name', 'title', 'email'].includes(key)} /></label>;
    })}</div>
    <footer><button type="button" onClick={onCancel}>Cancel</button><button className="primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button></footer>
  </form></div>;
}

function Attendance({ refs, refreshRefs }) {
  const today = new Date().toISOString().slice(0, 10);
  const [classId, setClassId] = useState(refs.classes?.[0]?.id || '');
  const [date, setDate] = useState(today);
  const [records, setRecords] = useState({});
  const [message, setMessage] = useState('');
  const students = refs.students.filter((student) => student.classId === classId);
  useEffect(() => {
    const latest = {};
    refs.attendance.filter((item) => item.classId === classId && item.date === date).forEach((item) => { latest[item.studentId] = item.status; });
    setRecords(latest);
  }, [classId, date, refs.attendance]);
  async function save() {
    const payload = students.map((student) => ({ studentId: student.id, status: records[student.id] || 'Present' }));
    const response = await api.saveAttendance({ date, classId, records: payload });
    setMessage(response.message);
    await refreshRefs();
  }
  return <div className="stack"><section className="panel"><div className="toolbar"><label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label><label>Class<select value={classId} onChange={(e) => setClassId(e.target.value)}>{refs.classes.map((klass) => <option key={klass.id} value={klass.id}>{relationLabel.classes(klass)}</option>)}</select></label><button className="primary" onClick={save}>Save Attendance</button></div>{message && <div className="alert success">{message}</div>}<div className="attendance-grid">{students.map((student) => <article key={student.id}><strong>{student.name}</strong><small>{student.rollNo}</small><select value={records[student.id] || 'Present'} onChange={(e) => setRecords((old) => ({ ...old, [student.id]: e.target.value }))}><option>Present</option><option>Absent</option><option>Late</option><option>Leave</option></select></article>)}</div></section><DataModule module="attendance" refs={refs} refreshRefs={refreshRefs} /></div>;
}

function Fees({ refs, refreshRefs }) {
  const [month, setMonth] = useState('September 2026');
  const [dueDate, setDueDate] = useState('2026-09-10');
  const [message, setMessage] = useState('');
  async function generate() {
    const response = await api.generateFees({ month, dueDate });
    setMessage(response.message);
    await refreshRefs();
  }
  return <div className="stack"><section className="panel"><h3>Monthly fee generator</h3><div className="toolbar"><input value={month} onChange={(e) => setMonth(e.target.value)} /><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /><button className="primary" onClick={generate}>Generate Invoices</button></div>{message && <div className="alert success">{message}</div>}</section><DataModule module="fees" refs={refs} refreshRefs={refreshRefs} /></div>;
}

function Exams({ refs, refreshRefs }) {
  return <div className="grid two"><section><h3>Exam schedule</h3><DataModule module="exams" refs={refs} refreshRefs={refreshRefs} /></section><section><h3>Results</h3><DataModule module="results" refs={refs} refreshRefs={refreshRefs} /></section></div>;
}

function Reports({ refs }) {
  const [studentId, setStudentId] = useState(refs.students?.[0]?.id || '');
  const [report, setReport] = useState(null);
  async function load() { if (studentId) setReport(await api.studentReport(studentId)); }
  const totalPaid = report?.fees.reduce((sum, fee) => sum + Number(fee.paid || 0), 0) || 0;
  const totalDue = report?.fees.reduce((sum, fee) => sum + Math.max(Number(fee.amount || 0) - Number(fee.discount || 0) - Number(fee.paid || 0), 0), 0) || 0;
  const present = report?.attendance.filter((item) => ['Present', 'Late'].includes(item.status)).length || 0;
  return <div className="stack"><section className="panel"><div className="toolbar"><select value={studentId} onChange={(e) => setStudentId(e.target.value)}>{refs.students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}</select><button className="primary" onClick={load}>Build Student Report</button><button onClick={() => print()}>Print</button></div></section>{report && <section className="panel report"><h2>{report.student.name}</h2><p>{report.student.admissionNo} · {report.class?.name}-{report.class?.section} · Guardian: {report.student.guardian}</p><div className="cards"><div className="metric-card"><p>Fee Paid</p><strong>Rs {totalPaid.toLocaleString()}</strong></div><div className="metric-card"><p>Fee Due</p><strong>Rs {totalDue.toLocaleString()}</strong></div><div className="metric-card"><p>Attendance</p><strong>{report.attendance.length ? Math.round((present / report.attendance.length) * 100) : 0}%</strong></div></div><h3>Results</h3><table><thead><tr><th>Exam</th><th>Marks</th><th>Grade</th><th>Remarks</th></tr></thead><tbody>{report.results.map((row) => <tr key={row.id}><td>{row.exam?.title}</td><td>{row.marks}/{row.exam?.maxMarks}</td><td>{row.grade}</td><td>{row.remarks}</td></tr>)}</tbody></table></section>}</div>;
}

function App() {
  const [user, setUser] = useState(getSessionUser());
  const [active, setActive] = useState('dashboard');
  const [refs, setRefs] = useState({ students: [], teachers: [], classes: [], subjects: [], exams: [], attendance: [] });

  async function refreshRefs() {
    if (!localStorage.getItem('school_erp_token')) return;
    const [students, teachers, classes, subjects, exams, attendance] = await Promise.all(['students', 'teachers', 'classes', 'subjects', 'exams', 'attendance'].map((module) => api.list(module)));
    setRefs({ students, teachers, classes, subjects, exams, attendance });
  }
  useEffect(() => { refreshRefs().catch(() => clearSession()); }, [user]);
  const page = useMemo(() => {
    if (active === 'dashboard') return <Dashboard setActive={setActive} />;
    if (active === 'attendance') return <Attendance refs={refs} refreshRefs={refreshRefs} />;
    if (active === 'fees') return <Fees refs={refs} refreshRefs={refreshRefs} />;
    if (active === 'exams') return <Exams refs={refs} refreshRefs={refreshRefs} />;
    if (active === 'reports') return <Reports refs={refs} />;
    return <DataModule module={active} refs={refs} refreshRefs={refreshRefs} />;
  }, [active, refs]);

  if (!user) return <Login onLogin={setUser} />;
  return <Layout user={user} active={active} setActive={setActive} onLogout={() => { clearSession(); setUser(null); }}><>{page}</></Layout>;
}

export default App;
