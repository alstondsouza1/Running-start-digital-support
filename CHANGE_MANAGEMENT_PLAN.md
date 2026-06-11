# Change Management & Maintenance Plan

## Running Start Digital Support Portal

---

# Overview

This document explains the long-term maintenance, ownership, and change management process for the Running Start Digital Support Portal.

The goal of this plan is to help future maintainers, student developers, technical staff, or stakeholders continue updating and supporting the project after the original capstone team graduates.

This document includes:

* FAQ update workflows
* Ownership responsibilities
* Deployment considerations
* Database maintenance
* Security considerations
* Accessibility sustainability
* Risks and recommendations
* Long-term sustainability guidance

---

# Project Purpose

The Running Start Digital Support Portal was created to:

* Reduce repetitive support requests
* Help current and future students quickly find answers
* Provide searchable and organized FAQ content
* Allow administrators to manage FAQ information through a dashboard
* Improve accessibility and usability for all users

Because policies, deadlines, and program requirements may change over time, ongoing maintenance is required.

---

# Ownership Roles

## Running Start Department

The Running Start Department is responsible for:

* Reviewing FAQ content accuracy
* Requesting updates when policies change
* Identifying outdated information
* Reviewing student feedback
* Communicating needed content changes

---

## Technical Maintainers

Future student developers, interns, or technical staff are responsible for:

* Updating frontend and backend code
* Managing deployments
* Maintaining database access
* Fixing bugs
* Updating dependencies
* Maintaining security configurations
* Reviewing analytics integrations
* Maintaining accessibility features

---

# FAQ Update Workflow

## Small Content Updates

Examples:

* Deadline changes
* Office hours
* Resource links
* Contact information

### Recommended Process

1. Login to the admin dashboard.
2. Navigate to the appropriate audience section.
3. Edit or add the FAQ entry.
4. Save changes.
5. Verify updates on the frontend.

No code deployment should be required for normal FAQ content updates.

---

## Category Updates

Examples:

* Adding new FAQ categories
* Renaming categories
* Removing outdated categories

### Recommended Process

1. Review category organization.
2. Add or edit categories through admin tools.
3. Verify FAQs still map correctly.
4. Test frontend display.
5. Confirm search behavior still works.

---

## Technical / Code Updates

Examples:

* UI improvements
* Accessibility updates
* Backend changes
* Authentication changes
* Analytics enhancements

### Recommended Workflow

1. Create a new Git branch.
2. Make code changes.
3. Test locally.
4. Review functionality.
5. Create a pull request.
6. Merge into the main branch.
7. Deploy frontend and backend updates.

---

# Deployment Workflow

## Frontend Deployment

Hosted on:

* Vercel

Typical deployment steps:

1. Push changes to GitHub.
2. Vercel automatically builds the frontend.
3. Verify deployment completed successfully.
4. Test the production website.

---

## Backend Deployment

Hosted on:

* Render

Typical deployment steps:

1. Push backend updates to GitHub.
2. Render rebuilds the backend service.
3. Verify environment variables.
4. Confirm database connectivity.
5. Test API routes.

---

## Environment Variables

Future maintainers should verify:

* `VITE_API_BASE`
* `VITE_GOOGLE_ID`
* Database credentials
* JWT secret values

Environment variables should never be committed to GitHub repositories.

---

# Database Maintenance

Database:

* MySQL (Aiven cloud database in production)
* Local MySQL environment for development

Recommended maintenance tasks:

* Maintain backups
* Monitor connection credentials
* Review database access permissions
* Update schema carefully when needed
* Verify FAQ data integrity after updates

---

# Recommended Maintenance Schedule

## Monthly

* Review FAQ accuracy
* Check broken links
* Review analytics usage
* Verify Google Analytics tracking
* Verify Vercel Analytics tracking
* Review feedback form submissions
* Confirm backend uptime

---

## Quarterly

* Review accessibility improvements
* Update dependencies
* Review admin access
* Review security settings
* Review deployment configurations

