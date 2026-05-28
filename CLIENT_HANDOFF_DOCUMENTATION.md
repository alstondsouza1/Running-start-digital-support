# Running Start Digital Support Portal

## Client Handoff Documentation

---

## 1. Introduction

The Running Start Digital Support Portal is a full-stack web application created for the Running Start Department at Green River College.

The purpose of this portal is to help current and future Running Start students quickly find answers to common questions through a searchable and organized FAQ system.

The portal includes:

* Current Student FAQ page
* Future Student FAQ page
* Searchable FAQ content
* Category-based browsing
* “Need More Help?” support section
* Accessibility toolbar
* Translation support
* Admin dashboard
* FAQ management
* Category management
* Google Analytics tracking without collecting personal student information

This project was created by the capstone team **“Why Are You Running?”**

Team members:

* Alston Dsouza
* Diana Khachaturova
* Laura Villaraza
* Daniel McCarragher

Client:

* Running Start Department, Green River College

---

## 2. Project Links

### Live Website

https://running-start-portal.vercel.app/

### GitHub Repository

https://github.com/alstondsouza1/Running-start-digital-support

### Trello Board

https://trello.com/invite/b/69669c5abb85a669e34c0f76/ATTI88df20f8cd33ccad3f8d1735454b3f5e13CA8B77/capstone-why-are-you-running

---

## 3. Key Features

### Student Features

Students can:

* Browse FAQs for current students
* Browse FAQs for future students
* Search FAQ questions by keyword
* Select categories to view related questions
* Open resource links
* Use the portal on desktop, tablet, and mobile
* Access support information if they cannot find an answer

### Admin Features

Admins can:

* Login securely
* Add FAQs
* Edit FAQs
* Delete FAQs
* Reorder FAQs
* Create categories
* Edit categories
* Delete categories
* Manage current and future student content separately

### Accessibility Features

The portal includes:

* Keyboard navigation support
* Visible focus states
* Skip link support
* Readable font mode
* High contrast mode
* Text size adjustment
* Read aloud feature
* Google Translate support

---

## 4. Technical Overview

### Frontend

The frontend is built with:

* React
* Vite
* Material UI
* React Router
* DnD Kit

The frontend handles:

* Student pages
* FAQ display
* Search
* Category selection
* Accessibility toolbar
* Admin dashboard interface

### Backend

The backend is built with:

* Node.js
* Express.js
* JWT authentication
* bcryptjs
* mysql2
* dotenv

The backend handles:

* FAQ API routes
* Admin authentication
* FAQ CRUD operations
* Category CRUD operations
* Database communication

### Database

The database uses:

* MySQL

Main tables:

* `faq`
* `categories`

### Hosting

Current hosting setup:

| Part      | Service            |
| --------- | ------------------ |
| Frontend  | Vercel             |
| Backend   | Render             |
| Database  | Aiven MySQL        |
| Analytics | Google Analytics 4 |

---

## 5. System Architecture

```text
Student / Admin Browser
        |
        v
Frontend - React + Vite - Vercel
        |
        v
Backend API - Node.js + Express - Render
        |
        v
MySQL Database - Aiven
```

---

## 6. Common Student Tasks

### View Current Student FAQs

1. Open the portal homepage.
2. Select **Current Student FAQs**.
3. Browse available categories.
4. Select a category.
5. Open FAQ questions to view answers.

### View Future Student FAQs

1. Open the portal homepage.
2. Select **Future Student FAQs**.
3. Browse available categories.
4. Select a category.
5. Open FAQ questions to view answers.

### Search for an FAQ

1. Go to either the Current Student or Future Student page.
2. Click inside the search bar.
3. Type a keyword such as:

   * fee waiver
   * book loan
   * deadline
   * enrollment
   * ctcLink
4. Review the search results.
5. Open the matching FAQ question.

### Use the “Need More Help?” Section

If a student cannot find an answer:

1. Scroll to the **Need More Help?** section.
2. Use one of the support options:

   * Virtual Lobby
   * Email
   * Phone
3. Confirm official information with the Running Start office.

---

## 7. Common Admin Tasks

### Admin Login

Admin login page:

```text
/admin-login
```

Steps:

1. Go to `/admin-login`.
2. Enter admin username.
3. Enter admin password.
4. Click **Login**.
5. After successful login, the admin dashboard opens.

### Add a New FAQ

1. Login as admin.
2. Go to the admin dashboard.
3. Click **Add FAQ**.
4. Select audience:

   * Current
   * Future
5. Select category.
6. Enter the question.
7. Add an optional intro.
8. Add at least one bullet point.
9. Add optional links if needed.
10. Click **Submit FAQ**.
11. Verify the FAQ appears on the student page.

### Edit an FAQ

1. Login as admin.
2. Find the FAQ in the dashboard.
3. Click **Edit**.
4. Update the question, category, or answer.
5. Click **Update FAQ**.
6. Verify the change on the student page.

### Delete an FAQ

