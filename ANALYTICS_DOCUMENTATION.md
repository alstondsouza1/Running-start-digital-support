# Analytics Documentation – Running Start Digital Support Portal

## Overview

This document explains the analytics implementation used in the Running Start Digital Support Portal project.

The purpose of analytics in this project is to help the Running Start Department better understand how students use the FAQ system while protecting student privacy.

Analytics are used to:

- Understand which FAQ topics are viewed most often
- Identify commonly searched topics
- Improve FAQ organization and student support
- Understand general usage patterns

No personal or identifiable student information is collected.

---

# Analytics Goals

The analytics implementation was designed to support the following goals:

- Track FAQ usage patterns
- Measure category engagement
- Understand search behavior
- Improve content organization
- Maintain student privacy

---

# Privacy & Data Collection

## No Personal Information Collected

This project does NOT collect:

- Student names
- Student IDs
- Email addresses
- Login information
- IP addresses (intentionally stored by the application)
- Personal academic information

Analytics events are anonymous and intended only for general usage insights.

---

# Analytics Events Implemented

## FAQ Question Click Tracking

Tracks when a student opens an FAQ accordion.

### Example Event

```js
trackQuestionClick({
  question,
  categoryId,
  categoryName,
  source,
});
```

### Purpose

Used to identify:

- Frequently viewed questions
- Popular FAQ categories
- Whether users arrived from browsing or searching

---

## FAQ Search Tracking

Tracks when a user performs a search.

### Example Event

```js
trackFaqSearch({
  searchTerm,
  resultCount,
});
```

### Purpose

Used to identify:

- Common search topics
- Missing FAQ content
- Search effectiveness

---

## Category Click Tracking

Tracks category selection activity.

### Example Event

```js
trackCategoryClick({
  categoryId,
  categoryName,
  audience,
});
```

### Purpose

Used to understand:

- Which categories are most accessed
- Whether Current or Future student sections are used more often

---

# Google Analytics Setup

## Analytics Platform

Google Analytics 4 (GA4)

---

## Basic Setup Process

1. Create a Google Analytics property
2. Generate a Measurement ID
3. Add the Measurement ID to the frontend environment variables
4. Initialize analytics in the React application
5. Send custom analytics events

---

# Example Environment Variable

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

# Example Analytics Initialization

```js
gtag("config", "G-XXXXXXXXXX");
```

---

# Event Examples

## FAQ Click Event

```js
gtag("event", "faq_click", {
  question: question,
  category: categoryName,
});
```

---

## Search Event

```js
gtag("event", "faq_search", {
  search_term: searchTerm,
  results: resultCount,
});
```

---

# How Stakeholders Can Use Analytics

Analytics can help stakeholders:

- Identify common student concerns
- Improve FAQ wording and organization
- Detect areas where students struggle to find information
- Prioritize updates for frequently accessed topics

---

# Example Questions Analytics Can Help Answer

- Which FAQ category is used most often?
- What questions are searched frequently?
- Are students using search more than browsing?
- Which topics may need clearer explanations?

---

# Maintenance & Ownership

## Current Ownership

Capstone Team:
- Alston Dsouza
- Diana Khachaturova
- Laura Villaraza
- Daniel McCarragher

---

## Future Ownership

The Running Start Department or future student developers may maintain analytics setup and review usage trends.

---

# Maintenance Tasks

Future maintainers should:

- Verify Google Analytics tracking remains active
- Review analytics periodically
- Remove unused events if needed
- Ensure privacy standards continue to be followed
- Keep analytics documentation updated

---

# Limitations

Current analytics implementation is intentionally lightweight.

Limitations include:

- No advanced dashboards yet
- No heatmaps or session replay tools
- No user-level tracking
- Limited historical reporting
- No automated analytics reports

---

# Future Improvements

Potential future analytics improvements:

- Admin analytics dashboard
- Monthly FAQ reports
- Search trend analysis
- Accessibility interaction tracking
- Better visualization of category usage

---

# Privacy Statement

This project intentionally avoids collecting personally identifiable information (PII).

Analytics are used only for:
- General usage understanding
- FAQ improvement
- Student support optimization

The system is designed to prioritize student privacy and minimize unnecessary data collection.

---

# Notes for Reviewers

When reviewing analytics:

- Verify events trigger correctly
- Confirm no personal data is collected
- Review event naming consistency
- Check Google Analytics integration configuration
- Ensure analytics do not impact application performance

---

# Related Files

Possible related frontend files:

```txt
frontend/src/utils/analytics.js
frontend/src/components/StudentFAQPage.jsx
```

---

# Summary

The analytics implementation provides a lightweight, privacy-conscious way for the Running Start Department to better understand FAQ usage and improve student support without collecting personal student information.