## Deployment Overview
The Running Start Digital Support Portal is a full-stack web application composed of three main components:

- Frontend: React (Vite) application for the user interface  
- Backend: Node.js and Express API for handling requests and business logic  
- Database: MySQL (hosted on Aiven) for storing FAQ content and related data  

### System Flow
1. The frontend is deployed on Vercel and serves the user interface  
2. The frontend communicates with the backend via REST API requests  
3. The backend processes requests and interacts with the database  
4. The database stores FAQ content, categories, and admin-managed data  

This architecture allows the system to remain modular, maintainable, and scalable.

---

## Hosting / Platform Summary
The application is deployed using the following platforms:

- Frontend Hosting: Vercel  
  - Hosts the React application  
  - Provides CDN and HTTPS support  

- Backend Hosting: Render  
  - Hosts the Node.js + Express API  
  - Handles application logic and authentication  

- Database Hosting: Aiven (MySQL)  
  - Stores FAQ data and content  
  - Provides managed cloud database services  

### Recommended Setup
- Aiven → Database  
- Render → Backend  
- Vercel → Frontend  

This setup offers a balance of reliability, performance, and ease of deployment.

---

## Monthly Cost Estimate
Estimated monthly costs based on current recommendations:

| Service | Estimated Cost |
|--------|--------------|
| Aiven MySQL (Developer Plan) | ~$5/month |
| Render Backend (Starter Plan) | ~$7/month |
| Vercel Frontend (Pro Plan) | ~$20/month |

Estimated Total: ~$32/month  

Projected Range: ~$40–$50/month depending on usage, traffic, and future features such as analytics.

Notes:
- Free tiers may be used during development  
- Costs may increase with higher usage or scaling  

---

## Data Collection & Privacy Statement
This application is designed to respect student privacy:

- No student accounts or logins are required  
- No personally identifiable information (PII) is collected or stored  
- FAQ browsing is anonymous  
- Only administrators authenticate through secure login  

### Security Practices
- JWT-based authentication for admin access  
- Password hashing using bcrypt  
- Environment variables used for sensitive credentials  

### Future Considerations
- Optional analytics (e.g., FAQ clicks) may be added  
- Any analytics will avoid collecting personal data  
- Focus will remain on general usage insights only  

---

## Launch Checklist
Before deploying to production, ensure the following:

- Frontend deployed on Vercel  
- Backend deployed on Render  
- Database provisioned and connected (Aiven MySQL)  
- Environment variables configured correctly  
- HTTPS enabled across all services  
- CORS configured properly  
- Admin credentials secured  
- FAQ content reviewed and approved  
- Accessibility checks completed (WCAG 2.1 AA recommended)  
- “Need more help?” or next-step support option included  
- All external links and resources verified  

---

## Maintenance & Ownership Summary

### Ownership
This project is a capstone collaboration between student developers and the Running Start Department at Green River College.

- Student Development Team (through June 2026):
  - Feature development and improvements  
  - Bug fixes and deployment support  

- Running Start Department (post-graduation):
  - Managing FAQ content through the admin dashboard  
  - Keeping information accurate and up to date  

- Future Support:
  - Potential involvement from the Green River web or internship team  

### Ongoing Maintenance Tasks
- Update FAQ content regularly  
- Monitor backend uptime and logs  
- Maintain database backups  
- Update dependencies (npm packages)  
- Rotate secrets and credentials as needed  
- Continue improving accessibility  

### Change Management
To support long-term sustainability:

- Define clear ownership responsibilities  
- Establish a process for reviewing and approving updates  
- Maintain deployment and setup documentation  
- Provide onboarding guidance for future maintainers  
