<div align="center">
  
# 🚀 Startup CRM Lite

**A blazing-fast, lightweight Customer Relationship Management (CRM) platform designed specifically for startups, freelancers, and small agencies.**

[![React](https://img.shields.io/badge/React-19-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Problem Statement & Vision](#problem-statement--vision)
3. [Key Features](#key-features)
4. [Screenshots](#screenshots)
5. [Complete System Architecture](#complete-system-architecture)
6. [Technology Stack](#technology-stack)
7. [Project Structure](#project-structure)
8. [Database Architecture](#database-architecture)
9. [API Overview](#api-overview)
10. [Authentication & Authorization](#authentication--authorization)
11. [Development & Installation Guide](#development--installation-guide)
12. [Environment Configuration](#environment-configuration)
13. [Deployment Guide](#deployment-guide)
14. [Security & Performance](#security--performance)
15. [Contribution Guidelines](#contribution-guidelines)
16. [Roadmap & Future Features](#roadmap--future-features)
17. [License & Contact](#license--contact)

---

## 📖 Project Overview

**Startup CRM Lite** is a full-stack MERN (MongoDB, Express, React, Node.js) application tailored for small-scale operations that need to track leads, manage sales pipelines, and analyze conversion data without the overwhelming complexity of enterprise CRMs like Salesforce or HubSpot. 

Built with modern React 19, Tailwind CSS 4, and a secure Express backend, it provides a seamless, beautiful, and highly responsive user experience across both light and dark modes.

---

## 🎯 Problem Statement & Vision

**Problem Statement:** 
Standard enterprise CRMs are bloated, expensive, and require significant onboarding time. Freelancers and early-stage startups often resort to using messy spreadsheets because traditional CRM software slows them down.

**Vision & Objectives:**
To build the fastest, most intuitive CRM on the market. Startup CRM Lite focuses entirely on what matters most: **Lead capture, pipeline tracking, and revenue forecasting.** It is designed to get out of the user's way, allowing them to manage their sales process with zero friction.

### 👥 Target Users & Use Cases
- **Freelancers:** Tracking incoming project inquiries and converting them to paid gigs.
- **Boutique Agencies:** Managing client proposals, meeting schedules, and pipeline stages.
- **Early-Stage Startups:** Organizing outbound cold-email leads and tracking conversion rates by source.

### 💰 Business Value
- **Zero Onboarding:** Simple UI means new hires can start using it in 30 seconds.
- **Cost-Efficient:** Open-source architecture allows for cheap self-hosting.
- **Data-Driven:** Instant analytics dashboard visualizes revenue blocks and lead quality.

---

## ✨ Key Features

- **Lead Management:** Create, read, update, and manage leads with detailed notes.
- **Pipeline Tracking:** Organize leads by status (New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost).
- **Advanced Analytics:** Visual representations of pipeline health, lead sources, and forecasted revenue using Recharts.
- **Secure Authentication:** JWT-based stateless authentication with Bcrypt password hashing.
- **Responsive Design:** Mobile-first architecture using Tailwind CSS 4.
- **Dark/Light Mode:** First-class system-aware theming.
- **Security-First Backend:** Integrated rate-limiting, NoSQL injection sanitization, and Helmet headers.

---

## 📸 Screenshots

*(Replace these placeholders with actual project screenshots)*

| Dashboard Overview | Lead Management |
| :---: | :---: |
| ![Dashboard Placeholder](https://via.placeholder.com/600x400?text=Analytics+Dashboard) | ![Leads Placeholder](https://via.placeholder.com/600x400?text=Lead+Table+View) |

---

## 🏗️ Complete System Architecture

### High-Level Architecture Overview
Startup CRM Lite utilizes a standard **Client-Server Architecture**.
1. **Presentation Layer (Frontend):** A Single Page Application (SPA) built with React and Vite. It handles routing locally and maintains global state using React Context.
2. **Application Layer (Backend):** A Node.js/Express REST API that acts as the gateway for all data transactions. It handles authentication, validation, and business logic.
3. **Data Layer (Database):** MongoDB Atlas stores unstructured documents (Users, Leads).

### Application Workflow (End-to-End User Flow)
1. User navigates to the app. If unauthenticated, they are redirected to `/login`.
2. User registers or logs in. The backend verifies credentials via Bcrypt and issues a JWT token.
3. The React app stores the JWT in `localStorage` and loads the user into the `AuthContext`.
4. The user views the Dashboard (`/`). The frontend makes authenticated `GET` requests (via Axios interceptors) to fetch lead analytics.
5. User navigates to `/leads` to add a new lead. A `POST` request is sent to the backend.
6. The backend validates the payload, sanitizes it, saves it to MongoDB, and returns the newly created lead.

---

## 💻 Technology Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS 4
- **Routing:** React Router v7
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & Bcryptjs
- **Security:** Helmet, Express-Rate-Limit, Express-Mongo-Sanitize
- **Validation:** Express-Validator

---

## 📂 Project Structure

```text
startup-crm-lite/
├── backend/                  # Express API Server
│   ├── config/               # Database and environment configurations
│   ├── controllers/          # Business logic (authController, leadController)
│   ├── middleware/           # Custom middleware (auth, validate, errorHandler)
│   ├── models/               # Mongoose schemas (User, Lead)
│   ├── routes/               # Express route definitions
│   ├── seed.js               # Database seeding utility
│   └── server.js             # API entry point & configuration
├── src/                      # React Frontend App
│   ├── assets/               # Static assets (images, icons)
│   ├── components/           # Reusable UI components
│   │   ├── analytics/        # Chart and metric components
│   │   ├── common/           # Shared components (Search, Filter, Empty States)
│   │   ├── dashboard/        # Dashboard-specific layout components
│   │   └── leads/            # Lead management components (Forms, Tables)
│   ├── constants/            # Application constants (Enums, static data)
│   ├── context/              # React Context providers (AuthContext)
│   ├── data/                 # Mock data (if any)
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Top-level route components (Dashboard, Login, etc.)
│   ├── routes/               # Frontend route definitions
│   ├── services/             # API abstraction layer (Axios configurations)
│   ├── utils/                # Helper functions (date formatting, calculation)
│   ├── App.jsx               # Root React component
│   ├── main.jsx              # Vite entry point
│   └── index.css             # Global CSS and Tailwind directives
├── .env                      # Frontend Environment Variables
├── eslint.config.js          # ESLint configuration
├── package.json              # Frontend dependencies and scripts
└── vite.config.js            # Vite bundler configuration
```

### Explanation of Important Files
- `backend/server.js`: The core HTTP server setup. Integrates all security middleware, connects to MongoDB, and mounts the API routes.
- `backend/models/Lead.js`: Defines the schema for a CRM Lead. It includes compound indexes optimized for filtering by owner, status, and creation date.
- `src/services/api.js`: The central Axios instance. Includes interceptors that automatically inject the JWT token into headers and handle global 401 Unauthorized errors to automatically log users out.
- `src/context/AuthContext.jsx`: Manages global authentication state across the React tree. Exposes `login`, `register`, and `logout` functions.

---

## 🗄️ Database Architecture

The application uses MongoDB to handle data. 

**Models:**
1. **User Model:** 
   - Stores `name`, `email`, `password` (hashed), `role`, and `isActive`.
   - Utilizes a `pre('save')` Mongoose hook to automatically hash passwords before saving.
2. **Lead Model:**
   - Stores lead details: `name`, `company`, `email`, `phone`, `status` (Enum), `source` (Enum), `notes`, `value`.
   - Linked to the User model via an `owner` reference (`mongoose.Schema.Types.ObjectId`).
   - Uses a virtual `age` field to dynamically calculate how long the lead has been in the system.

---

## 🔌 API Overview

All API endpoints are prefixed with `/api`.

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Authenticate and retrieve JWT | ❌ |
| `GET` | `/profile` | Get current user's profile | 🔒 |
| `PUT` | `/profile` | Update current user's profile | 🔒 |

### Lead Routes (`/api/leads`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | Get all leads for the authenticated user | 🔒 |
| `POST` | `/` | Create a new lead | 🔒 |
| `GET` | `/:id` | Get a specific lead by ID | 🔒 |
| `PUT` | `/:id` | Update a specific lead | 🔒 |
| `DELETE` | `/:id` | Delete a specific lead | 🔒 |
| `GET` | `/analytics/summary` | Get aggregated pipeline analytics | 🔒 |

---

## 🔐 Authentication & Authorization

- **Stateless Authentication:** The backend does not use sessions. It validates the user and issues a signed JSON Web Token (JWT).
- **Token Storage:** The frontend stores the JWT in `localStorage`.
- **Route Protection (Backend):** The `protect` middleware extracts the Bearer token from the `Authorization` header, verifies the signature, and attaches the `User` object to the `req` object for downstream controllers.
- **Route Protection (Frontend):** React Router configuration checks the `AuthContext` to prevent unauthenticated users from accessing dashboard pages.

---

## 🛠️ Development & Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas Account (or local MongoDB instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/startup-crm-lite.git
   cd startup-crm-lite
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

### 🌍 Environment Configuration

You will need two `.env` files (one in the root, one in the backend directory).

**1. Root Directory (`/startup-crm-lite/.env`)**
Used by Vite to configure the React application.
```env
# Point this to your backend server URL
VITE_API_URL=http://localhost:5000
```

**2. Backend Directory (`/startup-crm-lite/backend/.env`)**
Used by Express to configure the server.
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/startup-crm-lite?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Running the Project

### Development Mode

Open two terminal instances.

**Terminal 1 (Backend Server):**
```bash
cd backend
npm run dev
# Starts the Express server on port 5000 using nodemon
```

**Terminal 2 (Frontend App):**
```bash
# In the root directory
npm run dev
# Starts the Vite development server on port 5173
```

### Production Build

To build the frontend for production:
```bash
npm run build
```
This generates a highly optimized static bundle in the `/dist` folder.

---

## ☁️ Deployment Guide

### Backend Deployment (Railway, Render, or Heroku)
1. Push the repository to GitHub.
2. Link the repository to your hosting provider.
3. Set the root directory of the backend service to `/backend`.
4. Add all environment variables from `backend/.env` to the hosting provider's configuration panel.
5. Deploy the application.

### Frontend Deployment (Vercel, Netlify, or Railway)
1. Link the repository to Vercel/Railway.
2. Set the build command to `npm run build` and output directory to `dist`.
3. Add the `VITE_API_URL` environment variable pointing to your deployed backend.
4. Deploy the application. The `vercel.json` file is already included to handle SPA routing rules.

---

## 🛡️ Security & Performance

**Security Configurations:**
- **Helmet.js:** Secures Express apps by setting various HTTP headers (XSS protection, MIME sniffing prevention).
- **Express-Rate-Limit:** Prevents brute-force and DDoS attacks by limiting IP request frequency.
- **Express-Mongo-Sanitize:** Prevents NoSQL injection attacks by stripping prohibited characters from user inputs.
- **CORS:** Strictly configured to only allow requests from specific authorized frontend domains.

**Performance Optimizations:**
- **MongoDB Indexes:** Compound indexes are applied on `owner + status` and `owner + createdAt` to ensure analytic aggregations and lead lookups execute in sub-milliseconds.
- **Vite Bundling:** Utilizing Vite ensures lightning-fast HMR in development and tiny, tree-shaken payload sizes in production.

---

## 🤝 Contribution Guidelines

We welcome community contributions! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

**Coding Standards:**
- We strictly adhere to ESLint and Prettier rules. Run `npm run lint` before committing.
- Follow Semantic Versioning for releases.

---

## 🔮 Roadmap & Future Features

- [ ] **Email Integration:** Connect with Gmail/Outlook APIs to send emails directly from the lead view.
- [ ] **Kanban Board:** A drag-and-drop Trello-style board for visual pipeline management.
- [ ] **CSV Import/Export:** Easily migrate leads in and out of the CRM.
- [ ] **Team Collaboration:** Multi-tenant architecture allowing agencies to invite users into isolated workspaces.

---

## ❓ Frequently Asked Questions (FAQ)

**Q: Why am I getting a "Cannot connect to server" error on login?**
A: Ensure your `VITE_API_URL` in the frontend `.env` file is pointing to the correct backend API URL, and ensure the backend is running.

**Q: Is the data encrypted?**
A: All passwords are one-way hashed using Bcrypt. Database traffic is encrypted over TLS via MongoDB Atlas.

---

## 📄 License & Contact

Distributed under the **MIT License**. See `LICENSE` for more information.

**Project maintainer:** 
If you have any questions, feel free to open an issue in the repository!

---
*Generated by the Principal README Documentation Architect.*
