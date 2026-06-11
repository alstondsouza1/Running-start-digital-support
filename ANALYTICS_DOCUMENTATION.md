# Analytics Documentation – Running Start Digital Support Portal

## Overview

This document explains the analytics implementation used in the Running Start Digital Support Portal project.

The purpose of analytics is to help the Running Start Department better understand how students use the FAQ system while protecting student privacy.

Analytics are used to:

* Understand which FAQ topics are viewed most often
* Identify commonly searched topics
* Measure category engagement
* Improve FAQ organization and student support
* Understand general usage patterns

No personal or identifiable student information is intentionally collected by the application.

---

# Analytics Goals

The analytics implementation was designed to support the following goals:

* Track FAQ usage patterns
* Measure category engagement
* Understand search behavior
* Improve content organization
* Maintain student privacy
* Support future content decisions for the Running Start Department

---

# Privacy & Data Collection

## No Personal Information Collected

This project does NOT intentionally collect:

* Student names
* Student IDs
* Email addresses
* Student login information
* Personal academic information
* Personal support details
* IP addresses stored directly by the application

Analytics events are anonymous and intended only for general usage insights.

---

# Analytics Tools Used

## Dual Tracking (Google Analytics 4 + Vercel Analytics)

All meaningful user actions are tracked through a single centralized utility
(`frontend/src/utils/analytics.js`). Each helper sends the event to **both**
Google Analytics 4 (via `window.gtag`) **and** Vercel Analytics (via
`track()` from `@vercel/analytics`). Components import these named helpers
rather than calling `track()` or `gtag()` directly, so event names and
payloads stay consistent and only business-important actions are instrumented
(not every button or component).

Both destinations are best-effort and guarded:

* The Vercel call is wrapped in a `try/catch` so analytics can never break the UI.
* The GA call is a no-op unless `window.gtag` is present (initialized in `index.html`).

## Google Analytics 4 (GA4)

Google Analytics 4 receives every centralized event. The three original FAQ
events keep their established names so existing GA reports continue to work:
`question_click`, `faq_search`, `category_click`. The remaining events were
added alongside the Vercel rollout.

---

## Vercel Analytics

Vercel Analytics receives every centralized event as a named custom event, in
addition to the automatic anonymous traffic and performance data collected by
the `<Analytics />` component.

Vercel Analytics can help monitor:

* Page usage
* General traffic patterns
* Deployment performance
* Basic usage trends
* Production troubleshooting information

No personally identifiable information is intentionally collected by the application through Vercel Analytics.

---

## Tracked Events (Full List)

Every action below is sent to both GA4 and Vercel Analytics.

| User action | Vercel event name | GA4 event name |
| --- | --- | --- |
| Page visit (named per route) | `Page Visit` | `page_visit` |
| Navigation menu click | `Navigation Click` | `navigation_click` |
| FAQ search | `FAQ Search` | `faq_search` |
| FAQ question opened | `FAQ Opened` | `question_click` |
| Category selected | `Category Selected` | `category_click` |
| Support/help contact click | `Support Contact Clicked` | `support_contact_clicked` |
| Feedback / contact form opened | `Feedback Form Opened` | `feedback_form_opened` |
| Admin login attempt | `Login Attempt` | `login_attempt` |
| Admin login success | `Login Success` | `login_success` |
| Admin logout | `Logout` | `logout` |
| Admin form submitted (FAQ/category) | `Form Submitted` | `form_submitted` |
| Admin dashboard access | `Admin Page Access` | `admin_page_access` |
| External resource link click | `External Link Clicked` | `external_link_clicked` |

> Login events capture **no** credentials — only that an attempt/success occurred.

---

# Analytics Events Implemented

## FAQ Question Click Tracking

Tracks when a student opens an FAQ accordion.

### Event Name

```js
question_click
```

### Function

```js
trackQuestionClick({
  question,
  categoryId,
  categoryName,
  source,
});
```

### Event Payload

```js
window.gtag("event", "question_click", {
  question_text: question,
  category_id: categoryId,
  category_name: categoryName,
  source,
});
```

### Purpose

Used to identify:

* Frequently viewed questions
* Popular FAQ categories
* Whether users arrived from browsing or searching

---

## FAQ Search Tracking

Tracks when a user performs a search.

### Event Name

```js
faq_search
```

### Function

```js
trackFaqSearch({
  searchTerm,
  resultCount,
});
```

### Event Payload

```js
window.gtag("event", "faq_search", {
  search_term: searchTerm,
  result_count: resultCount,
});
```

### Purpose

Used to identify:

* Common search topics
* Missing FAQ content
* Search effectiveness
* Whether students are finding useful results

---

## Category Click Tracking

Tracks category selection activity.

### Event Name

```js
category_click
```

### Function

```js
trackCategoryClick({
  categoryId,
  categoryName,
  audience,
});
```

### Event Payload

