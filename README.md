# Running Start Digital Support Portal

## Overview

The **Running Start Digital Support Portal** is a full-stack web application designed to help **current and prospective Running Start students at Green River College** quickly find answers to frequently asked questions.

The goal of this project is to **reduce repetitive support requests to staff** while providing students with a **clear, searchable, and mobile-friendly FAQ experience**.

The system allows administrators to **add, edit, delete, and reorder FAQ items** through a secure admin dashboard while students can easily browse information categorized by topic.

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

# Features

## Student Features

Students can:

- Browse FAQs for **Current Students**
- Browse FAQs for **Future / Prospective Students**
- View FAQs organized by category
- Quickly scan **bullet-point answers**
- Access helpful links provided in answers
- Use the portal on **mobile, tablet, and desktop**

---

## Admin Features

Admins can securely manage FAQ content.

Admin capabilities include:

- Secure **JWT login authentication**
- Add new FAQ entries
- Edit existing FAQ entries
- Delete FAQ entries
- Reorder FAQ items within categories
- Assign FAQ items to categories
- Manage both **Current Student** and **Future Student** FAQs

---

# Tech Stack

## Frontend
- React
- Vite
- Material UI
- React Router
- DnD Kit (drag-and-drop reordering)

## Backend
- Node.js
- Express
- JWT authentication
- bcryptjs for password hashing
- mysql2 database driver
- dotenv environment configuration

## Database
MySQL (Aiven Cloud Database)

---

# System Architecture

```
Frontend (React + Vite)
        │
        ▼
Backend API (Node.js + Express)
        │
        ▼
MySQL Database (Aiven Cloud)
```

The frontend communicates with the backend API, which performs authentication and database operations.

---

# Project Structure

```
Running-start-digital-support
│
├── backend
│   ├── controllers
│   │   ├── adminController.js
│   │   └── faqController.js
│   │
│   ├── db
│   │   └── db.js
│   │
│   ├── middleware
│   │   └── authMiddleware.js
│   │
│   ├── router
│   │   ├── adminRoutes.js
│   │   └── faqRoutes.js
│   │
│   ├── scripts
│   │   ├── seedCurrent.js
│   │   └── seedFuture.js
│   │
│   ├── sql
│   │   └── schema.sql
│   │
│   ├── app.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── data
│   │   ├── pages
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# Database Structure

The project uses a single **FAQ table**.

## Table: `faq`

| Column | Type | Description |
|------|------|-------------|
| id | INT | Primary key |
| audience | VARCHAR | current or future |
| type | VARCHAR | FAQ category |
| question | TEXT | FAQ question |
| answer | JSON | Answer content including intro and bullet points |
| sort_order | INT | Order within category |
| created_at | TIMESTAMP | Creation date |

---

# API Routes

## Public Routes

Get FAQs by audience.

```
GET /api/getFAQS?audience=current
GET /api/getFAQS?audience=future
```

---

## Admin Routes (Protected)

### Add FAQ
```
POST /api/addFAQ
```

### Update FAQ
```
PUT /api/faq/:id
```

### Delete FAQ
```
DELETE /api/faq/:id
```

### Update FAQ order
```
PUT /api/faq/order
```

---

# Authentication

Admin login:

```
POST /api/auth/login
```

Returns a **JWT token** used for protected routes.

---

# Environment Variables

## Backend `.env`

Example configuration:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_bcrypt_hash

JWT_SECRET=your_jwt_secret

PORT=5001

DB_HOST=your_aiven_host
DB_PORT=your_aiven_port
DB_USER=your_aiven_user
DB_PASSWORD=your_aiven_password
DB_NAME=defaultdb
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

## 2. Install Backend Dependencies

```
cd backend
npm install
```

Start backend server:

```
npm run dev
```

Backend runs on:

```
http://localhost:5001
```

---

## 3. Install Frontend Dependencies

Open a new terminal.

```
cd frontend
npm install
```

Start frontend:

```
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Database Setup

The project uses **MySQL hosted on Aiven Cloud**.

You can connect using:

- MySQL Workbench
- DBeaver
- TablePlus
- MySQL CLI

Connection settings include:

- Host
- Port
- Username
- Password
- SSL certificate

---

# Seeding FAQ Data

The project includes scripts to populate the database.

### Seed Current Student FAQs

```
npm run seed:current
```

### Seed Future Student FAQs

```
npm run seed:future
```

### Seed all FAQs

```
npm run seed:all
```

---

# Accessibility Goals

Future improvements include:

- ARIA accessibility labels
- Improved keyboard navigation
- Better screen reader compatibility
- Enhanced contrast and readability
- Improved mobile accessibility

---

# Future Improvements

Potential enhancements for the portal:

- Full text search functionality
- Multilingual support
- Analytics for frequently viewed FAQs
- Admin activity logs
- Content approval workflow
- Deployment to cloud hosting

---

# Deployment

The project can be deployed using:

## Frontend
- Vercel
- Netlify

## Backend
- Render
- Railway
- DigitalOcean

## Database
- Aiven MySQL

---

# Client Impact

This portal helps the Running Start office by:

- Reducing repetitive student questions
- Providing consistent information
- Improving student access to resources
- Supporting both new and current students

---

# Acknowledgements

Special thanks to:

Running Start Department  
Green River College  

For providing guidance and requirements for the project.

---

# License

This project was created as part of the  
**Green River College BAS Software Development Capstone Project.**

Educational use only.