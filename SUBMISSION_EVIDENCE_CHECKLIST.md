# Submission Evidence Checklist

Use this file to collect screenshots and short notes for a class submission, demo, or client handoff.

## Recommended Screenshots

- [ ] Homepage desktop view.
- [ ] Homepage mobile view.
- [ ] Current Student FAQ page with categories visible.
- [ ] Future Student FAQ page with categories visible.
- [ ] FAQ search results with highlighted terms.
- [ ] Open FAQ accordion showing answer bullets and links.
- [ ] Quick Links drawer.
- [ ] Need More Help contact section.
- [ ] Accessibility toolbar closed.
- [ ] Accessibility toolbar open.
- [ ] High contrast mode on a student FAQ page.
- [ ] Mobile view with the accessibility toolbar moved.
- [ ] Admin login page.
- [ ] Admin dashboard FAQ management view.
- [ ] Add/Edit FAQ form.
- [ ] Category management view.
- [ ] Add/Edit category form.
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

Record the date and result for each command.

```bash
cd frontend
npm run lint
npm run build
```

```bash
cd backend
npm test
node --check backend/app.js
node --check backend/controllers/adminController.js
```

## Deployment Evidence

- [ ] Frontend production URL.
- [ ] Backend production URL or health endpoint.
- [ ] `/api/health` returns `ok: true` and `database: "connected"`.
- [ ] Database provider and database name, without passwords or secrets.
- [ ] Screenshot of required production environment variables, with secret values hidden.
- [ ] Confirmation that `VITE_API_BASE` points to the deployed backend `/api` URL.
- [ ] Confirmation that backend `CORS_ORIGINS` includes the deployed frontend URL.

## Handoff Notes

- Do not include real `.env` files, database passwords, JWT secrets, or admin password hashes in screenshots or shared documents.
- Keep one known working admin account available for the instructor/client demo.
- If Google Translate or Google Analytics does not load, check browser extensions, network blockers, and `VITE_GOOGLE_ID`.
