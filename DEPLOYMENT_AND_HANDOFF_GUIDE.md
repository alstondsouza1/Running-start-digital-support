# Deployment & Handoff Guide

Running Start Digital Support Portal

---

# Overview

This document provides deployment information, client handoff instructions, embedding guidance, maintenance recommendations, and operational support details for the Running Start Digital Support Portal.

The goal is to ensure the Running Start Department can continue using, updating, and maintaining the portal with minimal technical support after the capstone project concludes.

---

# Project Status

Current Status:

* Frontend Complete
* Backend Complete
* Database Connected
* FAQ Management Functional
* Search Functionality Functional
* Mobile Responsive
* Accessibility Improvements Implemented
* Analytics Implemented
* Deployment Ready

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

# Current Hosting Services

| Service         | Provider           |
| --------------- | ------------------ |
| Frontend        | Vercel             |
| Backend         | Render             |
| Database        | Aiven MySQL        |
| Analytics       | Google Analytics 4 |
| Usage Analytics | Vercel Analytics   |

---

# Deployment Architecture

```txt
Student Browser
      │
      ▼
Frontend (React + Vite)
      │
      ▼
Vercel Hosting
      │
      ▼
Backend API (Node.js + Express)
      │
      ▼
Render Hosting
      │
      ▼
MySQL Database (Aiven)
```

---

# Deployment Components

## Frontend

Technology:

* React
* Vite
* Material UI
* React Router
* DnD Kit

Hosting:

* Vercel

Responsibilities:

* Display FAQs
* Search functionality
* Student interface
* Admin interface
* Accessibility tools
* Translation support
* Analytics event tracking

---

## Backend

Technology:

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* mysql2

Hosting:

* Render

Responsibilities:

* FAQ CRUD operations
* Category CRUD operations
* Authentication
* Database communication
* FAQ ordering
* Security validation

---

## Database

Technology:

* MySQL

Hosting:

* Aiven

Responsibilities:

* Store FAQs
* Store category data
* Store FAQ ordering
* Support admin management

---

# Frontend Deployment Steps

## Deploy to Vercel

1. Connect GitHub repository
2. Select frontend project
3. Configure environment variables
4. Deploy

Required environment variables:

```env
VITE_API_BASE=https://your-backend-url/api
VITE_GOOGLE_ID=G-XXXXXXXXXX
```

---

## Verify Frontend Deployment

Verify:

* Homepage loads
* Current Student page loads
* Future Student page loads
* Search works correctly
* FAQ links open correctly
* Mobile layout works correctly
* Accessibility toolbar opens correctly on mobile devices
* Translation dropdown loads successfully
* Text size controls function properly
* High contrast mode functions properly
* Read aloud feature functions properly

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
GET /api/getFAQS?audience=current
GET /api/getFAQS?audience=future
GET /api/categories
POST /api/admin/login
```

Expected:

* Successful responses
* No database errors
* Categories returned correctly
* Authentication functioning properly

---

# Database Setup

## Initial Setup

Create database:

```sql
CREATE DATABASE runningstart;
```

Configure the backend environment variables, then apply database migrations:

```bash
cd backend
npm run migrate
```

Run seed scripts if needed:

```bash
npm run seed:current
npm run seed:future
```

---

# Client Embedding Guidance

The portal can be embedded directly into the Green River College website using an iframe.

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
Embedded FAQ Portal
```

Benefits:

* Students remain on the Green River website
* FAQ content remains centralized
* Updates appear automatically
* Reduced maintenance effort

---

# Content Update Process

## Staff Updates

For normal FAQ updates:

1. Login to admin dashboard
2. Edit FAQ content
3. Save changes
4. Verify display on frontend

No deployment required.

---

# Admin Access

Admin Login:

```txt
/admin-login
```

Available Admin Functions:

* Add FAQ
* Edit FAQ
* Delete FAQ
* Reorder FAQs
* Add Categories
* Edit Categories
* Delete Categories

---

# Analytics

## Analytics Platforms

* Google Analytics 4
* Vercel Analytics

## Analytics Events Tracked

* FAQ Question Clicks
* FAQ Searches
* Category Selection

## Privacy Statement

The portal does not intentionally collect:

* Student names
* Student IDs
* Email addresses
* Academic records
* Personal support information

Analytics are used only for general usage trends and portal improvement.

---

# Client Handoff Checklist

## Documentation

Completed:

* README.md
* ACCESSIBILITY_NOTES.md
* ANALYTICS_DOCUMENTATION.md
* CHANGE_MANAGEMENT_PLAN.md
* DEPLOYMENT_AND_HANDOFF_GUIDE.md

---

## Deployment

Frontend:

* Deployed

Backend:

* Deployed

Database:

* Connected

---

## Functionality

Verified:

* FAQ Search
* FAQ Categories
* FAQ CRUD
* Category CRUD
* Admin Login
* Responsive Design
* Accessibility Tools
* Translation Support
* Analytics Tracking

---

# Minimal Maintenance Requirements

The portal was intentionally designed to require minimal maintenance.

Typical maintenance tasks include:

* Updating FAQ content
* Reviewing broken links
* Monitoring hosting services
* Reviewing analytics
* Updating dependencies periodically

Most content updates can be completed without code changes.

---

# Troubleshooting

## FAQs Not Loading

Check:

* Backend running
* Database connection
* API URL configuration
* Network requests

---

## Login Not Working

Check:

* JWT secret configured
* Admin credentials configured
* Token expiration
* Authentication routes

---

## Categories Missing

Verify:

```txt
GET /api/categories
```

Confirm categories exist in database.

---

## Translation Not Working

Check:

* Google Translate script loaded
* Browser extensions not blocking Google services
* Translation dropdown rendered
* CSS not hiding translation elements

---

## Deployment Errors

Check:

* Environment variables
* Database credentials
* Build logs
* Render logs
* Vercel logs

---

# Recommended Future Improvements

Potential future enhancements:

* Advanced analytics dashboard
* Accessibility usage reporting
* Search trend reporting
* Improved translation support
* Expanded automated and accessibility testing
* Enhanced accessibility tools
* Role-based permissions
* Automated backups
* Improved screen reader testing
* Additional security hardening

---

# Support Contacts

## Current Capstone Team

* Alston Dsouza
* Diana Khachaturova
* Laura Villaraza
* Daniel McCarragher

---

## Client

Running Start Department

Green River College

---

# Final Handoff Summary

The Running Start Digital Support Portal has been successfully prepared for deployment, client handoff, and long-term maintenance.

The system provides:

* Searchable FAQs
* Category-based organization
* Admin-managed content updates
* Mobile responsiveness
* Accessibility tools
* Translation support
* Privacy-conscious analytics
* Deployment documentation
* Maintenance documentation

Most future content updates can be completed directly through the admin dashboard without requiring code changes.

Long-term success will depend on:

* Maintaining accurate FAQ content
* Monitoring hosting services
* Reviewing analytics data
* Updating dependencies periodically
* Continuing accessibility improvements
* Assigning future project ownership
