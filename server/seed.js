export const seedData = {
  users: [
    {
      id: 'usr-admin',
      name: 'System Administrator',
      email: 'admin@school.test',
      password: '$2b$10$uKmBRduNl65qif5TBnYTDOrAYWjYPSWvR0qLwAiqSxiIko41ioQPO',
      role: 'Administrator',
      status: 'Active'
    },
    {
      id: 'usr-accountant',
      name: 'Accounts Officer',
      email: 'accounts@school.test',
      password: '$2b$10$uKmBRduNl65qif5TBnYTDOrAYWjYPSWvR0qLwAiqSxiIko41ioQPO',
      role: 'Accountant',
      status: 'Active'
    }
  ],
  teachers: [
    { id: 't-1', employeeNo: 'EMP-001', name: 'Ayesha Khan', gender: 'Female', phone: '+92 300 1111111', email: 'ayesha@school.test', qualification: 'MSc Mathematics', department: 'Science', joiningDate: '2021-08-15', salary: 85000, status: 'Active' },
    { id: 't-2', employeeNo: 'EMP-002', name: 'Bilal Ahmed', gender: 'Male', phone: '+92 300 2222222', email: 'bilal@school.test', qualification: 'MA English', department: 'Languages', joiningDate: '2020-04-01', salary: 78000, status: 'Active' },
    { id: 't-3', employeeNo: 'EMP-003', name: 'Sara Malik', gender: 'Female', phone: '+92 300 3333333', email: 'sara@school.test', qualification: 'MCS', department: 'Computer Science', joiningDate: '2022-01-10', salary: 82000, status: 'Active' }
  ],
  classes: [
    { id: 'c-1', name: 'Class 6', section: 'A', room: 'Room 101', capacity: 35, teacherId: 't-1', monthlyFee: 4500 },
    { id: 'c-2', name: 'Class 7', section: 'A', room: 'Room 102', capacity: 35, teacherId: 't-2', monthlyFee: 5000 },
    { id: 'c-3', name: 'Class 8', section: 'B', room: 'Room 205', capacity: 30, teacherId: 't-3', monthlyFee: 5500 }
  ],
  subjects: [
    { id: 'sub-1', code: 'MATH-6', name: 'Mathematics', classId: 'c-1', teacherId: 't-1', totalMarks: 100 },
    { id: 'sub-2', code: 'ENG-7', name: 'English', classId: 'c-2', teacherId: 't-2', totalMarks: 100 },
    { id: 'sub-3', code: 'CS-8', name: 'Computer Science', classId: 'c-3', teacherId: 't-3', totalMarks: 100 }
  ],
  students: [
    { id: 's-1', admissionNo: 'ADM-1001', name: 'Hamza Ali', gender: 'Male', dob: '2012-03-11', guardian: 'Ali Raza', phone: '+92 311 1234567', email: 'hamza@example.com', classId: 'c-1', rollNo: '06-A-01', address: 'Lahore', admissionDate: '2023-04-05', status: 'Active' },
    { id: 's-2', admissionNo: 'ADM-1002', name: 'Fatima Noor', gender: 'Female', dob: '2011-09-22', guardian: 'Noor Ahmed', phone: '+92 311 2345678', email: 'fatima@example.com', classId: 'c-2', rollNo: '07-A-03', address: 'Karachi', admissionDate: '2022-04-05', status: 'Active' },
    { id: 's-3', admissionNo: 'ADM-1003', name: 'Usman Tariq', gender: 'Male', dob: '2010-12-02', guardian: 'Tariq Mehmood', phone: '+92 311 3456789', email: 'usman@example.com', classId: 'c-3', rollNo: '08-B-02', address: 'Islamabad', admissionDate: '2021-04-08', status: 'Active' },
    { id: 's-4', admissionNo: 'ADM-1004', name: 'Zara Shah', gender: 'Female', dob: '2012-07-19', guardian: 'Shahbaz Shah', phone: '+92 311 4567890', email: 'zara@example.com', classId: 'c-1', rollNo: '06-A-02', address: 'Multan', admissionDate: '2023-05-01', status: 'Active' }
  ],
  attendance: [
    { id: 'a-1', date: '2026-09-01', classId: 'c-1', studentId: 's-1', status: 'Present', remarks: '' },
    { id: 'a-2', date: '2026-09-01', classId: 'c-1', studentId: 's-4', status: 'Late', remarks: 'Arrived at 8:25 AM' },
    { id: 'a-3', date: '2026-09-01', classId: 'c-2', studentId: 's-2', status: 'Present', remarks: '' },
    { id: 'a-4', date: '2026-09-01', classId: 'c-3', studentId: 's-3', status: 'Absent', remarks: 'Parent informed' }
  ],
  fees: [
    { id: 'f-1', invoiceNo: 'INV-1001', studentId: 's-1', month: 'September 2026', amount: 4500, discount: 0, paid: 4500, dueDate: '2026-09-10', paidAt: '2026-09-02', status: 'Paid' },
    { id: 'f-2', invoiceNo: 'INV-1002', studentId: 's-2', month: 'September 2026', amount: 5000, discount: 500, paid: 0, dueDate: '2026-09-10', paidAt: '', status: 'Unpaid' },
    { id: 'f-3', invoiceNo: 'INV-1003', studentId: 's-3', month: 'September 2026', amount: 5500, discount: 0, paid: 2500, dueDate: '2026-09-10', paidAt: '2026-09-03', status: 'Partial' }
  ],
  expenses: [
    { id: 'e-1', title: 'Lab supplies', category: 'Academic', amount: 12000, date: '2026-09-02', paidTo: 'Science Store', status: 'Paid' },
    { id: 'e-2', title: 'Internet bill', category: 'Utilities', amount: 8500, date: '2026-09-04', paidTo: 'ISP', status: 'Paid' }
  ],
  exams: [
    { id: 'ex-1', title: 'First Term', classId: 'c-1', subjectId: 'sub-1', date: '2026-09-20', maxMarks: 100 },
    { id: 'ex-2', title: 'First Term', classId: 'c-2', subjectId: 'sub-2', date: '2026-09-21', maxMarks: 100 }
  ],
  results: [
    { id: 'r-1', examId: 'ex-1', studentId: 's-1', marks: 87, grade: 'A', remarks: 'Excellent' },
    { id: 'r-2', examId: 'ex-1', studentId: 's-4', marks: 74, grade: 'B', remarks: 'Good' },
    { id: 'r-3', examId: 'ex-2', studentId: 's-2', marks: 91, grade: 'A+', remarks: 'Outstanding' }
  ],
  timetable: [
    { id: 'tt-1', classId: 'c-1', day: 'Monday', period: '08:00 - 08:45', subjectId: 'sub-1', teacherId: 't-1' },
    { id: 'tt-2', classId: 'c-2', day: 'Tuesday', period: '09:00 - 09:45', subjectId: 'sub-2', teacherId: 't-2' },
    { id: 'tt-3', classId: 'c-3', day: 'Wednesday', period: '10:00 - 10:45', subjectId: 'sub-3', teacherId: 't-3' }
  ],
  notices: [
    { id: 'n-1', title: 'Parent teacher meeting', audience: 'Parents', date: '2026-09-12', message: 'Parents are invited to meet class teachers on Saturday at 10:00 AM.', priority: 'High' },
    { id: 'n-2', title: 'Science fair registration', audience: 'Students', date: '2026-09-18', message: 'Submit project proposals to the science department before Friday.', priority: 'Medium' }
  ]
};
