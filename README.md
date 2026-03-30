# Running Start Digital Support Portal

## Overview

This project was developed as part of a capstone collaboration with the Running Start Department at Green River College.

The **Running Start Digital Support Portal** is a full-stack web application designed to help **current and prospective Running Start students at Green River College** quickly find answers to frequently asked questions.

The goal of this project is to:

* Reduce repetitive support requests to staff
* Provide a **clear, searchable, and mobile-friendly FAQ experience**
* Allow administrators to easily manage content through a dashboard

---

# Prerequisites

Make sure you have:

- Node.js (v18+)
- npm
- MySQL (local or cloud)
- Git

---

# Team Information

## Team Name

**Why Are You Running?**

## Team Members

* Alston Dsouza
* Diana Khachaturova
* Laura Villaraza
* Daniel McCarragher

## Client

Running Start Department
Green River College

## Project Duration

Winter 2026 – Spring 2026

---

# Features

## Student Features

Students can:

* Browse FAQs for **Current Students**
* Browse FAQs for **Future / Prospective Students**
* View FAQs organized by category
* Scan answers in **bullet-point format**
* Access helpful resource links
* Use the app on **mobile, tablet, and desktop**

---

## Admin Features

Admins can securely manage FAQ content:

* JWT-based login authentication
* Add new FAQ entries
* Edit existing FAQ entries
* Delete FAQ entries
* Reorder FAQs (drag-and-drop)
* Assign FAQs to categories
* Manage both **Current** and **Future** student content

---

# Tech Stack

## Frontend

* React (Vite)
* Material UI
* React Router
* DnD Kit (drag-and-drop)

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs (password hashing)
* mysql2
* dotenv

## Database

* MySQL (Aiven Cloud or Local)

---

# System Architecture

```
Frontend (React + Vite)
        │
        ▼
Backend API (Node.js + Express)
        │
        ▼
MySQL Database
```

---

# Project Structure

```
Running-start-digital-support
│
├── backend
│   ├── controllers
│   ├── db
│   ├── middleware
│   ├── router
│   ├── scripts
│   ├── sql
│   ├── app.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── utils
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

# Database Structure

## Table: `faq`

| Column     | Type      | Description       |
| ---------- | --------- | ----------------- |
| id         | INT       | Primary key       |
| audience   | VARCHAR   | current or future |
| type       | VARCHAR   | category          |
| question   | TEXT      | FAQ question      |
| answer     | JSON      | answer content    |
| sort_order | INT       | display order     |
| created_at | TIMESTAMP | creation date     |

---

# API Routes

## Public Routes

```
GET /api/getFAQS?audience=current
GET /api/getFAQS?audience=future
```

---

## Admin Routes (Protected)

```
POST   /api/addFAQ
PUT    /api/faq/:id
DELETE /api/faq/:id
PUT    /api/faq/order
```

---

## Authentication

```
POST /api/auth/login
```

Returns a JWT token for admin access.

---

# Environment Setup
Use the provided `.env.example` files as a reference. Do not commit real `.env` files to version control.

## Backend `.env`

Create a `.env` file based on `.env.example`:

```
PORT=5001

ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_bcrypt_hash
JWT_SECRET=replace_with_strong_secret

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=runningstart
```

---

## Frontend `.env`

```
VITE_API_BASE=http://localhost:5001/api
```

---

# Running the Project Locally

## 1. Clone the Repository

```
git clone https://github.com/alstondsouza1/Running-start-digital-support.git
cd Running-start-digital-support
```

---

## 2. Backend Setup

```
cd backend
npm install
```

### Create `.env`

```
cp .env.example .env
```

---

## 3. Database Setup

### Create Database

```sql
CREATE DATABASE runningstart;
USE runningstart;
```

### Run Schema

```sql
SOURCE sql/faq.sql;
```

---

## 4. Seed Data

```
npm run seed:current
npm run seed:future
```

---

## 5. Generate Admin Password Hash

Run in Node:

```js
import bcrypt from "bcryptjs";
console.log(await bcrypt.hash("yourpassword", 12));
```

Paste result into `.env`.

---

## 6. Start Backend

```
npm run dev
```

Backend:

```
http://localhost:5001
```
API health check: http://localhost:5001/api/health

---

## 7. Frontend Setup

Open new terminal:

```
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend:

```
http://localhost:5173
```

---

# How to Test

1. Open homepage
2. Navigate to Current Students
3. Navigate to Future Students
4. Search FAQs
5. Login at `/admin`
6. Add / Edit / Delete FAQs
7. Reorder FAQs

---

# Known Limitations

* Requires JavaScript (no SSR fallback)
* JWT stored in localStorage (not production-safe)
* No login rate limiting
* No automated testing yet
* Accessibility improvements still in progress

---

# Security Notes

* Do NOT commit `.env` files
* Rotate secrets if exposed
* Use strong JWT secrets
* Consider:

  * Rate limiting
  * Helmet middleware
  * Input validation improvements

---

# Accessibility Goals

* Improve keyboard navigation
* Add better ARIA labeling
* Improve contrast and readability
* Enhance screen reader compatibility

---

# Future Improvements

* Full-text search
* Multilingual support
* Admin analytics dashboard
* Role-based access control
* Automated testing (Jest)
* Improved admin UX

---

# Deployment

## Frontend

* Vercel
* Netlify

## Backend

* Render
* Railway
* DigitalOcean

## Database

* Aiven MySQL

---

# Client Impact

This portal helps the Running Start office by:

* Reducing repetitive student questions
* Providing consistent information
* Improving accessibility to resources
* Supporting both new and current students

---

# Notes for Reviewers

- Use `.env.example` to configure environment variables
- Use local MySQL for easiest setup
- Run seed scripts before testing
- Admin password must be generated using bcrypt (see instructions above)
- If backend fails, check database connection settings

This project is part of a handoff/review assignment, so feedback on setup, usability, and code structure is encouraged.

---

# Acknowledgements

Running Start Department
Green River College

---

# License

This project was created for the
**Green River College BAS Software Development Capstone.**

For educational use only.