---

## Annually

* Review hosting costs
* Review architecture decisions
* Evaluate new feature requests
* Review project sustainability
* Review documentation quality

---

# Risks & Long-Term Concerns

## Technical Risks

### Dependency Updates

Libraries and packages may become outdated.

Examples:

* React
* Material UI
* Express
* JWT packages

Recommendation:

* Regularly update dependencies and test thoroughly.

---

### Hosting Changes

Hosting providers may change pricing or limitations.

Recommendation:

* Review hosting plans periodically.
* Keep deployment documentation updated.

---

### Knowledge Transfer

Future maintainers may not be familiar with the project structure.

Recommendation:

* Maintain updated README and documentation.
* Keep comments and architecture notes current.

---

## Security Risks

Current known concerns:

* JWT authentication currently uses browser localStorage.
* Rate limiting currently focuses on administrative login attempts.
* Additional security hardening may be beneficial as the application grows.
* Administrative access should be periodically reviewed and updated.

### Recommendations

* Expand API rate limiting beyond login attempts.
* Improve token handling in future versions.
* Review administrator permissions regularly.
* Rotate secrets when necessary.

---

# Accessibility Sustainability

Accessibility should continue being reviewed as the project evolves.

Recommended future tasks:

* Improve keyboard accessibility
* Improve screen reader support
* Continue WCAG 2.1 AA compliance improvements
* Test drag-and-drop accessibility
* Continue testing accessibility toolbar functionality across desktop and mobile devices
* Verify Google Translate functionality after deployment updates
* Review accessibility-related feedback submissions

---

# Analytics Maintenance

Analytics should be reviewed periodically to ensure accurate reporting.

Current analytics tools:

* Google Analytics 4 (GA4)
* Vercel Analytics

Recommended tasks:

* Verify event tracking remains active
* Review search trends
* Monitor category engagement
* Confirm analytics continue to avoid collecting personally identifiable information (PII)

---

# Handoff Notes

## Current Capstone Team

* Alston Dsouza
* Diana Khachaturova
* Laura Villaraza
* Daniel McCarragher

---

## Recommended Future Maintainers

Potential future maintainers may include:

* Running Start student workers
* BAS Software Development students
* College IT support staff
* Future capstone teams

---

# Recommended Documentation Files

Future maintainers should review:

```txt
README.md
ACCESSIBILITY_NOTES.md
ANALYTICS_DOCUMENTATION.md
CHANGE_MANAGEMENT_PLAN.md
```

---

# Suggested Future Improvements

Potential future enhancements:

* Better admin dashboard UI
* Full multilingual support
* Advanced analytics dashboard
* Expanded automated and accessibility testing
* Better accessibility tooling
* Role-based admin permissions
* Accessibility usage reporting
* Mobile accessibility enhancements
* FAQ approval workflows
* Search result relevance improvements

---

# Sustainability Recommendations

To improve long-term sustainability:

* Keep documentation updated
* Minimize hardcoded values
* Use environment variables properly
* Avoid storing secrets in repositories
* Keep deployments simple and repeatable
* Review security and accessibility regularly

---

# Quick Maintenance Checklist

## Before Deployment

* Test frontend locally
* Test backend API routes
* Verify database connection
* Check environment variables
* Review console errors
* Verify analytics tracking

---

## After Deployment

* Verify production site loads correctly
* Test FAQ search
* Test admin login
* Confirm FAQ CRUD functionality
* Verify accessibility features
* Confirm analytics events are being recorded

---

# Summary

The Running Start Digital Support Portal was designed to support long-term maintainability through:

* Simple FAQ management
* Clear frontend/backend separation
* Admin-managed content updates
* Accessibility-focused design
* Analytics integration
* Documentation and handoff materials

Ongoing maintenance, accessibility reviews, security improvements, and documentation updates will help ensure the project remains useful for future Running Start students, staff, and technical maintainers.
