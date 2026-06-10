# Accessibility Audit Guide

Use this guide to record repeatable accessibility checks before demo, submission, or deployment.

## Automated Browser Audit

Run a Lighthouse accessibility audit in Chrome:

1. Start the backend and frontend locally.
2. Open the page in Chrome.
3. Open DevTools.
4. Go to the Lighthouse tab.
5. Select Accessibility.
6. Run the audit for desktop.
7. Repeat for a mobile viewport.

Record the score, date, browser version, and any warnings in this file or in the submission notes.

Recommended pages:

- `/`
- `/current-student`
- `/future-student`
- `/admin-login`
- `/admin`

Record results:

| Page | Desktop Score | Mobile Score | Issues Found | Fixed? |
|---|---:|---:|---|---|
| `/` |  |  |  |  |
| `/current-student` |  |  |  |  |
| `/future-student` |  |  |  |  |
| `/admin-login` |  |  |  |  |
| `/admin` |  |  |  |  |

If Chrome Lighthouse is unavailable, document that limitation and complete the manual checks below.

## Manual Keyboard Audit

- [ ] Use `Tab` from the top of the page.
- [ ] Confirm the skip link appears and moves focus to main content.
- [ ] Confirm focus indicators are visible.
- [ ] Confirm navigation links can be reached and activated.
- [ ] Confirm FAQ categories can be selected with keyboard only.
- [ ] Confirm accordions can be opened and closed with keyboard only.
- [ ] Confirm search can be typed, cleared, and announces result count.
- [ ] Confirm no-results contact buttons can be reached by keyboard.
- [ ] Confirm form fields and buttons are reachable in admin forms.
- [ ] Confirm modal/drawer controls can be closed with keyboard only.
- [ ] Confirm FAQ Hide/Publish buttons can be reached and activated by keyboard.

## Manual Screen Reader Smoke Test

Use VoiceOver on macOS or Narrator on Windows.

- [ ] Page title is announced after route changes.
- [ ] Main page heading is announced.
- [ ] Navigation has meaningful link names.
- [ ] Search result count/status is announced.
- [ ] FAQ accordion buttons announce expanded/collapsed state.
- [ ] No-results contact options are announced as links or buttons.
- [ ] Admin form labels are announced.
- [ ] Error and success messages are understandable.
- [ ] Accessibility toolbar controls have understandable names.

## Accessibility Toolbar Checks

- [ ] High contrast mode works on homepage.
- [ ] High contrast mode works on FAQ pages.
- [ ] High contrast mode works on admin login and dashboard.
- [ ] Text size controls affect readable page text without layout breakage.
- [ ] Readable font mode keeps text legible.
- [ ] Reduced motion mode disables major transitions.
- [ ] Read aloud starts and stops in supported browsers.
- [ ] Mobile toolbar can be moved and remains inside the viewport.
- [ ] Toolbar drag handle/header has understandable instructions.
- [ ] Toolbar header can be focused and moved with arrow keys.
- [ ] `Shift` plus arrow keys moves the toolbar faster.
- [ ] `Home` resets the toolbar position.

## Mobile Audit

Use Chrome device toolbar or a real phone.

- [ ] Test at 320px width.
- [ ] Confirm no horizontal scrolling appears.
- [ ] Confirm navigation drawer opens, closes, and links work.
- [ ] Confirm FAQ search and accordions are usable by touch.
- [ ] Confirm admin forms do not overflow.
- [ ] Confirm accessibility toolbar opens, moves, and stays in the viewport.
- [ ] Confirm high contrast mode is readable on mobile.

## Known External Dependencies

- Google Translate depends on Google's hosted script and may be blocked by browser privacy tools.
- Google Analytics depends on `VITE_GOOGLE_ID` and may be blocked by privacy tools.
- Browser speech synthesis support varies by browser and operating system.
