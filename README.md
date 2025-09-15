# RESUME – Rendition of Skills for Un-Matched Earnings

## 🌐 Live Site
[https://resume-8b0ef.web.app](https://resume-8b0ef.web.app)

---

## 📖 Overview
**RESUME** (Rendition of Skills for Un-Matched Earnings) is a modern full-stack web application for **creating, managing, and optimizing resumes**.

### Key Features
- **Experience-level templates** – beginner, mid-career, and professional layouts
- **Built-in ATS (Applicant Tracking System) scoring** to improve recruiter compatibility
- **Professional PDF export** with template-aware formatting
- **Email and Google authentication**
- **Multi-resume management** with feedback to boost ATS scores

The app helps job seekers present their skills and experience in the best possible way—boosting opportunities for unmatched earnings.

---

## 🏗 System Architecture

### Frontend
- **Framework**: React 18 + TypeScript, built with **Vite** for lightning-fast development and builds
- **Styling**: Tailwind CSS with `shadcn/ui` component library
- **Routing**: Wouter for lightweight client-side navigation
- **State Management**: TanStack Query (React Query) for server data & caching
- **Forms**: React Hook Form with Zod for type-safe validation
- **UI Components**: Accessible dialogs, tables, and interactive elements

### Backend
- **Runtime**: Node.js with Express
- **Database ORM**: Drizzle ORM + PostgreSQL (Neon serverless)
- **API**: RESTful endpoints with structured error handling and logging
- **Storage**: Interface-driven, allowing easy swap from in-memory to database

### Authentication
- **Provider**: Firebase Authentication (email/password & Google OAuth)
- **Session**: Firebase manages auth state; React context provides user data
- **User Data**: Profiles stored in PostgreSQL and synced with Firebase

### Data Architecture
- Shared TypeScript schemas using Drizzle + Zod
- Core entities: **Users**, **Resumes**, and **ATS Analyses**
- JSON-based resume content for flexible template rendering

### Template System
- Templates grouped by **experience level**
- Styles: professional, modern, creative, academic
- Dynamic renderer supporting multiple layouts and color schemes

### ATS Scoring Engine
- Client-side analysis for keywords, formatting, content quality, and length
- Section-by-section recommendations and scoring
- Historical analysis storage with usage limits

---

## 🔗 External Dependencies

### Authentication
- Firebase Authentication (Email/Password & Google OAuth)

### Database
- PostgreSQL (Neon)
- Drizzle Kit for migrations and schema management

### UI & Styling
- Tailwind CSS, Radix UI, Lucide React

### Development Tools
- Vite, ESBuild, TypeScript

### PDF Generation
- jsPDF for client-side PDF export
- Custom export service for template-aware formatting

### Miscellaneous
- React Beautiful DnD for drag-and-drop resume sections
- date-fns for date utilities
- uuid for unique IDs
- React Day Picker for calendar UI

---

## 🧩 Project Structure
```
.
├─ src/             # React front-end source
├─ server/          # Express backend source
├─ dist/            # Production build output
│  └─ public/       # Files deployed to Firebase Hosting
├─ .github/         # GitHub Actions workflows
├─ package.json
└─ README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Firebase CLI](https://firebase.google.com/docs/cli)

### Installation
```bash
git clone https://github.com/AnshulSharma2005/RESUME.git
cd RESUME
npm install
```

### Development
```bash
npm run dev
```
Runs the Express server with hot reload and Vite frontend.

### Build
```bash
npm run build
```
Creates a production build in `dist/`.

### Start Production Server
```bash
npm start
```

---

## ☁️ Deployment (Firebase Hosting)

Continuous deployment is already configured:

1. **Push to `main` branch** → GitHub Actions runs `npm ci && npm run build` and deploys to Firebase Hosting automatically.
2. Manual deploy (optional):
   ```bash
   firebase deploy
   ```

Your site is served from the `dist/public` directory.

---

## 📝 License
MIT License © 2025 [Anshul Sharma](https://github.com/AnshulSharma2005)
