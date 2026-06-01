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
- Accessibility toolbar usability
- Mobile accessibility toolbar layout
- Google Translate language selector
- Read aloud functionality
- High contrast mode
- Readable font mode
- Text size controls
- Reduced motion mode

---

# Accessibility Improvements Implemented

## Navigation & Interaction

- Improved keyboard navigation across homepage and FAQ pages
- Updated category selection behavior to better support keyboard users
- Improved homepage student selection cards for accessibility and usability
- Added clearer interaction behavior for FAQ category selection
- Added visible focus indicators for links, buttons, inputs, and interactive elements
- Added route/page announcements for screen reader users when pages change

---

## Accessibility Toolbar

The application includes a dedicated accessibility toolbar that provides:

- Text size controls
- High contrast mode
- Readable font mode
- Reduced motion mode
- Read page aloud functionality
- Google Translate language support
- Reset accessibility settings
- Mobile-friendly responsive layout

The toolbar was improved so it remains usable on smaller screens and does not overflow outside the viewport on mobile devices.

---

## Semantic & Screen Reader Improvements

- Replaced some non-semantic clickable behavior with more accessible interaction patterns
- Improved ARIA labeling in key interactive components
- Maintained visible focus indicators for keyboard users
- Preserved skip link support for screen reader and keyboard navigation
- Added accessible labels for navigation, FAQ actions, and toolbar controls
- Added live status messaging for FAQ search results

---

## Admin Dashboard Improvements

- Added clearer drag-and-drop instructions for administrators
- Improved visibility of reorder functionality
- Maintained accessible button labels for edit and delete actions
- Improved admin form labels and required field behavior
- Added clearer admin login error and success messaging

---

# Remaining Limitations

The following accessibility limitations are still known:

- Drag-and-drop functionality in the admin dashboard is still primarily mouse-based
- Translation support is provided through Google Translate, but translations are machine-generated and may not be fully accurate
- Additional screen reader testing should be completed before long-term production use
- Some advanced accessibility testing tools, such as Axe or Lighthouse audits, have not yet been fully integrated into the development workflow
- Touch-drag support for the accessibility toolbar could be improved in a future version

---

# Manual Accessibility Test Steps

## Homepage Navigation

1. Use `Tab` and `Shift + Tab` to move through homepage elements
2. Verify visible focus indicators appear on interactive components
3. Use the skip link to jump directly to main content
4. Open Current Student FAQs using keyboard only
5. Open Future Student FAQs using keyboard only
6. Open Quick Links using keyboard only

---

## FAQ Interaction

1. Open Current Student and Future Student pages using keyboard only
2. Search for FAQ terms using keyboard input
3. Expand and collapse FAQ accordions using keyboard controls
4. Navigate FAQ links using keyboard only
5. Select categories using keyboard navigation
6. Confirm search result messages update clearly

---

## Accessibility Toolbar Testing

1. Open the accessibility toolbar
2. Increase and decrease text size
3. Enable and disable high contrast mode
4. Enable and disable readable font mode
5. Enable and disable reduced motion mode
6. Test read page aloud functionality
7. Stop read aloud while it is active
8. Test Google Translate language selection
9. Use the reset accessibility settings button
10. Verify the toolbar remains usable on mobile devices
11. Verify the toolbar does not create horizontal scrolling on mobile

---

## Admin Dashboard Testing

1. Navigate admin buttons using keyboard only
2. Verify focus visibility on admin actions
3. Review drag-and-drop instructions for clarity and accessibility
4. Confirm edit and delete actions are reachable without mouse interaction
5. Confirm form fields have clear labels
6. Confirm error and success messages are readable

---

# Mobile Accessibility Testing

The following mobile accessibility checks were completed manually:

- Verified homepage cards stack correctly on smaller screens
- Verified FAQ pages remain readable on mobile
- Verified search bar does not overflow
- Verified accessibility toolbar fits inside the mobile viewport
- Verified toolbar buttons remain large enough for touch interaction
- Verified mobile navigation drawer works correctly
- Verified feedback link is available through the mobile navigation menu

---

# Google Translate Notes

Google Translate is included as a support feature for students who may prefer to view content in another language.

Important notes:

- Translations are machine-generated
- Translations may not be fully accurate
- Students should confirm important academic, deadline, or policy information with the official Running Start office
- Google Translate may behave differently depending on browser settings, extensions, or deployment environment

---

# Future Accessibility Goals

- Improve drag-and-drop keyboard accessibility
- Add touch-drag support for the accessibility toolbar on mobile devices
- Expand multilingual accessibility support
- Improve screen reader announcements
- Continue WCAG 2.1 AA compliance improvements
- Add automated accessibility testing using Lighthouse and Axe
- Improve admin dashboard keyboard reordering options
- Continue testing with real users and assistive technologies

---

# Summary

The Running Start Digital Support Portal includes several accessibility improvements to help students navigate and understand FAQ content more easily.

The project currently supports keyboard navigation, visible focus states, skip link behavior, responsive design, an accessibility toolbar, read aloud functionality, high contrast mode, readable font mode, text size adjustment, reduced motion mode, and Google Translate support.

Accessibility improvements are ongoing, and future maintainers should continue testing and refining the portal to support WCAG 2.1 AA accessibility goals.