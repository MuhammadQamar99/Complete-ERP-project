# EduFlow SaaS School Management System - Complete Project Documentation

## 1. Project Overview

**EduFlow SaaS** is a full-stack school management system built with the MERN-style architecture requested from the tutorial idea:

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB through Mongoose when configured
- **Development fallback:** Local JSON file storage when MongoDB is not configured
- **Authentication:** JWT tokens and bcrypt password hashing
- **UI libraries:** Recharts for dashboard charts and Lucide React for icons

The system is designed as a **SaaS school ERP**, meaning the data model includes a `schoolId` on most records. This allows the project to be extended later for multiple schools/tenants using one application.

In simple words: this is a web application where a school admin can log in and manage admissions, students, teachers, classes, subjects, attendance, fees, payroll, expenses, exams, results, certificates, notices, users and roles.

---

## 2. Main Features We Created

### 2.1 Authentication

The app has a login screen. Users enter email and password. The backend checks the user in the data store, compares the password using bcrypt, and returns a JWT token.

Demo accounts:

```text
admin@eduflow.test / password123
principal@eduflow.test / password123
finance@eduflow.test / password123
```

After login, the token is saved in browser `localStorage`. All future API requests include this token in the `Authorization` header.

### 2.2 Admin Dashboard

The dashboard displays important school KPIs:

- Total students
- Total teachers
- Admission inquiries/pipeline count
- Revenue collected
- Fee dues
- Payroll amount
- Expenses
- Attendance percentage

It also includes charts:

- Finance trend area chart
- Fee status pie chart
- Class strength bar chart
- Admission pipeline list

### 2.3 Students Module

The Students module manages student records.

Fields include:

- Admission number
- Name
- Gender
- Date of birth
- Class
- Section
- Roll number
- Guardian name
- Phone number
- Address
- Admission status
- Current status

This module can add, edit, delete and search student records.

### 2.4 Admissions CRM

This module tracks new admission leads before they become full students.

Fields include:

- Student name
- Guardian name
- Desired class
- Phone
- Lead source
- Stage
- Assigned staff member
- Notes

Example stages:

- Inquiry
- Interview
- Fee Pending
- Admitted
- Rejected

This helps a school manage the full admission process.

### 2.5 Teachers and HR Module

This module manages teachers/staff.

Fields include:

- Employee number
- Name
- Subject
- Department
- Qualification
- Phone
- Salary
- Joining date
- Status

This module connects with payroll because the payroll processor uses teacher salary data.

### 2.6 Classes Module

The Classes module stores class/section setup.

Fields include:

- Class name
- Section
- Room
- Capacity
- Class teacher
- Monthly fee

This is used for student grouping and fee generation.

### 2.7 Subjects Module

The Subjects module handles academic subjects.

Fields include:

- Subject code
- Subject name
- Class name
- Teacher
- Total marks

### 2.8 Attendance Module

The Attendance module has two parts:

1. A workflow screen for marking attendance class-wise.
2. A records table for attendance entries.

Attendance statuses:

- Present
- Absent
- Late
- Leave

The workflow lets the admin choose a date and class, then mark each student quickly.

### 2.9 Fees and Finance Module

The Fees module manages invoices and payments.

Fields include:

- Invoice number
- Student name
- Month
- Amount
- Discount
- Paid amount
- Status
- Due date

Fee status is automatically calculated on the backend:

- If paid amount is 0, status becomes `Unpaid`.
- If paid amount is less than net payable, status becomes `Partial`.
- If paid amount is equal to or greater than net payable, status becomes `Paid`.

There is also a **monthly invoice generator** workflow. It creates fee invoices for active students based on their class monthly fee.

### 2.10 Payroll Module

The Payroll module manages teacher/staff salary slips.

Fields include:

- Employee name
- Month
- Gross salary
- Deductions
- Bonus
- Net salary
- Status

There is a **payroll processor** workflow that creates salary slips for all teachers based on their salary field.

### 2.11 Expenses Module

The Expenses module records school spending.

Fields include:

- Title
- Category
- Amount
- Date
- Paid to
- Status

Example categories:

- Academic
- Utilities
- Maintenance
- Salary
- Transport
- Other

Expenses are used in dashboard profit calculation.

### 2.12 Exams Module

The Exams module stores exam schedules.

Fields include:

- Exam title
- Class
- Subject
- Date
- Maximum marks
- Status

Example statuses:

- Draft
- Scheduled
- Completed

### 2.13 Results Module

The Results module stores student marks.

Fields include:

- Exam title
- Student name
- Subject
- Marks
- Maximum marks
- Grade
- Remarks

Grade is automatically calculated by the backend:

```text
90% and above = A+
80% to 89%   = A
70% to 79%   = B
60% to 69%   = C
50% to 59%   = D
Below 50%    = F
```

### 2.14 Certificates Module

The Certificates module manages certificate records and includes a print preview.

Certificate fields include:

- Certificate number
- Student name
- Certificate type
- Issue date
- Purpose
- Issued by
- Status

Example certificate types:

- Bonafide
- Character
- Transfer
- Fee Clearance
- Achievement

The module has a printable certificate preview using the browser print function.

### 2.15 Notices Module

The Notices module manages announcements.

Fields include:

- Title
- Audience
- Date
- Priority
- Message

Audiences:

- All
- Students
- Parents
- Teachers

Priorities:

- Low
- Medium
- High

### 2.16 Users and Roles Module

The Users module manages system users.

Fields include:

- Name
- Email
- Password
- Role
- Permissions
- Status

Example roles:

- Super Admin
- Principal
- Teacher
- Accountant
- Reception

Passwords are hashed before being stored.

---

## 3. Technology Stack Explanation

### 3.1 React

React is used to build the frontend user interface. The complete frontend is mainly inside:

```text
src/App.jsx
```

React components created include:

- `Login`
- `Shell`
- `Dashboard`
- `ModulePage`
- `DataTable`
- `Editor`
- `Attendance`
- `Fees`
- `Payroll`
- `Certificates`

### 3.2 Vite

Vite is used as the frontend build tool and development server.

Config file:

```text
vite.config.js
```

It runs the frontend on:

```text
http://localhost:5173
```

It also proxies `/api` requests to the backend server on port `5000`.

### 3.3 Tailwind CSS

Tailwind CSS is used for styling. It allows fast UI development using utility classes.

Files:

```text
tailwind.config.js
postcss.config.js
src/style.css
```

### 3.4 Express.js

Express is used for the backend API server.

Main backend file:

```text
server/server.js
```

It runs on:

```text
http://localhost:5000
```

### 3.5 MongoDB and Mongoose

The project supports MongoDB through Mongoose.

If this environment variable is set:

```text
MONGODB_URI
```

then the backend connects to MongoDB.

If it is not set, the app uses local JSON storage so the project works immediately without database setup.

### 3.6 JSON Storage Fallback

For easy local testing, if MongoDB is not configured, the backend saves data to:

```text
server/storage/eduflow-db.json
```

This file is ignored by Git because it is local runtime data.

### 3.7 JWT

JWT means JSON Web Token. It is used for login sessions.

Flow:

1. User submits login form.
2. Backend verifies password.
3. Backend creates JWT token.
4. Frontend stores token in localStorage.
5. Frontend sends token with each API request.
6. Backend verifies token before allowing access.

### 3.8 bcryptjs

bcryptjs is used to hash passwords. The backend never stores plain passwords for new users.

---

## 4. Folder and File Structure

```text
Complete-ERP-project/
├── .env.example
├── .gitignore
├── README.md
├── PROJECT_DOCUMENTATION.md
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── server/
│   ├── dataStore.js
│   ├── seed.js
│   └── server.js
└── src/
    ├── api.js
    ├── App.jsx
    ├── main.jsx
    └── style.css
```

### 4.1 `package.json`

This file contains project name, dependencies and scripts.

Important scripts:

```json
"dev": "concurrently \"npm run server\" \"npm run client\""
```

Runs frontend and backend together.

```json
"server": "node server/server.js"
```

Runs backend only.

```json
"client": "vite --host 0.0.0.0"
```

Runs frontend only.

```json
"build": "vite build"
```

Builds frontend for production.

```json
"start": "NODE_ENV=production node server/server.js"
```

Runs the production server.

```json
"lint": "node --check server/server.js && node --check server/dataStore.js && vite build"
```

Checks backend syntax and verifies frontend build.

### 4.2 `.env.example`

Shows which environment variables can be used.

```env
PORT=5000
JWT_SECRET=change-this-secret
MONGODB_URI=mongodb://127.0.0.1:27017/eduflow_saas
MONGODB_DB=eduflow_saas
```

### 4.3 `server/server.js`

This is the main Express API server.

It handles:

- Express setup
- CORS
- JSON parsing
- Request logging
- Health route
- Login route
- JWT middleware
- Dashboard route
- Generic CRUD routes
- Attendance workflow
- Fee generation workflow
- Payroll workflow
- Production frontend serving

### 4.4 `server/dataStore.js`

