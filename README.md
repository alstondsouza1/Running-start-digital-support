# Running Start Digital Support Portal

## Overview

The Running Start Digital Support Portal is a full-stack web application developed in collaboration with the Running Start Department at Green River College as part of the BAS Software Development Capstone program.

The portal helps current and prospective Running Start students quickly find answers to frequently asked questions through a searchable, categorized, and mobile-friendly interface.

The system also includes an administrative dashboard that allows staff or student administrators to manage FAQ content without editing code.

---

# Live Demo

Frontend (Vercel):  
https://running-start-portal.vercel.app/

> Note:
> The backend is hosted separately on Render.
> Admin functionality requires a configured admin account and credentials.

---

# Team Information

## Team Name

**Why Are You Running?**

## Team Members

- Alston Dsouza
- Diana Khachaturova
- Laura Villaraza
- Daniel McCarragher

## Client

Running Start Department  
Green River College

## Project Duration

Winter 2026 – Spring 2026

---

# Project Goals

This project was designed to:

- Reduce repetitive support requests to Running Start staff
- Improve accessibility of student information
- Provide a searchable FAQ experience
- Support both current and future students
- Allow non-technical admins to manage content easily

---

# Features

## Student Features

Students can:

- Browse FAQs for Current Students
- Browse FAQs for Future / Prospective Students
- Search FAQs by keyword
- Browse FAQs by category
- Read answers in bullet-point format
- Open helpful external resource links
- Use the portal on mobile, tablet, and desktop devices
- Navigate using keyboard accessibility support
- Use accessibility tools:
  - Read aloud
  - High contrast mode
  - Readable fonts
  - Translation support

---

## Admin Features

Admins can:

- Login securely using JWT authentication
- Add FAQs
- Edit FAQs
- Delete FAQs
- Reorder FAQs using drag-and-drop
- Create custom categories
- Edit categories
- Delete categories
- Reorder categories using drag-and-drop
- Manage Current and Future student content separately

---

# Tech Stack

## Frontend

- React (Vite)
- Material UI (MUI)
- React Router
- DnD Kit
- Context API

## Analytics

- Google Analytics 4
- Vercel Analytics

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- mysql2
- dotenv

## Database

- MySQL (Aiven Cloud or Local)

---

# System Architecture

```text
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

```text
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

| Column | Type | Description |
|---|---|---|
| id | INT | Primary key |
| audience | VARCHAR | current or future |
| type | VARCHAR | category id |
| question | TEXT | FAQ question |
| answer | JSON | FAQ answer |
| sort_order | INT | display order |
| created_at | TIMESTAMP | creation date |

---

## Table: `categories`

| Column | Type | Description |
|---|---|---|
| id | VARCHAR | category id |
| audience | VARCHAR | current or future |
| name | VARCHAR | category name |
| description | TEXT | category description |
| sort_order | INT | display order |

---

# API Routes

> Note:  
> Some routes may be refactored into a more RESTful structure in future iterations.

---

## Public Routes

```http
GET /api/getFAQS?audience=current
GET /api/getFAQS?audience=future
GET /api/categories
```

---

## Admin FAQ Routes (Protected)

```http
POST   /api/addFAQ
PUT    /api/faq/:id
DELETE /api/faq/:id
PUT    /api/faq/order
```

---

## Admin Category Routes (Protected)

```http
POST   /api/categories
PUT    /api/categories/order
PUT    /api/categories/:audience/:id
DELETE /api/categories/:audience/:id
```

---

# Authentication

```http
POST /api/auth/login
```

Returns a JWT token for admin access.

---

# Environment Setup

## Backend `.env`

```env
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

```env
VITE_API_BASE=http://localhost:5001/api
VITE_GOOGLE_ID=G-XXXXXXXXXX
```

---

# Running the Project Locally

## 1. Clone Repository

```bash
git clone https://github.com/alstondsouza1/Running-start-digital-support.git

cd Running-start-digital-support
```

---

## 2. Backend Setup

```bash
cd backend

npm install

cp .env.example .env
```

---

## 3. Setup Database

### Option 1 — MySQL Workbench

```sql
CREATE DATABASE runningstart;
```

Then configure `backend/.env` and run the migrations from the `backend`
directory:

```bash
npm run migrate
```

---

### Option 2 — Terminal

```bash
mysql -u root -p
```

```sql
CREATE DATABASE runningstart;
```

Exit MySQL, configure `backend/.env`, and run:

```bash
npm run migrate
```

---

## 4. Seed Default FAQ Data

```bash
npm run seed:current

npm run seed:future
```

---

## 5. Generate Admin Password Hash

```js
import bcrypt from "bcryptjs";

console.log(await bcrypt.hash("yourpassword", 12));
```

Copy the generated hash into:

```env
ADMIN_PASSWORD_HASH=
```

---

## 6. Start Backend

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5001
```

