# Complete School ERP Project

A complete school management system built as a full-stack React + Express project. It includes student admissions, teachers, classes, subjects, attendance, fees, exams, results, timetable, notices, reports, authentication, and seeded demo data.

## Features

- Secure login with JWT authentication
- Dashboard with student, teacher, class, revenue, due, expense, and attendance summaries
- Student admission and profile management
- Teacher/staff management
- Class, section, room, capacity, and monthly fee setup
- Subject assignment to class and teacher
- Daily attendance with class-wise bulk marking
- Fee invoices, paid/partial/unpaid tracking, and monthly invoice generation
- Expense management
- Exam scheduling and result entry with automatic grade calculation
- Timetable management
- Notice board for students, parents, and teachers
- Student printable report with fees, attendance, and exam results
- User management for school staff roles
- JSON-file persistence for easy local development

## Demo Login

```text
Email: admin@school.test
Password: password123
```

A second account is also seeded:

```text
Email: accounts@school.test
Password: password123
```

## Tech Stack

- Frontend: React, Vite, plain CSS
- Backend: Node.js, Express
- Auth: bcryptjs + JSON Web Tokens
- Database: JSON file at `server/data/db.json` seeded automatically on first run

## Run Locally

```bash
npm install
npm run dev
```

The React app runs on Vite and proxies API calls to the Express API.

- Frontend: <http://localhost:5173>
- API: <http://localhost:5000/api/health>

## Production Build

```bash
npm install
npm run build
npm start
```

The Express server serves the built frontend from `dist/` in production mode.

## Project Structure

```text
.
├── server/
│   ├── index.js      # Express API, auth, CRUD, reports
│   └── seed.js       # Initial demo data
├── src/
│   ├── App.jsx       # React ERP UI and modules
│   ├── api.js        # API client and session helpers
│   ├── main.jsx      # React entry point
│   └── styles.css    # Responsive dashboard styling
├── index.html
├── package.json
└── vite.config.js
```

## Notes

- The first server run creates `server/data/db.json`. Delete that file to reset demo data.
- Use the Users module to add staff accounts.
- This project is designed as a complete working base that can be extended with a relational database, permissions, SMS/email notifications, and online payment integrations.
