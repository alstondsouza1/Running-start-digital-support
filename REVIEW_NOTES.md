# Review Notes – Running Start Digital Support Portal

## 1. Handoff / Documentation Review

### What Worked

- Repository structure was organized clearly between frontend and backend
- README included setup instructions, environment variables, and testing steps
- `.env.example` files were provided
- Project architecture was easy to understand
- Deployment overview was documented clearly
- Seed scripts helped simplify local setup

---

### Issues / Gaps Found

- README originally referenced `sql/schema.sql`, but the correct file is `sql/faq.sql`
- Local setup depends on correct MySQL configuration and credentials
- Admin password must be manually generated using bcrypt
- Some naming inconsistencies exist between:
  - “Future Students”
  - “Prospective Students”
- Some older frontend data files may still exist and should be cleaned up
- Accessibility improvements are still ongoing

---

### Questions Raised

- Should reviewers use local MySQL or cloud MySQL for testing?
- Which frontend data files are active versus legacy?
- Should category management eventually move to a dedicated admin page?
- Should analytics remain optional or become part of production?

---

# 2. Usability Review

## Tasks for Reviewers

1. Find information for current students about deadlines
2. Find information for future students about enrollment
3. Search for a topic such as:
   - “fee waiver”
   - “ctcLink”
4. Login as admin and add a new FAQ
5. Test category creation and editing
6. Reorder FAQs using drag-and-drop

---

## Notes

### Strengths

- Homepage is simple and easy to navigate
- FAQ categories are organized clearly
- Search functionality is easy to use
- FAQ answers are readable and scannable
- Responsive layout works well on mobile devices
- Accessibility tools are easy to locate
- Admin dashboard is functional

---

### Areas for Improvement

- Admin workflow could be simplified further
- Some spacing and layout consistency could be improved
- Drag-and-drop behavior could provide clearer visual feedback
- Some pages may benefit from loading states or success indicators
- Search could support typo tolerance in future versions

---

# 3. Code Review

## Strengths

- Good separation of frontend components
- Express middleware is used for authentication
- FAQ CRUD routes are organized clearly
- SQL queries mostly use parameterized statements
- Frontend state management is reasonably organized
- Accessibility labels are implemented in many areas
- Reusable components improved maintainability

---

## Concerns

- Some naming inconsistencies still exist
- Duplicate or unused frontend data files may still exist
- `Admin.jsx` handles a large amount of logic and could be further split into smaller components
- Route naming is not fully RESTful
- Some repeated styling patterns could be centralized
- Additional validation could be added on both frontend and backend

---

# 4. Security Review

## Strengths

- JWT authentication is implemented
- Password hashing uses bcrypt
- Admin routes are protected
- SQL parameters are used in most queries
- Environment variables are used for secrets

---

## Concerns

- JWT is currently stored in localStorage
- No login rate limiting implemented
- Helmet middleware is not currently used
- `rejectUnauthorized: false` weakens SSL verification
- No CSRF protection
- Secrets and `.env` files must never be committed
- Additional input sanitization could be added

---

# 5. Accessibility Review

## Tasks for Reviewers

1. Navigate homepage using keyboard only
2. Use skip link to jump to main content
3. Search FAQs using keyboard only
4. Open FAQ accordions using keyboard
5. Test drag-and-drop accessibility in admin dashboard
6. Test readable font and contrast tools
7. Test translation dropdown

---

## Notes

### Accessibility Features Present

- Skip link implemented
- Focus states implemented
- ARIA labels added in multiple components
- Keyboard navigation works for most areas
- Responsive layouts improve usability
- Accessibility toolbar includes:
  - Read aloud
  - High contrast mode
  - Readable fonts
  - Translation support

---

### Accessibility Concerns

- Drag-and-drop accessibility may still be limited
- Some clickable cards rely on custom interactions
- More screen reader testing is needed
- Accordion announcements could be improved
- Additional WCAG testing is recommended

---

# 6. Planned Improvements

## Short-Term Improvements

- Standardize naming across “future” and “prospective”
- Improve admin UI organization
- Clean duplicate or unused frontend files
- Improve loading and success states
- Improve drag-and-drop accessibility

---

## Future Improvements

- Add automated testing
- Add analytics dashboard
- Improve security hardening
- Add role-based access control
- Improve multilingual support
- Add AI-powered FAQ search
- Improve screen reader support
- Add backend rate limiting
- Add Helmet middleware
- Add refresh-token authentication flow

---

# 7. Reviewer Quick Start

## Setup Instructions

1. Clone repository
2. Setup backend `.env`
3. Run MySQL locally or connect cloud database
4. Import schema from:

```text
backend/sql/faq.sql
```

5. Run seed scripts

```bash
npm run seed:current
npm run seed:future
```

6. Start backend

```bash
npm run dev
```

7. Start frontend

```bash
npm run dev
```

8. Visit:

```text
http://localhost:5173
```

---

## Optional Admin Testing

1. Generate bcrypt password hash
2. Add admin credentials to `.env`
3. Login at:

```text
/admin-login
```

4. Test:
- Add FAQ
- Edit FAQ
- Delete FAQ
- Reorder FAQs
- Add category
- Edit category
- Reorder categories

---

# 8. Overall Summary

The Running Start Digital Support Portal successfully provides a searchable and accessible FAQ experience for current and future students while giving administrators the ability to manage content dynamically.

The project demonstrates:

- Full-stack development
- Database integration
- Authentication
- Accessibility considerations
- Responsive frontend design
- CRUD functionality
- Admin dashboard workflows

Future iterations should focus on:

- Security hardening
- Automated testing
- Accessibility refinement
- Codebase cleanup
- Improved admin usability