export const passwordHash = '$2b$10$uKmBRduNl65qif5TBnYTDOrAYWjYPSWvR0qLwAiqSxiIko41ioQPO';

export const seed = {
  schools: [
    { id: 'school-1', name: 'EduFlow Model School', slug: 'eduflow', plan: 'Pro', city: 'Rawalpindi', owner: 'System Administrator', status: 'Active' }
  ],
  users: [
    { id: 'u-admin', schoolId: 'school-1', name: 'System Administrator', email: 'admin@eduflow.test', password: passwordHash, role: 'Super Admin', permissions: ['all'], status: 'Active' },
    { id: 'u-principal', schoolId: 'school-1', name: 'Principal Office', email: 'principal@eduflow.test', password: passwordHash, role: 'Principal', permissions: ['academics', 'hr', 'finance'], status: 'Active' },
    { id: 'u-accountant', schoolId: 'school-1', name: 'Finance Manager', email: 'finance@eduflow.test', password: passwordHash, role: 'Accountant', permissions: ['finance'], status: 'Active' }
  ],
  students: [
    { id: 'stu-1001', schoolId: 'school-1', admissionNo: 'ADM-1001', name: 'Hamza Ali', gender: 'Male', dob: '2012-03-11', className: 'Grade 6', section: 'A', rollNo: '06-A-01', guardian: 'Ali Raza', phone: '+92 311 1234567', address: 'Rawalpindi', admissionStatus: 'Admitted', status: 'Active' },
    { id: 'stu-1002', schoolId: 'school-1', admissionNo: 'ADM-1002', name: 'Fatima Noor', gender: 'Female', dob: '2011-09-22', className: 'Grade 7', section: 'A', rollNo: '07-A-03', guardian: 'Noor Ahmed', phone: '+92 311 2345678', address: 'Islamabad', admissionStatus: 'Admitted', status: 'Active' },
    { id: 'stu-1003', schoolId: 'school-1', admissionNo: 'ADM-1003', name: 'Usman Tariq', gender: 'Male', dob: '2010-12-02', className: 'Grade 8', section: 'B', rollNo: '08-B-02', guardian: 'Tariq Mehmood', phone: '+92 311 3456789', address: 'Lahore', admissionStatus: 'Admitted', status: 'Active' },
    { id: 'stu-1004', schoolId: 'school-1', admissionNo: 'ADM-1004', name: 'Zara Shah', gender: 'Female', dob: '2012-07-19', className: 'Grade 6', section: 'A', rollNo: '06-A-02', guardian: 'Shahbaz Shah', phone: '+92 311 4567890', address: 'Multan', admissionStatus: 'Inquiry', status: 'Active' }
  ],
  teachers: [
    { id: 'tea-001', schoolId: 'school-1', employeeNo: 'EMP-001', name: 'Ayesha Khan', subject: 'Mathematics', department: 'Science', qualification: 'MSc Mathematics', phone: '+92 300 1111111', salary: 85000, joiningDate: '2021-08-15', status: 'Active' },
    { id: 'tea-002', schoolId: 'school-1', employeeNo: 'EMP-002', name: 'Bilal Ahmed', subject: 'English', department: 'Languages', qualification: 'MA English', phone: '+92 300 2222222', salary: 78000, joiningDate: '2020-04-01', status: 'Active' },
    { id: 'tea-003', schoolId: 'school-1', employeeNo: 'EMP-003', name: 'Sara Malik', subject: 'Computer Science', department: 'IT', qualification: 'MCS', phone: '+92 300 3333333', salary: 82000, joiningDate: '2022-01-10', status: 'Active' }
  ],
  classes: [
    { id: 'cls-6a', schoolId: 'school-1', name: 'Grade 6', section: 'A', room: 'Room 101', capacity: 35, classTeacher: 'Ayesha Khan', monthlyFee: 4500 },
    { id: 'cls-7a', schoolId: 'school-1', name: 'Grade 7', section: 'A', room: 'Room 102', capacity: 35, classTeacher: 'Bilal Ahmed', monthlyFee: 5000 },
    { id: 'cls-8b', schoolId: 'school-1', name: 'Grade 8', section: 'B', room: 'Room 205', capacity: 30, classTeacher: 'Sara Malik', monthlyFee: 5500 }
  ],
  subjects: [
    { id: 'sub-math', schoolId: 'school-1', code: 'MATH-6', name: 'Mathematics', className: 'Grade 6', teacher: 'Ayesha Khan', totalMarks: 100 },
    { id: 'sub-eng', schoolId: 'school-1', code: 'ENG-7', name: 'English', className: 'Grade 7', teacher: 'Bilal Ahmed', totalMarks: 100 },
    { id: 'sub-cs', schoolId: 'school-1', code: 'CS-8', name: 'Computer Science', className: 'Grade 8', teacher: 'Sara Malik', totalMarks: 100 }
  ],
  admissions: [
    { id: 'adm-01', schoolId: 'school-1', studentName: 'Maham Iqbal', guardian: 'Iqbal Hussain', desiredClass: 'Grade 5', phone: '+92 322 1234567', leadSource: 'Walk-in', stage: 'Interview', assignedTo: 'Reception', notes: 'Interview scheduled this week' },
    { id: 'adm-02', schoolId: 'school-1', studentName: 'Danish Khan', guardian: 'Akram Khan', desiredClass: 'Grade 9', phone: '+92 322 7654321', leadSource: 'Facebook', stage: 'Fee Pending', assignedTo: 'Accounts', notes: 'Admission approved' }
  ],
  attendance: [
    { id: 'att-01', schoolId: 'school-1', date: '2026-09-04', className: 'Grade 6', studentName: 'Hamza Ali', status: 'Present', remarks: '' },
    { id: 'att-02', schoolId: 'school-1', date: '2026-09-04', className: 'Grade 6', studentName: 'Zara Shah', status: 'Late', remarks: 'Arrived 8:20 AM' },
    { id: 'att-03', schoolId: 'school-1', date: '2026-09-04', className: 'Grade 7', studentName: 'Fatima Noor', status: 'Present', remarks: '' },
    { id: 'att-04', schoolId: 'school-1', date: '2026-09-04', className: 'Grade 8', studentName: 'Usman Tariq', status: 'Absent', remarks: 'Parent informed' }
  ],
  fees: [
    { id: 'fee-01', schoolId: 'school-1', invoiceNo: 'INV-1001', studentName: 'Hamza Ali', month: 'September 2026', amount: 4500, discount: 0, paid: 4500, status: 'Paid', dueDate: '2026-09-10' },
    { id: 'fee-02', schoolId: 'school-1', invoiceNo: 'INV-1002', studentName: 'Fatima Noor', month: 'September 2026', amount: 5000, discount: 500, paid: 0, status: 'Unpaid', dueDate: '2026-09-10' },
    { id: 'fee-03', schoolId: 'school-1', invoiceNo: 'INV-1003', studentName: 'Usman Tariq', month: 'September 2026', amount: 5500, discount: 0, paid: 2500, status: 'Partial', dueDate: '2026-09-10' }
  ],
  payroll: [
    { id: 'pay-01', schoolId: 'school-1', employeeName: 'Ayesha Khan', month: 'September 2026', grossSalary: 85000, deductions: 3000, bonus: 5000, netSalary: 87000, status: 'Processed' },
    { id: 'pay-02', schoolId: 'school-1', employeeName: 'Bilal Ahmed', month: 'September 2026', grossSalary: 78000, deductions: 2000, bonus: 0, netSalary: 76000, status: 'Pending' }
  ],
  expenses: [
    { id: 'exp-01', schoolId: 'school-1', title: 'Lab supplies', category: 'Academic', amount: 12000, date: '2026-09-02', paidTo: 'Science Store', status: 'Paid' },
    { id: 'exp-02', schoolId: 'school-1', title: 'Internet bill', category: 'Utilities', amount: 8500, date: '2026-09-04', paidTo: 'ISP', status: 'Paid' }
  ],
  exams: [
    { id: 'exam-01', schoolId: 'school-1', title: 'First Term', className: 'Grade 6', subject: 'Mathematics', date: '2026-09-20', maxMarks: 100, status: 'Scheduled' },
    { id: 'exam-02', schoolId: 'school-1', title: 'First Term', className: 'Grade 7', subject: 'English', date: '2026-09-21', maxMarks: 100, status: 'Scheduled' }
  ],
  results: [
    { id: 'res-01', schoolId: 'school-1', examTitle: 'First Term', studentName: 'Hamza Ali', subject: 'Mathematics', marks: 87, maxMarks: 100, grade: 'A', remarks: 'Excellent' },
    { id: 'res-02', schoolId: 'school-1', examTitle: 'First Term', studentName: 'Fatima Noor', subject: 'English', marks: 91, maxMarks: 100, grade: 'A+', remarks: 'Outstanding' }
  ],
  certificates: [
    { id: 'cert-01', schoolId: 'school-1', certificateNo: 'CERT-1001', studentName: 'Hamza Ali', type: 'Bonafide', issueDate: '2026-09-04', purpose: 'Bank account opening', issuedBy: 'Principal', status: 'Issued' }
  ],
  notices: [
    { id: 'not-01', schoolId: 'school-1', title: 'Parent Teacher Meeting', audience: 'Parents', date: '2026-09-12', priority: 'High', message: 'Parents are invited to meet class teachers at 10:00 AM.' },
    { id: 'not-02', schoolId: 'school-1', title: 'Science Fair Registration', audience: 'Students', date: '2026-09-18', priority: 'Medium', message: 'Submit project proposals before Friday.' }
  ]
};