1. Login as admin.
2. Find the FAQ in the dashboard.
3. Click **Delete**.
4. Confirm deletion.
5. Verify the FAQ no longer appears.

### Reorder FAQs

1. Login as admin.
2. Find the category section.
3. Drag FAQ items into the desired order.
4. The order is saved through the backend.
5. Refresh or view the student page to confirm the order.

### Add a Category

1. Login as admin.
2. Open **Manage Categories**.
3. Select audience:

   * Current
   * Future
4. Enter category name.
5. Add a short description.
6. Submit the category.
7. Verify the category appears in the FAQ page.

### Edit a Category

1. Login as admin.
2. Open **Manage Categories**.
3. Find the category.
4. Click **Edit**.
5. Update the name or description.
6. Save changes.

### Delete a Category

1. Login as admin.
2. Open **Manage Categories**.
3. Find the category.
4. Click **Delete**.
5. Confirm deletion.

Important note: Before deleting a category, confirm that no important FAQs are still assigned to it.

---

## 8. Accessibility Documentation

### Accessibility Areas Reviewed

The team manually reviewed:

* Homepage keyboard navigation
* Category keyboard navigation
* FAQ search usability
* FAQ accordion interaction
* Visible focus states
* Skip link behavior
* Admin dashboard instructions
* Mobile responsiveness

### Accessibility Improvements Implemented

* Improved keyboard navigation
* Improved category card behavior
* Added clearer ARIA labels
* Preserved visible focus indicators
* Added readable font mode
* Added high contrast mode
* Added text size controls
* Added read aloud functionality
* Added translation support

### Remaining Accessibility Limitations

* Drag-and-drop is still mainly mouse-based
* More screen reader testing is recommended
* Automated accessibility testing tools could be added later
* Full WCAG testing should be completed before official long-term production use

### Manual Accessibility Testing Steps

1. Use `Tab` and `Shift + Tab` to move through the homepage.
2. Confirm visible focus indicators appear.
3. Use keyboard only to open Current Student and Future Student pages.
4. Search FAQs using the keyboard.
5. Expand and collapse FAQ accordions.
6. Test text size adjustment.
7. Test high contrast mode.
8. Test readable font mode.
9. Test read aloud.
10. Test translation.

---

## 9. Analytics Documentation

### Analytics Purpose

Google Analytics is used to help the Running Start Department understand general FAQ usage without collecting personal student information.

Analytics help answer questions such as:

* Which FAQ topics are viewed most often?
* Which categories are used most?
* What topics are students searching for?
* Are students using search or browsing categories more often?

### Privacy Statement

The project does not intentionally collect:

* Student names
* Student IDs
* Email addresses
* Academic records
* Login information from students
* Personal support details

Analytics are intended only for general usage patterns.

### Events Tracked

The portal can track:

* FAQ question clicks
* FAQ searches
* Category clicks

### Example Analytics Events

FAQ click:

```js
trackQuestionClick({
  question,
  categoryId,
  categoryName,
  source,
});
```

FAQ search:

```js
trackFaqSearch({
  searchTerm,
  resultCount,
});
```

Category click:

```js
trackCategoryClick({
  categoryId,
  categoryName,
  audience,
});
```

### Google Analytics Environment Variable

Frontend environment variable:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Analytics Maintenance

Future maintainers should:

* Confirm Google Analytics is still connected
* Review analytics periodically
* Avoid collecting personal information
* Keep analytics documentation updated
* Remove unused events if needed

---

## 10. Deployment Guide

### Frontend Deployment

Frontend is hosted on Vercel.

Typical deployment process:

1. Push frontend changes to GitHub.
2. Vercel automatically detects changes.
3. Vercel builds and deploys the frontend.
4. Confirm the production site loads correctly.

Frontend production environment variable:

```env
VITE_API_BASE=https://your-backend-url/api
```

### Backend Deployment

Backend is hosted on Render.

Typical deployment process:

1. Push backend changes to GitHub.
2. Render rebuilds the backend service.
3. Confirm environment variables are configured.
4. Test backend API routes.

Backend environment variables:

```env
PORT=5001
JWT_SECRET=your-secret
DB_HOST=your-host
DB_PORT=3306
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=your-db
```

### Database Setup

Database uses MySQL.

Basic setup:

```sql
CREATE DATABASE runningstart;
USE runningstart;
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

## 11. Embedding Guidance

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

Recommended placement:

```text
Running Start Website
   ↓
Frequently Asked Questions
   ↓