This file abstracts the database logic.

It supports two storage modes:

1. MongoDB mode if `MONGODB_URI` exists.
2. JSON mode if `MONGODB_URI` is missing.

Important functions:

- `connectStore()`
- `hasCollection()`
- `list()`
- `findOne()`
- `create()`
- `update()`
- `remove()`
- `allForDashboard()`

This makes the rest of the backend independent from whether the app uses MongoDB or JSON.

### 4.5 `server/seed.js`

This file contains initial demo data:

- School
- Users
- Students
- Teachers
- Classes
- Subjects
- Admissions
- Attendance
- Fees
- Payroll
- Expenses
- Exams
- Results
- Certificates
- Notices

### 4.6 `src/api.js`

This file contains the frontend API client.

It uses Axios and automatically attaches the JWT token to requests.

Main exports:

- `api.login()`
- `api.dashboard()`
- `api.list()`
- `api.create()`
- `api.update()`
- `api.remove()`
- `api.markAttendance()`
- `api.generateFees()`
- `api.processPayroll()`
- `session.set()`
- `session.user()`
- `session.clear()`

### 4.7 `src/App.jsx`

This is the main React application.

It contains:

- Module definitions
- Navigation setup
- Login page
- Main layout
- Dashboard charts
- Generic CRUD table
- Modal editor
- Attendance workflow
- Fee workflow
- Payroll workflow
- Certificate print preview

### 4.8 `src/main.jsx`

This mounts the React app into the page and wraps it with `BrowserRouter`.

### 4.9 `src/style.css`

This imports Tailwind and defines reusable component classes:

- `.btn`
- `.btn-primary`
- `.btn-soft`
- `.btn-danger`
- `.card`
- `.badge`

---

## 5. How the Application Works Internally

### 5.1 Development Startup Flow

When you run:

```bash
npm run dev
```

this command starts both servers using `concurrently`:

1. Backend Express server:

```bash
npm run server
```

2. Frontend Vite server:

```bash
npm run client
```

Frontend opens on port `5173` and backend runs on port `5000`.

### 5.2 Login Flow

1. User enters email and password on React login screen.
2. React calls:

```text
POST /api/auth/login
```

3. Express finds user by email.
4. Express compares password using bcrypt.
5. If valid, Express returns:

```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "u-admin",
    "schoolId": "school-1",
    "name": "System Administrator",
    "email": "admin@eduflow.test",
    "role": "Super Admin"
  }
}
```

6. React saves token and user in localStorage.
7. User enters dashboard.

### 5.3 Authenticated API Flow

For protected API routes, frontend sends:

```text
Authorization: Bearer <token>
```

Backend middleware `requireAuth` verifies the token.

If valid, it adds the user to:

```js
req.user
```

Then routes use:

```js
req.user.schoolId
```

to load only that school's data.

### 5.4 Generic CRUD Flow

Most modules use the same generic CRUD API.

For example, for students:

```text
GET    /api/students
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
```

For teachers:

```text
GET    /api/teachers
POST   /api/teachers
PUT    /api/teachers/:id
DELETE /api/teachers/:id
```

The frontend `ModulePage` component is reusable. It receives module name like `students`, reads its fields and columns from the `modules` object, then automatically builds table and form UI.

---

## 6. API Documentation

Base URL during development:

```text
http://localhost:5000/api
```

From frontend, requests use relative path:

```text
/api
```

because Vite proxies API requests to backend.

### 6.1 Health Check

```http
GET /api/health
```

Response example:

```json
{
  "ok": true,
  "app": "EduFlow SaaS School Management",
  "storage": "json"
}
```

### 6.2 Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "admin@eduflow.test",
  "password": "password123"
}
```

Response:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "u-admin",
    "schoolId": "school-1",
    "name": "System Administrator",
    "email": "admin@eduflow.test",
    "role": "Super Admin",
    "permissions": ["all"],
    "status": "Active"
  }
}
```

### 6.3 Dashboard

```http
GET /api/dashboard
```

Requires JWT.

Returns:

- KPIs
- Class strength
- Fee status chart data
- Notices
- Admission pipeline

### 6.4 Generic List

```http
GET /api/:collection
```

Example:

```http
GET /api/students
```

Search:

```http
GET /api/students?q=Hamza
```

### 6.5 Generic Create

```http
POST /api/:collection
```

Example:

```http
POST /api/students
```

Body:

```json
{
  "admissionNo": "ADM-1005",
  "name": "New Student",
  "className": "Grade 6",
  "section": "A",
  "guardian": "Guardian Name",
  "phone": "+92 300 0000000",
  "status": "Active"
}
```

