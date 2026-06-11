# Running Start Portal Frontend

This folder contains the React/Vite frontend for the Running Start Digital Support Portal.

## Requirements

- Node.js
- npm
- Backend API running locally or deployed

## Environment Variables

Create `frontend/.env` from `frontend/.env.example`.

```env
VITE_API_BASE=http://localhost:5001/api
VITE_GOOGLE_ID=G-XXXXXXXXXX
```

`VITE_API_BASE` is required in production and must point to the backend `/api` URL.

`VITE_GOOGLE_ID` is optional. When present, `frontend/index.html` loads Google Analytics.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm test
npx playwright install chromium
npm run test:e2e
```

## Local Development

Start the backend first, then run:

```bash
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

## Important Frontend Areas

- `src/pages` contains route-level pages.
- `src/components` contains shared UI and admin components.
- `src/components/AccessibilityBar.jsx` contains accessibility and translation controls.
- `src/context` contains admin authentication state.
- `src/utils/api.js` centralizes backend API URL handling.
- `src/index.css` contains global accessibility and high contrast styles.

## Pre-Handoff Checks

Run these before sharing or deploying frontend changes:

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

The end-to-end suite includes automated Axe checks for key public pages.
