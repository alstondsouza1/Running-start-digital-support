# Submission Evidence Checklist

Use this file as the single checklist for class submission, demo, and client
handoff evidence. Final screenshots are stored in `screenshots/`.

## Captured Screenshots

- [x] `screenshots/01-home-desktop.png` - homepage desktop view.
- [x] `screenshots/02-home-mobile.png` - homepage mobile view.
- [x] `screenshots/03-current-faq-high-contrast.png` - Current Student FAQ
  categories with the accessibility toolbar open and high contrast enabled.
- [x] `screenshots/04-future-faq-search.png` - Future Student FAQ search with
  highlighted results.
- [x] `screenshots/05-accessibility-toolbar-mobile-moved.png` - mobile homepage
  with the accessibility toolbar moved.
- [x] `screenshots/06-accessibility-statement.png` - accessibility statement.
- [x] `screenshots/07-admin-dashboard.png` - authenticated admin FAQ management
  dashboard.
- [x] `screenshots/08-admin-form-error-focus.png` - incomplete Add FAQ form with
  the focused validation error.

## Optional Additional Evidence

Capture these only if the assignment or client specifically requires them:

- [ ] Open FAQ accordion showing answer bullets and links.
- [ ] Quick Links drawer.
- [ ] Need More Help contact section.
- [ ] Admin login page.
- [ ] Category management and Add/Edit Category form.
- [ ] Successful admin action message, such as FAQ added or order updated.

## Recommended Short Demo Flow

1. Open the homepage and explain the purpose of the portal.
2. Navigate to Current Student FAQs.
3. Select a category and open a question.
4. Search for a keyword and show highlighted results.
5. Open the accessibility toolbar and enable high contrast mode.
6. Resize to mobile or use a mobile viewport and move the toolbar.
7. Open Quick Links and Need More Help resources.
8. Log in as admin.
9. Add or edit one FAQ.
10. Reorder one FAQ or category.
11. Log out and confirm protected admin access is removed.

## Verification Evidence

```bash
cd frontend
npm run lint
npm run build
```

```bash
cd backend
npm test
node --check app.js
node --check controllers/adminController.js
```

- [x] Frontend lint passed.
- [x] Frontend production build passed.
- [x] Backend tests passed.
- [x] Backend syntax checks passed.

## Deployment Evidence

- [ ] Frontend production URL.
- [ ] Backend production URL.
- [ ] Production `/api/health` returns `ok: true`, `api: "running"`, and
  `database: "connected"`.
- [ ] Database provider and database name, without passwords or secrets.
- [ ] Screenshot of required production environment variables, with secret values hidden.
- [ ] Confirmation that `VITE_API_BASE` points to the deployed backend `/api` URL.
- [ ] Confirmation that backend `CORS_ORIGINS` includes the deployed frontend URL.

## Handoff Notes

- Do not include real `.env` files, database passwords, JWT secrets, or admin password hashes in screenshots or shared documents.
- Keep one known working admin account available for the instructor/client demo.
- If Google Translate or Google Analytics does not load, check browser extensions, network blockers, and `VITE_GOOGLE_ID`.