### 6.6 Generic Update

```http
PUT /api/:collection/:id
```

Example:

```http
PUT /api/students/stu-1001
```

### 6.7 Generic Delete

```http
DELETE /api/:collection/:id
```

Example:

```http
DELETE /api/students/stu-1001
```

### 6.8 Mark Attendance Workflow

```http
POST /api/workflows/mark-attendance
```

Body:

```json
{
  "date": "2026-09-04",
  "className": "Grade 6",
  "records": [
    {
      "studentName": "Hamza Ali",
      "status": "Present",
      "remarks": ""
    }
  ]
}
```

### 6.9 Generate Fees Workflow

```http
POST /api/workflows/generate-fees
```

Body:

```json
{
  "month": "September 2026",
  "dueDate": "2026-09-10"
}
```

This creates fee invoices for active students.

### 6.10 Process Payroll Workflow

```http
POST /api/workflows/process-payroll
```

Body:

```json
{
  "month": "September 2026"
}
```

This creates payroll records for teachers.

---

## 7. Database Collections

The project uses these collections:

```text
schools
users
students
teachers
classes
subjects
admissions
attendance
fees
payroll
expenses
exams
results
certificates
notices
```

### 7.1 SaaS Tenant Concept

Most records contain:

```js
schoolId: 'school-1'
```

This means data belongs to a specific school.

Later, if more schools are added, each school can have its own records.

### 7.2 Example Student Object

```json
{
  "id": "stu-1001",
  "schoolId": "school-1",
  "admissionNo": "ADM-1001",
  "name": "Hamza Ali",
  "gender": "Male",
  "dob": "2012-03-11",
  "className": "Grade 6",
  "section": "A",
  "rollNo": "06-A-01",
  "guardian": "Ali Raza",
  "phone": "+92 311 1234567",
  "address": "Rawalpindi",
  "admissionStatus": "Admitted",
  "status": "Active"
}
```

### 7.3 Example Fee Object

```json
{
  "id": "fee-01",
  "schoolId": "school-1",
  "invoiceNo": "INV-1001",
  "studentName": "Hamza Ali",
  "month": "September 2026",
  "amount": 4500,
  "discount": 0,
  "paid": 4500,
  "status": "Paid",
  "dueDate": "2026-09-10"
}
```

### 7.4 Example User Object

```json
{
  "id": "u-admin",
  "schoolId": "school-1",
  "name": "System Administrator",
  "email": "admin@eduflow.test",
  "password": "hashed-password",
  "role": "Super Admin",
  "permissions": ["all"],
  "status": "Active"
}
```

---

## 8. Frontend Page Explanation

### 8.1 Login Page

The login page is displayed if no user exists in localStorage.

It shows:

- Project branding
- Feature highlights
- Email field
- Password field
- Sign in button

### 8.2 Main Layout / Shell

After login, the app shows a sidebar and top header.

Sidebar links:

- Dashboard
- Students
- Admissions CRM
- Teachers & HR
- Classes
- Subjects
- Attendance
- Fees & Finance
- HR Payroll
- Expenses
- Exams
- Results
- Certificates
- Notices
- Users & Roles

### 8.3 Generic Module Pages

Most pages use one generic component called `ModulePage`.

It automatically creates:

- Search box
- Add button
- Data table
- Edit button
- Delete button
- Modal form

It knows what fields to show because of the `modules` object in `src/App.jsx`.

### 8.4 Dashboard Charts

The dashboard uses Recharts:

- `AreaChart` for finance trend
- `PieChart` for fee status
- `BarChart` for class strength

### 8.5 Certificate Print Preview

The Certificates page has a preview section. It loads a certificate and displays it in a printable format. Clicking Print uses:

```js
print()
```

which opens the browser print dialog.

---

## 9. How to Run on Windows

### 9.1 Requirements

You already installed:

- Node.js
- npm
- Git

If PowerShell blocks npm, use either Command Prompt or run npm as `npm.cmd`.

### 9.2 Clone Project

Open Command Prompt or PowerShell and run:

```bash
cd Desktop
git clone https://github.com/MuhammadQamar99/Complete-ERP-project.git
cd Complete-ERP-project
```

### 9.3 Install Dependencies

```bash
npm install
```

If PowerShell gives execution policy error, use:

```powershell
npm.cmd install
```

### 9.4 Start Project

```bash
npm run dev
```

or in PowerShell:

```powershell
npm.cmd run dev
```

Open:

```text
http://localhost:5173
```