```js
window.gtag("event", "category_click", {
  category_id: categoryId,
  category_name: categoryName,
  audience,
});
```

### Purpose

Used to understand:

* Which categories are most accessed
* Whether Current Student or Future Student sections are used more often
* Which FAQ groups may need additional content or organization

---

# Google Analytics Setup

## Analytics Platform

Google Analytics 4 (GA4)

---

## Setup Process

1. Create a Google Analytics property.
2. Generate a Measurement ID.
3. Add the Measurement ID to the frontend environment variables.
4. Initialize analytics in the React application.
5. Send custom analytics events from FAQ interactions.

---

# Environment Variable

```env
VITE_GOOGLE_ID=G-XXXXXXXXXX
```

Example:

```env
VITE_GOOGLE_ID=G-P4NJQS22PM
```

---

# Analytics Initialization

Google Analytics is initialized in the frontend `index.html`.

Example:

```js
const id = "%VITE_GOOGLE_ID%";

if (id && !id.startsWith("%VITE_")) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", id);
}
```

---

# How Stakeholders Can Use Analytics

Analytics can help stakeholders:

* Identify common student concerns
* Improve FAQ wording and organization
* Detect areas where students struggle to find information
* Prioritize updates for frequently accessed topics
* Understand whether students use search or category browsing more often
* Review usage trends between Current Student and Future Student sections

---

# Example Questions Analytics Can Help Answer

* Which FAQ category is used most often?
* Which FAQ questions are viewed most frequently?
* What questions are searched frequently?
* Are students using search more than browsing?
* Are students finding useful search results?
* Which topics may need clearer explanations?
* Which FAQ entries should be moved higher in the category order?

---

# Maintenance & Ownership

## Current Ownership

Capstone Team:

* Alston Dsouza
* Diana Khachaturova
* Laura Villaraza
* Daniel McCarragher

---

## Future Ownership

The Running Start Department or future student developers may maintain the analytics configuration and review usage trends.

---

# Maintenance Tasks

Future maintainers should:

* Verify Google Analytics tracking remains active.
* Verify Vercel Analytics remains active.
* Review analytics periodically.
* Remove unused events when necessary.
* Ensure privacy standards continue to be followed.
* Keep analytics documentation updated.
* Confirm the correct measurement ID is used in production.
* Avoid collecting personally identifiable information (PII).

---

# Limitations

The current analytics implementation is intentionally lightweight.

Limitations include:

* No admin analytics dashboard yet
* No heatmaps
* No session replay tools
* No user-level tracking
* Limited historical reporting
* No automated analytics reports
* No built-in reporting dashboard inside the portal

---

# Future Improvements

Potential future analytics improvements:

* Admin analytics dashboard
* Monthly FAQ usage reports
* Search trend analysis
* Accessibility toolbar usage analytics
* Translation feature usage analytics
* Read Aloud feature usage analytics
* Better category engagement visualizations
* Exportable stakeholder reports
* Additional non-PII content performance metrics

---

# Privacy Statement

This project intentionally avoids collecting personally identifiable information (PII).

Analytics are used only for:

* General usage understanding
* FAQ improvement
* Student support optimization
* Content organization decisions
* Production performance monitoring

The system is designed to prioritize student privacy and minimize unnecessary data collection.

---

# Notes for Reviewers

When reviewing analytics:

* Verify events trigger correctly.
* Confirm no personal data is collected.
* Review event naming consistency.
* Check Google Analytics integration configuration.
* Confirm Vercel Analytics is enabled.
* Ensure analytics do not negatively impact application performance.
* Confirm analytics are used only for aggregate usage trends.

---

# Related Files

```txt
frontend/src/utils/analytics.js            (centralized tracking utility)
frontend/index.html                        (GA4 initialization)
frontend/src/App.jsx                        (page visits)
frontend/src/components/Navbar.jsx          (navigation clicks, logout, feedback)
frontend/src/components/StudentFAQPage.jsx  (FAQ search, opens, category select)
frontend/src/components/NeedMoreHelp.jsx    (support contact clicks)
frontend/src/components/QuickLinksPanel.jsx (external resource links)
frontend/src/components/FeedbackButton.jsx  (feedback/contact form open)
frontend/src/components/admin/AdminLogin.jsx   (login attempt/success)
frontend/src/components/admin/addFAQ.jsx       (FAQ form submit)
frontend/src/components/admin/addCategory.jsx  (category form submit)
frontend/src/pages/Admin.jsx                   (admin page access)
```

---

# Summary

The analytics implementation provides a lightweight, privacy-conscious way for the Running Start Department to better understand FAQ usage and improve student support without collecting personal student information.

The project uses Google Analytics 4 for custom FAQ interaction tracking and Vercel Analytics for anonymous traffic and performance insights. Together, these tools help stakeholders understand usage patterns while keeping the portal simple, maintainable, and privacy-conscious.
