# Accessibility Notes

## Accessibility Areas Reviewed

The following accessibility features and interactions were manually reviewed:

- Keyboard navigation on the homepage
- Keyboard navigation for category selection
- FAQ search field usability
- FAQ accordion interaction
- Visible keyboard focus states
- Skip link behavior
- Admin dashboard instructions for drag-and-drop interactions

---

# Accessibility Improvements Implemented

## Navigation & Interaction

- Improved keyboard navigation across homepage and FAQ pages
- Updated category selection behavior to better support keyboard users
- Improved homepage student selection cards for accessibility and usability
- Added clearer interaction behavior for FAQ category selection

---

## Semantic & Screen Reader Improvements

- Replaced some non-semantic clickable behavior with more accessible interaction patterns
- Improved ARIA labeling in key interactive components
- Maintained visible focus indicators for keyboard users
- Preserved skip link support for screen reader and keyboard navigation

---

## Admin Dashboard Improvements

- Added clearer drag-and-drop instructions for administrators
- Improved visibility of reorder functionality
- Maintained accessible button labels for edit and delete actions

---

# Remaining Limitations

The following accessibility limitations are still known:

- Drag-and-drop functionality in the admin dashboard is still primarily mouse-based
- Full multilingual accessibility support is not fully implemented yet
- Additional screen reader testing should be completed before production launch
- Some advanced accessibility testing tools (such as Axe or Lighthouse audits) have not yet been fully integrated into the development workflow

---

# Manual Accessibility Test Steps

## Homepage Navigation

1. Use `Tab` and `Shift + Tab` to move through homepage elements
2. Verify visible focus indicators appear on interactive components
3. Use the skip link to jump directly to main content

---

## FAQ Interaction

1. Open Current Student and Future Student pages using keyboard only
2. Search for FAQ terms using keyboard input
3. Expand and collapse FAQ accordions using keyboard controls
4. Navigate FAQ links using keyboard only

---

## Admin Dashboard Testing

1. Navigate admin buttons using keyboard only
2. Verify focus visibility on admin actions
3. Review drag-and-drop instructions for clarity and accessibility
4. Confirm edit and delete actions are reachable without mouse interaction

---

# Future Accessibility Goals

- Improve drag-and-drop keyboard accessibility
- Expand multilingual accessibility support
- Improve screen reader announcements
- Continue WCAG 2.1 AA compliance improvements
- Add automated accessibility auditing tools