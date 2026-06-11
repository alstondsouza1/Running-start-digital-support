import { track } from "@vercel/analytics";

/**
 * Centralized analytics for the Running Start Digital Portal.
 *
 * Every meaningful, business-important user action funnels through one of the
 * named helpers below. Components import these helpers rather than calling
 * `track()` directly so event names and properties stay consistent, and so we
 * only ever instrument actions that matter (not every button or component).
 *
 * Vercel Analytics is the primary destination via `track()`. The legacy
 * Google Analytics (gtag) events are preserved where they already existed.
 */

// --- low-level wrappers -----------------------------------------------------

// Vercel Analytics custom event. Wrapped so analytics can never break the UI.
function vercelTrack(eventName, properties) {
  if (typeof window === "undefined") return;
  try {
    track(eventName, properties);
  } catch {
    // Tracking is best-effort; never surface analytics failures to users.
  }
}

// Google Analytics (gtag) event, only when GA is present on the page.
function gtagEvent(eventName, params) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

// --- navigation & pages -----------------------------------------------------

// Page visits (also distinguishes Current / Future student & Admin pages by name).
export function trackPageVisit({ page, path }) {
  vercelTrack("Page Visit", { page, path });
  gtagEvent("page_visit", { page, path });
}

// Primary/mobile navigation menu clicks.
export function trackNavClick({ label, destination }) {
  const dest = destination || "action";
  vercelTrack("Navigation Click", { label, destination: dest });
  gtagEvent("navigation_click", { label, destination: dest });
}

// --- FAQ --------------------------------------------------------------------

// FAQ search queries.
export function trackFaqSearch({ searchTerm, resultCount, audience = "" }) {
  vercelTrack("FAQ Search", {
    query: searchTerm,
    results: resultCount,
    audience,
  });
  gtagEvent("faq_search", {
    search_term: searchTerm,
    result_count: resultCount,
  });
}

// An FAQ question being opened/expanded.
export function trackQuestionClick({
  question,
  categoryId,
  categoryName,
  audience = "",
  source,
}) {
  vercelTrack("FAQ Opened", {
    question,
    category: categoryName || "Unknown category",
    category_id: categoryId,
    audience,
    source,
  });
  gtagEvent("question_click", {
    question_text: question,
    category_id: categoryId,
    category_name: categoryName,
    audience,
    source,
  });
}

// Selecting an FAQ category.
export function trackCategoryClick({ categoryId, categoryName, audience = "" }) {
  vercelTrack("Category Selected", {
    category: categoryName,
    category_id: categoryId,
    audience,
  });
  gtagEvent("category_click", {
    category_id: categoryId,
    category_name: categoryName,
    audience,
  });
}

// --- support / contact ------------------------------------------------------

// Support/help button clicks (Zoom lobby, email, phone).
export function trackSupportClick({ type }) {
  vercelTrack("Support Contact Clicked", { type });
  gtagEvent("support_contact_clicked", { type });
}

// Opening the external feedback / contact form.
export function trackFeedbackOpen({ location = "" } = {}) {
  vercelTrack("Feedback Form Opened", { location });
  gtagEvent("feedback_form_opened", { location });
}

// --- auth -------------------------------------------------------------------

// Admin login attempt (fired once credentials are submitted; no PII captured).
export function trackLoginAttempt() {
  vercelTrack("Login Attempt");
  gtagEvent("login_attempt");
}

// Successful admin login.
export function trackLoginSuccess() {
  vercelTrack("Login Success");
  gtagEvent("login_success");
}

// Admin logout.
export function trackLogout() {
  vercelTrack("Logout");
  gtagEvent("logout");
}

// --- forms & admin ----------------------------------------------------------

// Successful admin form submissions (add/edit FAQ or category).
export function trackFormSubmit({ form, mode = "create", audience = "" }) {
  vercelTrack("Form Submitted", { form, mode, audience });
  gtagEvent("form_submitted", { form, mode, audience });
}

// Reaching the protected Admin dashboard.
export function trackAdminAccess() {
  vercelTrack("Admin Page Access");
  gtagEvent("admin_page_access");
}

// --- external links ---------------------------------------------------------

// Clicks on outbound resource links (Quick Links panel, etc.).
export function trackExternalLink({ label, url, location = "" }) {
  vercelTrack("External Link Clicked", { label, url, location });
  gtagEvent("external_link_clicked", { label, url, location });
}
