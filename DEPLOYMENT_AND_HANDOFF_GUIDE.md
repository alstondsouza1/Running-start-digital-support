# Deployment & Handoff Guide
Running Start Digital Support Portal

---

# Overview

This document provides deployment information, client handoff instructions, embedding guidance, and maintenance recommendations for the Running Start Digital Support Portal.

The goal is to ensure the Running Start Department can continue using the portal with minimal technical support after the capstone project concludes.

---

# Project Status

Current Status:

Frontend Complete

Backend Complete

Database Connected

FAQ Management Functional

Search Functionality Functional

Mobile Responsive

Accessibility Improvements Implemented

Deployment Ready

---

# Production Links

## Frontend

Running Start Portal:

https://running-start-portal.vercel.app/

---

## Backend

Backend API:

Configured through Render deployment environment.

Example:

```txt
https://your-render-backend.onrender.com/api
```

---

# Deployment Architecture

```txt
Student Browser
      │
      ▼
Frontend (Vercel)
      │
      ▼
Backend API (Render)
      │
      ▼
MySQL Database (Aiven)
```

---

# Deployment Components

## Frontend

Technology:

- React
- Vite
- Material UI

Hosting:

- Vercel

Responsibilities:

- Display FAQs
- Search functionality
- Student interface
- Admin interface

---

## Backend

Technology:

- Node.js
- Express

Hosting:

- Render

Responsibilities:

- FAQ management
- Authentication
- Database communication
- Analytics events

---

## Database

Technology:

- MySQL

Hosting:

- Aiven

Responsibilities:

- Store FAQs
- Store category data
- Store ordering information

---

# Frontend Deployment Steps

## Deploy to Vercel

1. Connect GitHub repository
2. Select frontend project
3. Configure environment variables
4. Deploy

Required environment variable:

```env
VITE_API_BASE=https://your-backend-url/api
```

---

## Verify Frontend Deployment

Check:

- Homepage loads
- Current Student page loads
- Future Student page loads
- Search works
- FAQ links open correctly
- Mobile layout works

---

# Backend Deployment Steps

## Deploy to Render

1. Connect backend repository
2. Configure environment variables
3. Deploy service

Required environment variables:

```env
PORT=5001

JWT_SECRET=your-secret

DB_HOST=your-host
DB_PORT=3306
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=your-db
```

---

## Verify Backend Deployment

Test:

```txt
GET /api/health
GET /api/getFAQS?audience=current
GET /api/getFAQS?audience=future
GET /api/categories
```

Expected:

```json
{
  "ok": true
}
```

for health route.

---

# Database Setup

## Initial Setup

Create database:

```sql
CREATE DATABASE runningstart;
```

Import schema:

```sql
SOURCE faq.sql;
```

Run seed scripts:

```bash
npm run seed:current
npm run seed:future
```

---

# Client Embedding Guidance

The portal can be embedded into the Green River College website using an iframe.

Example:

```html
<iframe
  src="https://running-start-portal.vercel.app/"
  width="100%"
  height="900"
  title="Running Start Digital Support Portal"
  style="border:none;"
></iframe>
```

---

# Recommended Embedding Page

Suggested placement:

```txt
Running Start Website
   ↓
Frequently Asked Questions
   ↓
Embedded Portal
```

Benefits:

- Students remain on the college website
- FAQ content remains centralized
- Updates appear automatically

---

# Content Update Process

## Staff Updates

For normal FAQ updates:

1. Login to admin dashboard
2. Edit FAQ
3. Save changes
4. Verify frontend display

No deployment required.

---

# Admin Access

Admin Login:

```txt
/admin-login
```

Admin Functions:

- Add FAQ
- Edit FAQ
- Delete FAQ
- Reorder FAQs
- Manage categories

---

# Client Handoff Checklist

## Documentation

- README.md
- REVIEW_NOTES.md
- ACCESSIBILITY_NOTES.md
- ANALYTICS_DOCUMENTATION.md
- CHANGE_MANAGEMENT_PLAN.md
- DEPLOYMENT_AND_HANDOFF_GUIDE.md

Completed:

Yes

---

## Deployment

Frontend:

Deployed

Backend:

Deployed

Database:

Connected

---

## Functionality

FAQ Search:

Working

Admin Dashboard:

Working

Category Management:

Working

Responsive Layout:

Working

Accessibility Features:

Working

---

# Minimal Maintenance Requirements

The system was intentionally designed to require minimal maintenance.

Typical maintenance includes:

- Updating FAQ content
- Checking broken links
- Monitoring hosting services
- Updating dependencies periodically

Most content changes can be completed without modifying code.

---

# Troubleshooting

## FAQs Not Loading

Check:

- Backend running
- Database connection
- API URL configuration

---

## Login Not Working

Check:

- JWT secret configured
- Admin credentials configured
- Token expiration

---

## Categories Missing

Check:

```txt
GET /api/categories
```

Verify category table contains records.

---

## Deployment Errors

Check:

- Environment variables
- Database credentials
- Build logs

---

# Recommended Future Improvements

Future enhancements may include:

- Advanced analytics dashboard
- Multilingual support
- Automated testing
- Enhanced accessibility tools
- Role-based permissions
- Automated backups

---

# Support Contacts

Current Capstone Team:

- Alston Dsouza
- Diana Khachaturova
- Laura Villaraza
- Daniel McCarragher

Client:

Running Start Department
Green River College

---

# Final Handoff Summary

The Running Start Digital Support Portal has been prepared for deployment, client handoff, and long-term maintenance.

The system provides:

- Searchable FAQs
- Admin-managed content
- Responsive design
- Accessibility improvements
- Deployment documentation
- Maintenance documentation

The portal is designed to be maintainable, scalable, and easy for future stakeholders to support.