Login:

```text
admin@eduflow.test
password123
```

---

## 10. Running With MongoDB

By default, the project works without MongoDB by using JSON storage.

To use MongoDB:

1. Install MongoDB locally or use MongoDB Atlas.
2. Create `.env` file in project root.
3. Add:

```env
PORT=5000
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://127.0.0.1:27017/eduflow_saas
MONGODB_DB=eduflow_saas
```

4. Run:

```bash
npm run dev
```

The backend will connect to MongoDB and seed demo data if the database is empty.

---

## 11. Production Build

To make a production frontend build:

```bash
npm run build
```

To run production server:

```bash
npm start
```

In production mode, Express serves the React files from:

```text
dist/
```

---

## 12. Important Workflows Explained

### 12.1 Monthly Fee Generation

Path in frontend:

```text
Fees & Finance page
```

Process:

1. Admin enters month and due date.
2. Frontend calls `/api/workflows/generate-fees`.
3. Backend loads active students.
4. Backend finds each student's class.
5. Backend reads monthly fee from class.
6. Backend creates invoice records.

### 12.2 Payroll Processing

Path in frontend:

```text
HR Payroll page
```

Process:

1. Admin enters payroll month.
2. Frontend calls `/api/workflows/process-payroll`.
3. Backend loads teachers.
4. Backend creates payroll records using teacher salary.
5. Initial payroll status is `Pending`.

### 12.3 Attendance Marking

Path in frontend:

```text
Attendance page
```

Process:

1. Admin selects date and class.
2. Frontend filters students for that class.
3. Admin marks Present, Absent, Late or Leave.
4. Frontend sends all records to backend.
5. Backend saves attendance rows.

### 12.4 Result Grade Calculation

When a result is created or updated:

1. Backend receives marks and max marks.
2. Backend calculates percentage.
3. Backend assigns grade.
4. Result is saved with grade.

---

## 13. Security Notes

Current security features:

- JWT protected backend routes
- Password hashing with bcryptjs
- No plain password returned from API
- Token automatically sent from frontend
- Data scoped using `schoolId`

Recommended future improvements:

- Add strict permission checks per role
- Add refresh tokens
- Add password reset
- Add account lock after failed attempts
- Add input validation with a library like Zod or Joi
- Add HTTPS in deployment
- Store JWT secret securely in hosting environment

---

## 14. Limitations of Current Version

This is a complete working base, but some advanced production features can still be added:

- Separate student, parent and teacher portals
- File uploads for student photos/documents
- PDF certificate generation
- SMS/email notifications
- Online payment gateway
- Timetable conflict detection
- Advanced reports export to Excel/PDF
- Full role permission enforcement
- Audit logs
- Backup/restore module

---

## 15. How to Explain This Project to Someone

You can explain it like this:

> This is a full-stack School Management System SaaS built with React, Tailwind CSS, Node.js, Express and MongoDB. It allows a school admin to manage admissions, students, teachers, classes, subjects, attendance, fees, payroll, expenses, exams, results, certificates, notices and users. The backend uses JWT authentication and bcrypt password hashing. The system supports MongoDB, but it also has a local JSON fallback so it can run immediately without database setup. The frontend uses React Router for pages, Tailwind for styling, Axios for API calls and Recharts for dashboard graphs.

Short version:

> It is an ERP for schools. It handles academic, finance, HR and admin work in one web dashboard.

Technical version:

> The app follows a MERN-style architecture. React/Vite runs the frontend, Express provides REST APIs, Mongoose supports MongoDB persistence, JWT secures protected routes, and a reusable CRUD system powers most modules.

---

## 16. Common Commands

Install packages:

```bash
npm install
```

Run development app:

```bash
npm run dev
```

Run backend only:

```bash
npm run server
```

Run frontend only:

```bash
npm run client
```

Build frontend:

```bash
npm run build
```

Run production:

```bash
npm start
```

Validate project:

```bash
npm run lint
```

---

## 17. GitHub Information

Repository:

```text
https://github.com/MuhammadQamar99/Complete-ERP-project
```

The project was merged into the `main` branch.

To download it:

```bash
git clone https://github.com/MuhammadQamar99/Complete-ERP-project.git
```

To update it later:

```bash
git pull origin main
```

---

## 18. Final Summary

This project is a complete school ERP/SaaS foundation. It includes frontend, backend, authentication, database support, demo data and many real school modules. A school can use it to manage administration, academics, finance and HR workflows. Developers can extend it further by adding portals, stricter permissions, file uploads, payments, notifications and deployment configuration.