# Change Management & Maintenance Plan  
Running Start Digital Support Portal

---

# Overview

This document explains the long-term maintenance, ownership, and change management process for the Running Start Digital Support Portal.

The goal of this plan is to help future maintainers, student developers, or stakeholders continue updating and supporting the project after the original capstone team graduates.

This document includes:

- FAQ update workflows
- Ownership responsibilities
- Deployment considerations
- Risks and recommendations
- Long-term sustainability guidance

---

# Project Purpose

The Running Start Digital Support Portal was created to:

- Reduce repetitive support requests
- Help current and future students quickly find answers
- Provide searchable and organized FAQ content
- Allow administrators to manage FAQ information through a dashboard

Because policies and deadlines may change over time, ongoing maintenance is required.

---

# Ownership Roles

## Running Start Department

The Running Start Department is responsible for:

- Reviewing FAQ content accuracy
- Requesting updates when policies change
- Identifying outdated information
- Communicating needed content changes

---

## Technical Maintainers

Future student developers, interns, or technical staff are responsible for:

- Updating frontend and backend code
- Managing deployments
- Maintaining database access
- Fixing bugs
- Updating dependencies
- Maintaining security configurations

---

# FAQ Update Workflow

## Small Content Updates

Examples:
- Deadline changes
- Office hours
- Resource links
- Contact information

### Recommended Process

1. Login to admin dashboard
2. Navigate to appropriate audience section
3. Edit or add FAQ entry
4. Save changes
5. Verify updates on frontend

No code deployment should be required for normal FAQ content updates.

---

## Category Updates

Examples:
- Adding new FAQ categories
- Renaming categories
- Removing outdated categories

### Recommended Process

1. Review category organization
2. Add or edit categories through admin tools
3. Verify FAQs still map correctly
4. Test frontend display
5. Confirm search behavior still works

---

## Technical / Code Updates

Examples:
- UI improvements
- Accessibility updates
- Backend changes
- Authentication changes

### Recommended Workflow

1. Create a new Git branch
2. Make code changes
3. Test locally
4. Review functionality
5. Merge into main branch
6. Deploy frontend/backend updates

---

# Deployment Workflow

## Frontend Deployment

Hosted on:
- Vercel

Typical deployment steps:

1. Push changes to GitHub
2. Vercel auto-builds frontend
3. Verify deployment completed successfully
4. Test production website

---

## Backend Deployment

Hosted on:
- Render

Typical deployment steps:

1. Push backend updates to GitHub
2. Render rebuilds backend service
3. Verify environment variables
4. Confirm database connectivity
5. Test API routes

---

# Database Maintenance

Database:
- MySQL (Aiven or Local)

Recommended maintenance tasks:

- Maintain backups
- Monitor connection credentials
- Review database access permissions
- Update schema carefully when needed

---

# Recommended Maintenance Schedule

## Monthly

- Review FAQ accuracy
- Check broken links
- Review analytics usage
- Confirm backend uptime

---

## Quarterly

- Review accessibility improvements
- Update dependencies
- Review admin access
- Review security settings

---

## Annually

- Review hosting costs
- Review architecture decisions
- Evaluate new feature requests
- Review project sustainability

---

# Risks & Long-Term Concerns

## Technical Risks

### Dependency Updates

Libraries and packages may become outdated.

Examples:
- React
- Material UI
- Express
- JWT packages

Recommendation:
- Regularly update dependencies and test thoroughly.

---

## Hosting Changes

Hosting providers may change pricing or limitations.

Recommendation:
- Review hosting plans periodically.
- Keep deployment documentation updated.

---

## Knowledge Transfer

Future maintainers may not be familiar with the project structure.

Recommendation:
- Maintain updated README and documentation.
- Keep comments and architecture notes current.

---

## Security Risks

Current known concerns:

- JWT stored in localStorage
- Limited rate limiting
- Minimal security hardening

Recommendation:
- Add Helmet middleware
- Add rate limiting
- Improve token handling in future versions

---

# Accessibility Sustainability

Accessibility should continue being reviewed as the project evolves.

Recommended future tasks:

- Improve keyboard accessibility
- Improve screen reader support
- Continue WCAG 2.1 AA compliance improvements
- Test drag-and-drop accessibility

---

# Handoff Notes

## Current Capstone Team

- Alston Dsouza
- Diana Khachaturova
- Laura Villaraza
- Daniel McCarragher

---

## Recommended Future Maintainers

Potential future maintainers may include:

- Running Start student workers
- BAS Software Development students
- College IT support staff
- Future capstone teams

---

# Recommended Documentation Files

Future maintainers should review:

```txt
README.md
REVIEW_NOTES.md
ACCESSIBILITY_NOTES.md
ANALYTICS_DOCUMENTATION.md
CHANGE_MANAGEMENT_PLAN.md
```

---

# Suggested Future Improvements

Potential future enhancements:

- Better admin UI
- Full multilingual support
- Advanced analytics dashboard
- Automated testing
- Better accessibility tooling
- Role-based admin permissions

---

# Sustainability Recommendations

To improve long-term sustainability:

- Keep documentation updated
- Minimize hardcoded values
- Use environment variables properly
- Avoid storing secrets in repositories
- Keep deployments simple and repeatable

---

# Quick Maintenance Checklist

## Before Deployment

- Test frontend locally
- Test backend API routes
- Verify database connection
- Check environment variables
- Review console errors

---

## After Deployment

- Verify production site loads correctly
- Test FAQ search
- Test admin login
- Confirm FAQ CRUD functionality
- Verify accessibility basics

---

# Summary

The Running Start Digital Support Portal was designed to support long-term maintainability through:

- Simple FAQ management
- Clear frontend/backend separation
- Documentation and handoff notes
- Admin-managed content updates

Ongoing maintenance and documentation updates will help ensure the project remains useful for future Running Start students and staff.