---

## 7. Start Frontend

```bash
cd frontend

npm install

cp .env.example .env

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# How to Test

1. Open homepage
2. Browse Current and Future student sections
3. Search FAQs
4. Open categories
5. Test accessibility tools
6. Login at `/admin-login`
7. Add FAQs
8. Edit FAQs
9. Delete FAQs
10. Reorder FAQs
11. Create categories
12. Reorder categories

---

# Accessibility Features

The project includes accessibility-focused functionality such as:

- Keyboard navigation support
- ARIA labels
- Readable font mode
- High contrast mode
- Read aloud support
- Google Translate integration
- Responsive design
- Screen reader improvements
- Text size controls
- Reduced motion mode
- Draggable accessibility toolbar
- Mobile accessibility support

Goal target:

- WCAG 2.1 AA compliance

Survey-requested FAQ topics that still need staff verification are tracked in
`FUTURE_FAQ_CONTENT_NOTES.md`.

Operational guides:

- `DOCUMENTATION_INDEX.md`
- `DATABASE_BACKUP_AND_RESTORE.md`
- `SECURE_AUTH_MIGRATION_PLAN.md`

---

# Deployment Overview

The application is separated into three services:

- Frontend
- Backend API
- Database

This architecture allows each service to scale independently.

---

# Hosting Summary

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Aiven MySQL |
| Analytics | Google Analytics 4 |
| Usage Analytics | Vercel Analytics |

---

# Production Environment Variables

## Frontend (Vercel)

```env
VITE_API_BASE=https://your-backend-url/api
VITE_GOOGLE_ID=G-XXXXXXXXXX
```

---

## Backend (Render)

```env
DB_HOST=your-aiven-host
DB_PORT=your-port
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=your-db
JWT_SECRET=your-secret
```

---

# System Flow

1. Frontend sends API requests
2. Backend processes requests
3. Backend connects to MySQL database
4. Database stores FAQs and categories
5. Admin dashboard updates content dynamically

---

# Monthly Cost Estimate

| Service | Estimated Cost |
|---|---|
| Aiven MySQL | ~$5/month |
| Render Backend | ~$7/month |
| Vercel Frontend | ~$20/month |

Estimated Total:

**~$32/month**

Projected production range:

**~$40–$50/month**

depending on traffic and future scaling.

---

# Security Notes

Current protections include:

- JWT authentication
- Password hashing with bcrypt
- Protected admin routes
- Environment variable configuration
- Helmet security headers
- Login rate limiting

Future security improvements:

- Broader API rate limiting
- Better input validation
- Refresh tokens
- Secure cookie auth
- CSRF protection

---

# Known Limitations

- Requires JavaScript enabled
- JWT stored in localStorage
- Automated coverage is focused on key unit, backend, and browser workflows
- Analytics currently limited to FAQ interactions, searches, and category usage
- Accessibility improvements still ongoing
- Rate limiting currently focuses on admin login attempts
- Admin ordering includes keyboard-accessible Move up and Move down controls

---

# Data Collection & Privacy

- No student login required
- No personal student data stored
- FAQ browsing is anonymous

Future analytics (if added):

- Will avoid personal data collection
- Will focus only on general usage metrics

---

# Maintenance & Ownership

## Ownership

- Student Team (until June 2026)
- Running Start Department (content ownership)
- Future student developers or interns

---

# Maintenance Tasks

- Update FAQ content
- Monitor backend uptime
- Backup database
- Update dependencies
- Rotate secrets
- Review accessibility

---

# Future Improvements

Potential future enhancements include:

- Improved search relevance and ranking
- AI-powered FAQ suggestions
- Admin analytics dashboard
- Role-based access control
- Expanded automated and accessibility test coverage
- Better admin UI
- Expanded accessibility support
- Live support/contact integration
- More multilingual support

---

# Client Impact

This project helps the Running Start office by:

- Reducing repetitive support requests
- Providing more consistent information
- Improving accessibility
- Supporting students outside office hours
- Improving navigation of support resources

---

# Disclaimer

This project was created by students as part of the Green River College BAS Software Development Capstone.

The content provided does not represent official Green River College policy. Students should verify information through official Green River College resources and the Running Start office.

---

# Notes for Reviewers

- Use `.env.example`
- Run seed scripts before testing
- Generate bcrypt password hash before login
- Verify database connection if backend fails
- Admin routes require valid JWT authentication

---

# Acknowledgements

Running Start Department  
Green River College

Special thanks to:

- Lindsey Morris and Kyle Stevenson
- Green River College BAS Faculty
- Capstone instructors and reviewers

---

# License

This project was created for the:

**Green River College BAS Software Development Capstone**

For educational use only.
