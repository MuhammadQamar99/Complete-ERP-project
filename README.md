# EduFlow SaaS - Complete School Management System

This repository has been rebuilt as a complete School Management System SaaS inspired by the requested tutorial: **React + Tailwind CSS + Node.js + Express + MongoDB**.

The application is production-style and includes SaaS tenant support, authentication, admin dashboard, student management, admissions CRM, teachers/HR, payroll, finance, exams, results and printable certificates.

## Modules

- Authentication with JWT and hashed passwords
- Role-based users and permissions
- SaaS school tenant data model
- Admin dashboard with charts and KPIs
- Student management
- Admission pipeline / CRM
- Teacher and HR management
- Class and section setup
- Subject management
- Attendance workflow and records
- Fee invoice management
- Monthly fee generator
- Expenses
- HR payroll processor
- Exam schedule
- Results with automatic grade calculation
- Certificate issue and print preview
- Notices and announcements

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Recharts, Lucide Icons, Axios
- Backend: Node.js, Express.js, JWT, bcryptjs
- Database: MongoDB with Mongoose when `MONGODB_URI` is configured
- Local development fallback: JSON storage at `server/storage/eduflow-db.json`

## Demo Login

```text
Email: admin@eduflow.test
Password: password123
```

Other seeded users:

```text
principal@eduflow.test / password123
finance@eduflow.test / password123
```

## Run Locally

```bash
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend health check:

```text
http://localhost:5000/api/health
```

## Use MongoDB

Create a `.env` file:

```env
PORT=5000
JWT_SECRET=change-this-secret
MONGODB_URI=mongodb://127.0.0.1:27017/eduflow_saas
MONGODB_DB=eduflow_saas
```

Then run:

```bash
npm run dev
```

If `MONGODB_URI` is not set, the app runs with local JSON storage so it works immediately in development.

## Production Build

```bash
npm run build
npm start
```

In production mode, Express serves the compiled React app from `dist/`.

## Project Structure

```text
.
├── server/
│   ├── dataStore.js   # MongoDB/JSON data provider
│   ├── seed.js        # SaaS demo school seed data
│   └── server.js      # Express API and workflows
├── src/
│   ├── App.jsx        # React SaaS dashboard and modules
│   ├── api.js         # Axios API client and auth session
│   ├── main.jsx       # React entry point
│   └── style.css      # Tailwind layers/components
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## Notes

- The local JSON database is ignored by Git.
- Set `MONGODB_URI` for a real MongoDB backend.
- This is a complete working base that can be extended with file uploads, email/SMS notifications, online payments, and separate dashboards for parents, students and teachers.
