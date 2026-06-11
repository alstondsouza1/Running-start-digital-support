# Secure Authentication Migration Plan

The current admin flow stores a short-lived JWT in browser `localStorage`. That
is acceptable for this capstone deployment, but an HttpOnly cookie is a better
choice if the portal becomes a maintained production service because frontend
JavaScript cannot read an HttpOnly cookie.

This change should be deployed as one coordinated backend and frontend release.

## Required Backend Changes

1. Return the JWT in a cookie with `HttpOnly`, `Secure`, and an appropriate
   `SameSite` value.
2. Add an explicit logout endpoint that clears the cookie.
3. Read authentication from the cookie in protected middleware.
4. Restrict CORS to the production frontend origin and enable credentials.
5. Add CSRF protection if cross-site cookies or state-changing requests require
   it.
6. Keep login rate limiting and rotate the JWT secret before production launch.

## Required Frontend Changes

1. Stop writing tokens to `localStorage`.
2. Send API requests with `credentials: "include"`.
3. Determine session state through a protected session endpoint rather than
   decoding a browser-stored token.
4. Call the logout endpoint and clear client session state.
5. Handle expired sessions by returning users to the admin login page.

## Deployment Requirements

- Use HTTPS for both Vercel and Render.
- Confirm the cookie domain and `SameSite` setting work across the deployed
  frontend and backend domains.
- Update `CORS_ORIGINS` to the exact frontend URL.
- Test login, refresh, logout, expiration, and unauthorized requests in the
  deployed environment.
- Keep the current bearer-token flow until the complete cookie flow is tested;
  do not deploy a half-completed migration.
