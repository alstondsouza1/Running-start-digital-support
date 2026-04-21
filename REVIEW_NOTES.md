# Review Notes – Running Start Digital Support Portal

## 1. Handoff / Documentation Review

### What worked
- Repository structure was clear
- Frontend and backend were separated cleanly
- README included setup steps, environment setup, and testing instructions
- `.env.example` files were provided

### Issues / gaps found
- README originally referenced `sql/schema.sql`, but actual file is `sql/faq.sql`
- Local setup depends on correct MySQL configuration
- Admin password must be generated manually using bcrypt
- Some naming is inconsistent, such as “Future” vs “Prospective”

### Questions raised
- Should reviewers use local MySQL or cloud MySQL?
- Which parts of the frontend data folder are still active versus legacy?

---

## 2. Usability Review

### Tasks for reviewers
1. Find information for current students about deadlines
2. Find information for future students about enrollment
3. Search for a topic like “fee waiver” or “ctcLink”
4. Log in as admin and add a new FAQ

### Notes
- Home page is simple and clear
- Search is easy to use
- FAQ answers are readable and scannable
- Admin workflow is functional but could be simplified

---

## 3. Code Review

### Strengths
- Good component separation in frontend
- Express middleware is used for authentication
- FAQ CRUD routes are organized clearly
- SQL queries mostly use parameterized statements

### Concerns
- Some naming inconsistencies
- Duplicate or older data files appear to still exist in frontend
- `Admin.jsx` contains login logic even though there is a separate `AdminLogin.jsx`
- Route naming is not fully RESTful

---

## 4. Security Review

### Strengths
- JWT auth is implemented
- Password hashing uses bcrypt
- Admin routes are protected
- SQL parameters are used in most places

### Concerns
- JWT is stored in localStorage
- No login rate limiting
- No Helmet middleware
- `rejectUnauthorized: false` weakens SSL verification
- Secrets must never be committed

---

## 5. Accessibility Review

### Tasks for reviewers
1. Navigate homepage using only keyboard
2. Use skip link to jump to content
3. Search FAQs with keyboard only
4. Open FAQ accordions with keyboard
5. Test whether admin drag-and-drop is keyboard accessible

### Notes
- Skip link exists
- Focus states exist
- Some clickable cards use role=button instead of native button/link
- Drag-and-drop accessibility may be limited

---

## 6. Planned Improvements
- Standardize naming across “future” / “prospective”
- Improve security hardening
- Clean unused or duplicate frontend data files
- Add testing in a future iteration

---

# Quick Start for Reviewers

1. Clone repo
2. Setup backend `.env`
3. Run MySQL and import schema
4. Run seed scripts
5. Start backend
6. Start frontend
7. Visit http://localhost:5173

Optional:
- Login as admin to test CRUD functionality