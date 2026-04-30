# Running Start Digital Support Portal

## Overview

This project was developed as part of a capstone collaboration with the Running Start Department at Green River College.

The **Running Start Digital Support Portal** is a full-stack web application designed to help **current and prospective Running Start students** quickly find answers to frequently asked questions.

The goal of this project is to:

* Reduce repetitive support requests to staff
* Provide a **clear, searchable, and mobile-friendly FAQ experience**
* Allow administrators to easily manage content through a dashboard

---

# Live Demo

Frontend:
[https://running-start-portal.vercel.app/](https://running-start-portal.vercel.app/)

> Note: Backend is hosted separately. Admin features may require local setup.

---

# Prerequisites

Make sure you have:

* Node.js v18+
* npm
* MySQL (local or cloud)
* Git

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
* Read answers in **bullet-point format**
* Access helpful resource links
* Use the app on **mobile, tablet, and desktop**

---

## Admin Features

Admins can:

* Login securely using JWT authentication
* Add new FAQ entries
* Edit existing FAQs
* Delete FAQs
* Reorder FAQs (drag-and-drop)
* Assign FAQs to categories
* Manage both **Current** and **Future** content

---

# Tech Stack

## Frontend

* React (Vite)
* Material UI
* React Router
* DnD Kit

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
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
|
│── REVIEW_NOTES.md
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

Note: Some routes are not fully RESTful and may be refactored in future iterations.

## Public Routes

```
GET /api/getFAQS?audience=current
GET /api/getFAQS?audience=future
GET /api/categories
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

## Backend `.env`

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

DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=false
```

---

## Frontend `.env`

```
VITE_API_BASE=http://localhost:5001/api
```

---

# Running the Project Locally

## 1. Clone Repository

```
git clone https://github.com/alstondsouza1/Running-start-digital-support.git
cd Running-start-digital-support
```

---

## 2. Backend Setup

```
cd backend
npm install
cp .env.example .env
```

---

## 3. Setup Database

### Option 1: MySQL Workbench

```sql
CREATE DATABASE runningstart;
USE runningstart;
```

Run:

```
backend/sql/faq.sql
```

---

### Option 2: Terminal

```
mysql -u root -p
CREATE DATABASE runningstart;
USE runningstart;
SOURCE backend/sql/faq.sql;
```

---

## 4. Seed Data

```
npm run seed:current
npm run seed:future
```

---

## 5. Generate Admin Password

```js
import bcrypt from "bcryptjs";
console.log(await bcrypt.hash("yourpassword", 12));
```

---

## 6. Start Backend

```
npm run dev
```

Backend:

```
http://localhost:5001
```

---

## 7. Start Frontend

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
2. Navigate between Current and Future students
3. Search FAQs
4. Login at `/admin-login`
5. Add / Edit / Delete FAQs
6. Reorder FAQs

---

# Deployment Overview

The application consists of three main components:

* Frontend: React (Vite)
* Backend: Node.js + Express API
* Database: MySQL

This architecture allows independent scaling of the frontend, backend, and database as usage grows.

---

## Deployment Configuration

For production deployment:

Frontend (Vercel):
- VITE_API_BASE=https://your-backend-url/api

Backend (Render):
- DB_HOST=your-aiven-host
- DB_PORT=your-port
- DB_USER=your-user
- DB_PASSWORD=your-password
- DB_NAME=your-db
- JWT_SECRET=your-secret

Ensure environment variables are configured in each platform dashboard.

---

### System Flow

1. Frontend is deployed on Vercel
2. Frontend sends API requests to backend
3. Backend processes requests and connects to database
4. Database stores FAQ content and admin-managed data

---

## Hosting Summary

* Frontend → Vercel
* Backend → Render
* Database → Aiven MySQL

---

## Monthly Cost Estimate

| Service         | Estimated Cost |
| --------------- | -------------- |
| Aiven MySQL (Developer Plan)     | ~$5/month      |
| Render Backend (Starter Plan)  | ~$7/month      |
| Vercel Frontend (Pro Plan) | ~$20/month           |

Estimated Total: **~$32/month**

Projected Range: ~$40–$50/month depending on usage, traffic, and future features such as analytics.

### Notes

* Free tiers are sufficient for development and demos
* Costs may increase with traffic or scaling
* Paid plans can be used for production reliability

---

# Data Collection & Privacy

* No student login required
* No personal data stored
* FAQ browsing is anonymous

Admin access:

* JWT authentication
* Password hashing (bcrypt)

Future analytics (if added):

* Will avoid collecting personal data
* Focus on general usage only

---

# Support

If students are unable to find the information they need, they are encouraged to:

- Visit the official Green River College website  
- Contact the Running Start office directly  
- Use available student support services  

Future versions of this portal may include direct support links or live assistance options.

---

# Launch Checklist

* Frontend deployed
* Backend deployed
* Database connected
* Environment variables configured
* HTTPS enabled
* CORS configured
* Admin credentials secured
* FAQ content reviewed
* Accessibility checked (WCAG 2.1 AA)
* Support/Help links added
* Disclaimer added

---

# Maintenance & Ownership

## Ownership

* Student Team (until June 2026): development + fixes
* Running Start Department: content updates
* Future support: potential student interns or college team

---

## Maintenance Tasks

* Update FAQ content
* Monitor backend uptime
* Maintain database backups
* Update dependencies
* Rotate secrets

---

## Change Management

* Maintain documentation
* Define ownership roles
* Provide onboarding for future teams

---

# Known Limitations

* Requires JavaScript
* JWT stored in localStorage
* No rate limiting
* No automated testing yet
* Accessibility improvements ongoing

---

# Security Notes

* Do NOT commit `.env` files
* Use strong JWT secrets
* Consider adding:

  * Rate limiting
  * Helmet middleware
  * Input validation

# Additional Considerations

- JWT is currently stored in localStorage (not recommended for production)
- HTTPS should be enforced in production deployments
- Input validation should be expanded on all endpoints

# Additional Considerations

- JWT is currently stored in localStorage (not recommended for production)
- HTTPS should be enforced in production deployments
- Input validation should be expanded on all endpoints

---

# Accessibility Goals

* Improve keyboard navigation
* Add ARIA labels
* Improve contrast
* Enhance screen reader support

---

# Future Improvements

* Full-text search
* Multilingual support
* Admin analytics dashboard
* Role-based access control
* Automated testing
* Improved admin UI

---

# Client Impact

This portal helps the Running Start office by:

* Reducing repetitive questions
* Providing consistent information
* Improving accessibility
* Supporting current and future students

---

# Disclaimer

This website was created by students as part of a Green River College capstone project.

The content provided does not represent official Green River College policies. Students should refer to the official Green River College website or contact the Running Start office for verified information.

---

# Notes for Reviewers

* Use `.env.example`
* Run seed scripts before testing
* Generate admin password using bcrypt
* Check DB connection if backend fails

---

# Acknowledgements

Running Start Department
Green River College

---

# License

This project was created for the
**Green River College BAS Software Development Capstone**

For educational use only.