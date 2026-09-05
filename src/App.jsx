import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Award, Banknote, BookOpen, CalendarCheck, FileBadge, GraduationCap, LayoutDashboard, LogOut, Menu, Receipt, School, ShieldCheck, UserPlus, UsersRound, WalletCards, X } from 'lucide-react';
import { api, session } from './api.js';

const modules = {
  students: { title: 'Students', icon: GraduationCap, columns: ['admissionNo', 'name', 'className', 'section', 'guardian', 'phone', 'admissionStatus', 'status'], fields: [['admissionNo', 'Admission No'], ['name', 'Name'], ['gender', 'Gender', 'select', ['Male', 'Female', 'Other']], ['dob', 'Date of Birth', 'date'], ['className', 'Class'], ['section', 'Section'], ['rollNo', 'Roll No'], ['guardian', 'Guardian'], ['phone', 'Phone'], ['address', 'Address'], ['admissionStatus', 'Admission Status', 'select', ['Inquiry', 'Interview', 'Admitted', 'Rejected']], ['status', 'Status', 'select', ['Active', 'Inactive', 'Graduated']]] },
  admissions: { title: 'Admissions CRM', icon: UserPlus, columns: ['studentName', 'guardian', 'desiredClass', 'phone', 'leadSource', 'stage', 'assignedTo'], fields: [['studentName', 'Student Name'], ['guardian', 'Guardian'], ['desiredClass', 'Desired Class'], ['phone', 'Phone'], ['leadSource', 'Lead Source', 'select', ['Walk-in', 'Facebook', 'Website', 'Referral']], ['stage', 'Stage', 'select', ['Inquiry', 'Interview', 'Fee Pending', 'Admitted', 'Rejected']], ['assignedTo', 'Assigned To'], ['notes', 'Notes', 'textarea']] },
  teachers: { title: 'Teachers & HR', icon: UsersRound, columns: ['employeeNo', 'name', 'subject', 'department', 'qualification', 'phone', 'salary', 'status'], fields: [['employeeNo', 'Employee No'], ['name', 'Name'], ['subject', 'Subject'], ['department', 'Department'], ['qualification', 'Qualification'], ['phone', 'Phone'], ['salary', 'Salary', 'number'], ['joiningDate', 'Joining Date', 'date'], ['status', 'Status', 'select', ['Active', 'Inactive']]] },
  classes: { title: 'Classes', icon: School, columns: ['name', 'section', 'room', 'capacity', 'classTeacher', 'monthlyFee'], fields: [['name', 'Class'], ['section', 'Section'], ['room', 'Room'], ['capacity', 'Capacity', 'number'], ['classTeacher', 'Class Teacher'], ['monthlyFee', 'Monthly Fee', 'number']] },
  subjects: { title: 'Subjects', icon: BookOpen, columns: ['code', 'name', 'className', 'teacher', 'totalMarks'], fields: [['code', 'Code'], ['name', 'Subject'], ['className', 'Class'], ['teacher', 'Teacher'], ['totalMarks', 'Total Marks', 'number']] },
  attendance: { title: 'Attendance', icon: CalendarCheck, columns: ['date', 'className', 'studentName', 'status', 'remarks'], fields: [['date', 'Date', 'date'], ['className', 'Class'], ['studentName', 'Student'], ['status', 'Status', 'select', ['Present', 'Absent', 'Late', 'Leave']], ['remarks', 'Remarks']] },
  fees: { title: 'Fees & Finance', icon: WalletCards, columns: ['invoiceNo', 'studentName', 'month', 'amount', 'discount', 'paid', 'status', 'dueDate'], fields: [['invoiceNo', 'Invoice No'], ['studentName', 'Student'], ['month', 'Month'], ['amount', 'Amount', 'number'], ['discount', 'Discount', 'number'], ['paid', 'Paid', 'number'], ['dueDate', 'Due Date', 'date']] },
  payroll: { title: 'HR Payroll', icon: Banknote, columns: ['employeeName', 'month', 'grossSalary', 'deductions', 'bonus', 'netSalary', 'status'], fields: [['employeeName', 'Employee'], ['month', 'Month'], ['grossSalary', 'Gross Salary', 'number'], ['deductions', 'Deductions', 'number'], ['bonus', 'Bonus', 'number'], ['netSalary', 'Net Salary', 'number'], ['status', 'Status', 'select', ['Pending', 'Processed', 'Paid']]] },
  expenses: { title: 'Expenses', icon: Receipt, columns: ['title', 'category', 'amount', 'date', 'paidTo', 'status'], fields: [['title', 'Title'], ['category', 'Category', 'select', ['Academic', 'Utilities', 'Maintenance', 'Salary', 'Transport', 'Other']], ['amount', 'Amount', 'number'], ['date', 'Date', 'date'], ['paidTo', 'Paid To'], ['status', 'Status', 'select', ['Paid', 'Pending']]] },
  exams: { title: 'Exams', icon: Award, columns: ['title', 'className', 'subject', 'date', 'maxMarks', 'status'], fields: [['title', 'Exam Title'], ['className', 'Class'], ['subject', 'Subject'], ['date', 'Date', 'date'], ['maxMarks', 'Max Marks', 'number'], ['status', 'Status', 'select', ['Draft', 'Scheduled', 'Completed']]] },
  results: { title: 'Results', icon: Award, columns: ['examTitle', 'studentName', 'subject', 'marks', 'maxMarks', 'grade', 'remarks'], fields: [['examTitle', 'Exam'], ['studentName', 'Student'], ['subject', 'Subject'], ['marks', 'Marks', 'number'], ['maxMarks', 'Max Marks', 'number'], ['remarks', 'Remarks']] },
  certificates: { title: 'Certificates', icon: FileBadge, columns: ['certificateNo', 'studentName', 'type', 'issueDate', 'purpose', 'issuedBy', 'status'], fields: [['certificateNo', 'Certificate No'], ['studentName', 'Student'], ['type', 'Type', 'select', ['Bonafide', 'Character', 'Transfer', 'Fee Clearance', 'Achievement']], ['issueDate', 'Issue Date', 'date'], ['purpose', 'Purpose'], ['issuedBy', 'Issued By'], ['status', 'Status', 'select', ['Draft', 'Issued']]] },
  notices: { title: 'Notices', icon: ShieldCheck, columns: ['title', 'audience', 'date', 'priority', 'message'], fields: [['title', 'Title'], ['audience', 'Audience', 'select', ['All', 'Students', 'Parents', 'Teachers']], ['date', 'Date', 'date'], ['priority', 'Priority', 'select', ['Low', 'Medium', 'High']], ['message', 'Message', 'textarea']] },
  users: { title: 'Users & Roles', icon: ShieldCheck, columns: ['name', 'email', 'role', 'permissions', 'status'], fields: [['name', 'Name'], ['email', 'Email'], ['password', 'Password', 'password'], ['role', 'Role', 'select', ['Super Admin', 'Principal', 'Teacher', 'Accountant', 'Reception']], ['permissions', 'Permissions comma separated'], ['status', 'Status', 'select', ['Active', 'Inactive']]] }
};