Embedded Portal
```

Benefits:

* Students remain on the college website
* FAQ content stays centralized
* Updates appear automatically
* Admins do not need to edit the college webpage for normal FAQ updates

---

## 12. Maintenance and Change Management

### Content Ownership

The Running Start Department should own:

* FAQ accuracy
* Policy wording
* Deadlines
* Office hours
* Contact information
* Resource links

### Technical Ownership

Future developers, interns, or college technical staff should own:

* Code updates
* Backend maintenance
* Database maintenance
* Deployment setup
* Security updates
* Dependency updates

### Small FAQ Updates

For normal content updates:

1. Login to admin dashboard.
2. Edit or add FAQ.
3. Save changes.
4. Verify frontend display.

No code deployment should be required.

### Technical Code Updates

For code changes:

1. Create a new Git branch.
2. Make changes locally.
3. Test frontend and backend.
4. Commit changes.
5. Open a pull request.
6. Review and merge.
7. Deploy through Vercel or Render.

### Recommended Maintenance Schedule

Monthly:

* Review FAQ accuracy
* Check broken links
* Confirm backend uptime
* Review analytics

Quarterly:

* Review accessibility
* Update dependencies
* Review admin access
* Check security settings

Annually:

* Review hosting costs
* Review project ownership
* Review sustainability
* Evaluate future feature requests

---

## 13. Security Notes

Current protections:

* JWT authentication
* bcrypt password hashing
* Protected admin routes
* Environment variables for secrets
* SQL parameters used in queries

Known concerns:

* JWT is stored in localStorage
* Rate limiting may need improvement
* Additional security hardening is recommended
* Secrets must never be committed to GitHub

Future security recommendations:

* Add Helmet middleware
* Add stronger rate limiting
* Use secure HTTP-only cookies
* Improve role-based access control
* Add automated security checks
* Rotate secrets periodically

---

## 14. Troubleshooting

### Website Does Not Load

Check:

* Vercel deployment status
* Frontend build logs
* Browser console errors
* Environment variables

### FAQs Do Not Load

Check:

* Backend is running
* Database is connected
* `VITE_API_BASE` is correct
* API route works:

```text
GET /api/getFAQS?audience=current
```

### Login Does Not Work

Check:

* Admin username is correct
* Password hash is configured
* JWT secret is configured
* Backend auth route is working

### Categories Are Missing

Check:

```text
GET /api/categories
```

Confirm category records exist in the database.

### Translation Does Not Work

Check:

* Google Translate script loads
* Browser extensions are not blocking Google Translate
* No CSS is hiding Google Translate iframe
* Test in an incognito window

### Deployment Fails

Check:

* Environment variables
* Build logs
* Database credentials
* Node version
* API base URL

---

## 15. Emergency / Support Information

If the portal has a major issue:

1. Check Vercel deployment status.
2. Check Render backend status.
3. Check Aiven database status.
4. Review recent GitHub commits.
5. Roll back to a previous working deployment if needed.
6. Contact the technical maintainer or future assigned support team.

### Support Contacts

Current capstone team:

* Alston Dsouza
* Diana Khachaturova
* Laura Villaraza
* Daniel McCarragher

Client department:

* Running Start Department
* Green River College

Future support may include:

* Running Start student workers
* BAS Software Development students
* College IT support staff
* Future capstone teams

---

## 16. Admin Credentials and Access

For security reasons, do not include real production passwords in public documentation or GitHub.

Recommended secure handoff process:

* Share admin username directly with the client
* Share password through a secure method
* Store credentials in a protected department password manager
* Rotate credentials after handoff if needed

Example placeholder:

```text
Admin Login URL: /admin-login
Username: Provided securely to client
Password: Provided securely to client
```

---

## 17. Testing Checklist

Before final handoff, test:

* Homepage loads
* Current Student page loads
* Future Student page loads
* FAQ search works
* FAQ categories open
* FAQ accordions open
* Need More Help links work
* Admin login works
* Add FAQ works
* Edit FAQ works
* Delete FAQ works
* Add category works
* Edit category works
* Delete category works
* Mobile layout works
* Accessibility toolbar works
* Translation works
* Analytics events trigger

---

## 18. Known Limitations

Current known limitations:

* Drag-and-drop accessibility is limited
* JWT is stored in localStorage
* No automated test suite yet
* No advanced analytics dashboard yet
* Some production settings may need future security hardening
* Translation is machine-generated and may not be perfect

---

## 19. Future Improvements

Recommended future improvements:

* Add automated tests
* Improve drag-and-drop keyboard accessibility
* Add admin analytics dashboard
* Add role-based access control
* Improve multilingual support
* Add broken-link checking
* Add automated backups
* Improve security configuration
* Add advanced search support
* Improve screen reader testing

---

## 20. Final Handoff Summary

The Running Start Digital Support Portal is designed to be a lightweight, maintainable, and accessible support tool for current and future Running Start students.

The system provides:

* Searchable FAQ content
* Student support pathways
* Admin-managed FAQ updates
* Category management
* Accessibility tools
* Translation support
* Privacy-conscious analytics
* Deployment and maintenance documentation

Most content updates can be completed through the admin dashboard without changing code.

Long-term success will depend on:

* Keeping FAQ content accurate
* Maintaining hosting and database access
* Reviewing analytics
* Updating dependencies
* Continuing accessibility improvements
* Assigning clear ownership after the capstone team graduates
