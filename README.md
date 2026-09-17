# CareerAI — AI Career Intelligence Platform (Frontend)

An AI-powered career intelligence platform frontend for students and job seekers. This is a **frontend-only** build — no backend, database, or AI models — designed to be wired up to a REST API later.

## 1. Project Structure

```
src/
├── assets/
├── components/
│   ├── ui/            # Reusable design-system primitives (Button, Card, Modal, Tabs, Toast, ...)
│   ├── layout/         # Sidebar, MobileNav, Topbar, DashboardLayout
│   ├── dashboard/       # AIInsight, RecentActivityList
│   ├── resume/          # ResumeUploader
│   ├── careers/         # CareerCard
│   ├── skills/           # SkillCard, SkillGapCard
│   ├── roadmap/          # RoadmapStepItem
│   ├── jobs/             # JobCard
│   ├── notifications/    # NotificationItemRow
│   ├── ai/                # Floating AIAssistant widget
│   └── landing/            # LandingHeader
├── pages/                # One folder per route (Landing, Login, Signup, Onboarding, Dashboard, ...)
├── services/api/          # Mock API layer — one file per domain, structured for REST swap
├── data/                  # Mock data (users, careers, jobs, roadmap, skills, notifications)
├── context/                # ThemeContext (light/dark/system), AppContext (auth + notifications)
├── hooks/
├── utils/                  # cn() class helper
├── types/                  # Shared TypeScript interfaces
├── routes/                 # ProtectedRoute guard
├── App.tsx
└── main.tsx
```

## 2. Technologies Used

- React 19 + Vite + TypeScript
- Tailwind CSS 3 (custom design tokens — indigo/violet primary, semantic success/warning/danger/AI colors, Sora + Inter typography)
- React Router v7
- Framer Motion (page/modal/mobile-nav transitions)
- Lucide React (icons)

## 3. Pages Implemented

Landing, Login, Signup, Forgot Password, Onboarding (5-step: Personal Info → Skills → Interests → Career Goal → Resume Upload), Dashboard, My Profile, Resume Intelligence, Career Explorer + Career Details, Skill Gap, Roadmap, Jobs + Job Details, Market Intelligence, Notifications, Settings.

All routes from the spec are live and navigable end-to-end using mock data.

## 4. Components Created

~20 reusable UI primitives (`Button`, `Input`, `Select`, `Modal`, `Card`, `Badge`, `ProgressBar`, `CircularProgress`, `Avatar`, `Dropdown`, `Tabs`, `Toast`, `Tooltip`, `Skeleton`, `EmptyState`, `ErrorState`, `SearchBar`, `Filter`) plus layout components (`Sidebar`, `MobileNav`, `Topbar`, `DashboardLayout`) and feature components (`CareerCard`, `JobCard`, `SkillCard`, `SkillGapCard`, `RoadmapStepItem`, `NotificationItemRow`, `ResumeUploader`, `AIInsight`, floating `AIAssistant`).

## 5. Mock APIs Created

`src/services/api/`: `authApi`, `profileApi`, `careerApi`, `roadmapApi`, `jobsApi`, `resumeApi`, `notificationApi`, `marketApi`. Every function is `async`, simulates network latency, and is commented with the future REST endpoint it maps to (e.g. `GET /v1/careers`, `POST /v1/resume/upload`).

## 6. How to Run

```bash
npm install
npm run dev       # start dev server
npm run build      # production build (tsc -b && vite build) — verified passing
npm run preview     # preview the production build
```

Log in / sign up with **any** email and password — authentication is mocked.

## 7. What Needs to Be Connected to the Backend Later

- Replace the bodies of functions in `src/services/api/*.ts` with real `fetch`/`axios` calls to the documented `/v1/...` endpoints — the function signatures and return types are already the contract.
- Real authentication (JWT/session) in `authApi.ts` and `AppContext.tsx`.
- Real resume parsing behind `POST /v1/resume/upload` (currently returns canned mock analysis).
- Real AI explanations/chat behind the `AIAssistant` widget and `AIInsight` cards (currently mock responses).
- Persisting profile edits, saved jobs, roadmap completion, and notification read-state server-side (currently in-memory only).