const nav = [
  ['/', 'Dashboard', LayoutDashboard],
  ...Object.entries(modules).map(([key, value]) => [`/${key}`, value.title, value.icon])
];
const colors = ['#2563eb', '#f59e0b', '#ef4444', '#10b981'];
const format = (value) => typeof value === 'number' ? value.toLocaleString() : Array.isArray(value) ? value.join(', ') : value || '—';
const today = () => new Date().toISOString().slice(0, 10);

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: 'admin@eduflow.test', password: 'password123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = await api.login(form);
      session.set(payload);
      onLogin(payload.user);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }
  return <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#2563eb55,transparent_35%),radial-gradient(circle_at_bottom_right,#14b8a655,transparent_30%)]" />
    <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
      <section>
        <span className="badge bg-white/10 text-cyan-200">MERN SaaS School Management</span>
        <h1 className="mt-6 text-5xl font-black leading-tight md:text-6xl">Run every school department from one modern ERP.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">Admissions, students, teachers, HR payroll, fees, exams, results and certificate generation in a production-style React, Tailwind, Node and MongoDB architecture.</p>
        <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-slate-200">
          {['Role-based access', 'SaaS school tenant', 'MongoDB ready', 'Printable certificates'].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">✓ {item}</div>)}
        </div>
      </section>
      <form onSubmit={submit} className="rounded-[2rem] border border-white/10 bg-white p-8 text-slate-900 shadow-2xl">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-black text-white">EF</div>
        <h2 className="text-3xl font-black">Welcome to EduFlow</h2>
        <p className="mt-2 text-slate-500">Demo login is already filled in.</p>
        {error && <div className="mt-5 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</div>}
        <div className="mt-6 grid gap-4">
          <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
          <p className="text-center text-xs text-slate-500">admin@eduflow.test / password123</p>
        </div>
      </form>
    </div>
  </main>;
}

function Shell({ user, setUser }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  function logout() { session.clear(); setUser(null); navigate('/'); }
  return <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[290px_1fr]">
    <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 p-5 text-white transition lg:static lg:w-auto lg:translate-x-0`}>
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 font-black">EF</div><div><strong className="text-lg">EduFlow SaaS</strong><p className="text-xs text-slate-400">School Management</p></div></div>
        <button className="lg:hidden" onClick={() => setOpen(false)}><X /></button>
      </div>
      <nav className="grid gap-1">{nav.map(([path, label, Icon]) => <Link key={path} to={path} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${location.pathname === path ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon size={18} />{label}</Link>)}</nav>
    </aside>
    <main className="min-w-0 p-4 md:p-6">
      <header className="mb-6 flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3"><button className="btn-soft lg:hidden" onClick={() => setOpen(true)}><Menu size={18} /></button><div><h1 className="text-xl font-black md:text-2xl">{nav.find(([p]) => p === location.pathname)?.[1] || 'EduFlow'}</h1><p className="text-sm text-slate-500">{user.name} · {user.role}</p></div></div>
        <button className="btn-soft flex items-center gap-2" onClick={logout}><LogOut size={16} /> Logout</button>
      </header>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {Object.keys(modules).map((name) => <Route key={name} path={`/${name}`} element={name === 'attendance' ? <Attendance /> : name === 'fees' ? <Fees /> : name === 'payroll' ? <Payroll /> : name === 'certificates' ? <Certificates /> : <ModulePage name={name} />} />)}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </main>
  </div>;
}

function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.dashboard().then(setData); }, []);
  if (!data) return <div className="card animate-pulse">Loading dashboard...</div>;
  const kpis = [
    ['Students', data.kpis.students, GraduationCap], ['Teachers', data.kpis.teachers, UsersRound], ['Admissions', data.kpis.admissions, UserPlus], ['Revenue', `Rs ${data.kpis.revenue.toLocaleString()}`, WalletCards], ['Dues', `Rs ${data.kpis.due.toLocaleString()}`, Receipt], ['Payroll', `Rs ${data.kpis.payroll.toLocaleString()}`, Banknote], ['Expenses', `Rs ${data.kpis.expenses.toLocaleString()}`, Banknote], ['Attendance', `${data.kpis.attendance}%`, CalendarCheck]
  ];
  const revenue = [{ month: 'Jun', revenue: 180000 }, { month: 'Jul', revenue: 230000 }, { month: 'Aug', revenue: 260000 }, { month: 'Sep', revenue: data.kpis.revenue }];
  return <div className="grid gap-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(([label, value, Icon]) => <div key={label} className="card"><div className="mb-4 flex items-center justify-between"><div className="rounded-2xl bg-brand-50 p-3 text-brand-600"><Icon size={22} /></div><span className="text-xs font-black text-emerald-600">Live</span></div><p className="text-sm font-bold text-slate-500">{label}</p><strong className="mt-1 block text-2xl font-black">{value}</strong></div>)}</div>
    <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <section className="card"><h2 className="mb-4 text-lg font-black">Finance trend</h2><ResponsiveContainer width="100%" height={280}><AreaChart data={revenue}><defs><linearGradient id="rev" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.35}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month"/><YAxis/><Tooltip/><Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="url(#rev)" strokeWidth={3}/></AreaChart></ResponsiveContainer></section>
      <section className="card"><h2 className="mb-4 text-lg font-black">Fee status</h2><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={data.feeStatus} dataKey="value" nameKey="name" outerRadius={100} label>{data.feeStatus.map((_, i) => <Cell key={i} fill={colors[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></section>
    </div>
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="card"><h2 className="mb-4 text-lg font-black">Class strength</h2><ResponsiveContainer width="100%" height={260}><BarChart data={data.classStrength}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="students" fill="#2563eb" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></section>
      <section className="card"><h2 className="mb-4 text-lg font-black">Admission pipeline</h2><div className="grid gap-3">{data.admissions.map((item) => <div className="rounded-2xl border border-slate-100 p-4" key={item.id}><strong>{item.studentName}</strong><p className="text-sm text-slate-500">{item.desiredClass} · {item.stage} · {item.phone}</p></div>)}</div></section>
    </div>
  </div>;
}

function ModulePage({ name }) {
  const meta = modules[name];
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState('');
  async function load() { setRows(await api.list(name, q)); }
  useEffect(() => { load().catch((err) => setError(err.message)); }, [name]);
  async function save(payload) {
    if (payload.permissions && typeof payload.permissions === 'string') payload.permissions = payload.permissions.split(',').map((x) => x.trim()).filter(Boolean);
    if (payload.id) await api.update(name, payload.id, payload); else await api.create(name, payload);
    setEdit(null); await load();
  }
  async function del(id) { if (confirm('Delete this record?')) { await api.remove(name, id); await load(); } }
  return <div className="grid gap-5">
    <div className="card flex flex-wrap items-end gap-3"><label className="min-w-64 flex-1">Search<input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} placeholder={`Search ${meta.title}`} /></label><button className="btn-soft" onClick={load}>Search</button><button className="btn-primary" onClick={() => setEdit({})}>Add {meta.title}</button></div>
    {error && <div className="rounded-2xl bg-rose-50 p-4 font-bold text-rose-700">{error}</div>}
    <DataTable name={name} rows={rows} onEdit={setEdit} onDelete={del} />
    {edit && <Editor name={name} value={edit} onCancel={() => setEdit(null)} onSave={save} />}
  </div>;
}

function DataTable({ name, rows, onEdit, onDelete }) {
  const meta = modules[name];
  return <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft"><div className="overflow-auto"><table><thead><tr>{meta.columns.map((col) => <th key={col}>{col}</th>)}<th>Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}>{meta.columns.map((col) => <td key={col}>{format(row[col])}</td>)}<td className="whitespace-nowrap"><button className="btn-soft mr-2" onClick={() => onEdit(row)}>Edit</button><button className="btn-danger" onClick={() => onDelete(row.id)}>Delete</button></td></tr>)}</tbody></table></div>{!rows.length && <div className="p-8 text-center font-bold text-slate-500">No records found.</div>}</div>;
}

function Editor({ name, value, onSave, onCancel }) {
  const [form, setForm] = useState(value);
  const meta = modules[name];
  const set = (key, val, type) => setForm((old) => ({ ...old, [key]: type === 'number' ? Number(val) : val }));
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4"><form className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-[2rem] bg-white p-6 shadow-2xl" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
    <div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-black">{form.id ? 'Edit' : 'Add'} {meta.title}</h2><button type="button" className="btn-soft" onClick={onCancel}>Close</button></div>
    <div className="grid gap-4 md:grid-cols-2">{meta.fields.map(([key, label, type = 'text', options]) => {
      if (name === 'users' && form.id && key === 'password') return null;
      if (type === 'textarea') return <label className="md:col-span-2" key={key}>{label}<textarea value={form[key] || ''} onChange={(e) => set(key, e.target.value, type)} /></label>;
      if (type === 'select') return <label key={key}>{label}<select value={form[key] || ''} onChange={(e) => set(key, e.target.value, type)}><option value="">Select</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
      return <label key={key}>{label}<input type={type} value={Array.isArray(form[key]) ? form[key].join(', ') : form[key] || ''} onChange={(e) => set(key, e.target.value, type)} required={['name', 'studentName', 'title', 'email'].includes(key)} /></label>;
    })}</div>
    <div className="mt-6 flex justify-end gap-3"><button type="button" className="btn-soft" onClick={onCancel}>Cancel</button><button className="btn-primary">Save</button></div>
  </form></div>;
}

function Attendance() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [meta, setMeta] = useState({ date: today(), className: 'Grade 6' });
  const [message, setMessage] = useState('');
  useEffect(() => { api.list('students').then(setStudents); }, []);
  const filtered = students.filter((s) => s.className === meta.className);
  async function submit() {
    const payload = filtered.map((s) => ({ studentName: s.name, status: records[s.id] || 'Present', remarks: '' }));
    const res = await api.markAttendance({ ...meta, records: payload }); setMessage(res.message);
  }
  return <div className="grid gap-5"><section className="card"><div className="flex flex-wrap items-end gap-3"><label>Date<input type="date" value={meta.date} onChange={(e) => setMeta({ ...meta, date: e.target.value })} /></label><label>Class<select value={meta.className} onChange={(e) => setMeta({ ...meta, className: e.target.value })}>{['Grade 6', 'Grade 7', 'Grade 8'].map((x) => <option key={x}>{x}</option>)}</select></label><button className="btn-primary" onClick={submit}>Save Attendance</button></div>{message && <p className="mt-4 rounded-2xl bg-emerald-50 p-3 font-bold text-emerald-700">{message}</p>}<div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filtered.map((s) => <article className="rounded-2xl border border-slate-200 p-4" key={s.id}><strong>{s.name}</strong><p className="text-sm text-slate-500">{s.rollNo}</p><select className="mt-3" value={records[s.id] || 'Present'} onChange={(e) => setRecords({ ...records, [s.id]: e.target.value })}><option>Present</option><option>Absent</option><option>Late</option><option>Leave</option></select></article>)}</div></section><ModulePage name="attendance" /></div>;
}

function Fees() {
  const [form, setForm] = useState({ month: 'September 2026', dueDate: '2026-09-10' });
  const [msg, setMsg] = useState('');
  async function generate() { const res = await api.generateFees(form); setMsg(res.message); }
  return <div className="grid gap-5"><section className="card"><h2 className="mb-4 text-lg font-black">Monthly invoice generator</h2><div className="flex flex-wrap items-end gap-3"><label>Month<input value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} /></label><label>Due Date<input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></label><button className="btn-primary" onClick={generate}>Generate Invoices</button></div>{msg && <p className="mt-4 rounded-2xl bg-emerald-50 p-3 font-bold text-emerald-700">{msg}</p>}</section><ModulePage name="fees" /></div>;
}

function Payroll() {
  const [month, setMonth] = useState('September 2026');
  const [msg, setMsg] = useState('');
  async function process() { const res = await api.processPayroll({ month }); setMsg(res.message); }
  return <div className="grid gap-5"><section className="card"><h2 className="mb-4 text-lg font-black">Payroll processor</h2><div className="flex flex-wrap items-end gap-3"><label>Month<input value={month} onChange={(e) => setMonth(e.target.value)} /></label><button className="btn-primary" onClick={process}>Prepare Salary Slips</button></div>{msg && <p className="mt-4 rounded-2xl bg-emerald-50 p-3 font-bold text-emerald-700">{msg}</p>}</section><ModulePage name="payroll" /></div>;
}

function Certificates() {
  const [selected, setSelected] = useState(null);
  return <div className="grid gap-5"><ModulePage name="certificates" /><section className="card"><h2 className="mb-4 text-lg font-black">Certificate print preview</h2><button className="btn-soft mb-4" onClick={async () => setSelected((await api.list('certificates'))[0])}>Load Latest Certificate</button>{selected && <div className="mx-auto max-w-3xl border-4 border-double border-slate-800 bg-white p-10 text-center print:border-slate-900"><h1 className="text-4xl font-black">Certificate of {selected.type}</h1><p className="mt-8 text-lg leading-9">This is to certify that <b>{selected.studentName}</b> has been issued this certificate for <b>{selected.purpose}</b>.</p><p className="mt-6">Certificate No: {selected.certificateNo} · Date: {selected.issueDate}</p><div className="mt-16 flex justify-between"><span>School Seal</span><span>{selected.issuedBy}<br/>Authorized Signature</span></div><button className="btn-primary mt-8 print:hidden" onClick={() => print()}>Print Certificate</button></div>}</section></div>;
}

function App() {
  const [user, setUser] = useState(session.user());
  if (!user) return <Login onLogin={setUser} />;
  return <Shell user={user} setUser={setUser} />;
}

export default App;
