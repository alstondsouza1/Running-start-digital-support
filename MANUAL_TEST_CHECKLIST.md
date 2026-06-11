# Manual Test Checklist

Use this checklist before a demo, submission, or deployment. Mark each item as pass/fail and note the browser/device used.

## Setup Checks

- [ ] Backend `.env` is configured from `backend/.env.example`.
- [ ] Frontend `.env` is configured from `frontend/.env.example`.
- [ ] MySQL database exists and `npm run migrate` passes in `backend`.
- [ ] Seed scripts have been run if default FAQ data is needed.
- [ ] Backend starts without database connection errors.
- [ ] `/api/health` reports `database: "connected"`.
- [ ] Frontend starts and loads without console-breaking errors.

## Public Student Pages

- [ ] Homepage loads and both student cards navigate correctly.
- [ ] Current Student page loads categories and FAQs.
- [ ] Future Student page loads categories and FAQs.
- [ ] Category selection filters FAQs correctly.
- [ ] Search returns relevant FAQ results.
- [ ] Clear Search resets the search results view.
- [ ] Search highlighting is readable.
- [ ] FAQ accordion opens and closes correctly.
- [ ] No-results search state shows contact options.
- [ ] External FAQ links open in a new tab.
- [ ] Need More Help links work for Zoom, email, and phone.
- [ ] Quick Links drawer opens, closes, and external links work.
- [ ] Feedback button opens the Google Form in a new tab.

## Admin Workflow

- [ ] `/admin` redirects unauthenticated users to `/admin-login`.
- [ ] Admin login succeeds with valid credentials.
- [ ] Admin login fails with invalid credentials.
- [ ] Logout clears admin access.
- [ ] Expired or invalid admin token redirects to login with a clear session-expired message.
- [ ] Admin dashboard loads Current and Future FAQs.
- [ ] Admin search filters FAQ cards.
- [ ] Add FAQ works.
- [ ] Edit FAQ works.
- [ ] Hide FAQ removes it from student pages without deleting it.
- [ ] Publish FAQ makes it visible on student pages again.
- [ ] Delete FAQ asks for confirmation and removes the FAQ.
- [ ] FAQ reorder saves and remains after refresh.
- [ ] FAQ preview displays the student-facing answer before saving.
- [ ] Add category works.
- [ ] Edit category works.
- [ ] Duplicate category names are rejected.
- [ ] Delete category is blocked when FAQs still exist in that category.
- [ ] Category reorder saves and remains after refresh.

## Accessibility Toolbar

- [ ] Accessibility toolbar opens and closes.
- [ ] Toolbar can be dragged with a mouse on desktop.
- [ ] Toolbar can be dragged with touch on mobile.
- [ ] Toolbar remains inside the viewport after dragging.
- [ ] Toolbar header/drag handle gives clear move instructions.
- [ ] Toolbar header moves with arrow keys and resets with Home.
- [ ] Text size decrease/increase changes readable page text.
- [ ] Readable font mode changes page typography.
- [ ] High contrast mode changes all major pages to black/white/yellow.
- [ ] Reduced motion mode disables major animations/transitions.
- [ ] Read Page Aloud starts and stops speech synthesis where supported.
- [ ] Reset Accessibility Settings clears toolbar settings.
- [ ] Google Translate dropdown appears when the script loads.
- [ ] Back to Original Language resets translation state.

## Mobile And Responsive

- [ ] Homepage is usable at 320px wide.
- [ ] Navigation switches to the mobile drawer on small screens.
- [ ] Mobile drawer links work and close after selection.
- [ ] Student cards, categories, accordions, and help cards do not overflow.
- [ ] Admin forms remain usable on mobile.
- [ ] Accessibility toolbar does not create horizontal scrolling.

## Keyboard And Screen Reader Basics

- [ ] Skip link appears on keyboard focus and jumps to main content.
- [ ] Main navigation can be used with keyboard only.
- [ ] FAQ categories can be selected with keyboard only.
- [ ] Accordion controls can be expanded/collapsed with keyboard only.
- [ ] Admin forms have visible labels and focus states.
- [ ] Admin FAQ and category Move up/Move down buttons work with Enter or Space.
- [ ] Status/error messages are visible and understandable.
- [ ] Lighthouse accessibility scores are recorded in `ACCESSIBILITY_AUDIT_GUIDE.md`.
- [ ] Screen reader smoke-test notes are recorded in `ACCESSIBILITY_AUDIT_GUIDE.md`.

## Final Verification

- [ ] `npm run lint` passes in `frontend`.
- [ ] `npm test` passes in `frontend`.
- [ ] `npm run build` passes in `frontend`.
- [ ] `npm run test:e2e` passes in `frontend`.
- [ ] `npm test` passes in `backend`.
- [ ] `node --check app.js` passes from the `backend` directory.
- [ ] `node --check controllers/adminController.js` passes from the `backend` directory.
- [ ] `node --check migrations/index.js` passes from the `backend` directory.
- [ ] `npm audit --omit=dev` reports no vulnerabilities in both projects.
