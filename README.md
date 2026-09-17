# AI Career Intelligence Platform

An AI-powered **Career Copilot** that helps users analyze their skills, projects, resume, learning progress, and target career role to build a personalized and evidence-based career roadmap.

Unlike a basic job recommendation system, this platform explains **why** a recommendation is made, identifies the evidence behind it, and converts recommendations into measurable actions.

## Key Features

- Profile and Skill Graph
- Resume Intelligence and skill extraction
- Career Role Matching with fit scores
- Skill Gap Analysis
- AI-generated learning roadmaps
- Personalized Project Recommendations
- Resume and Portfolio Feedback
- Job Description Intelligence
- Progress Tracking Dashboard
- AI Career Copilot Chat
- Evidence-based recommendations using RAG

## Tech Stack

- **Frontend:** React 19 + Vite + TypeScript, Tailwind CSS (see [`frontend/`](frontend))
- **Backend:** NestJS (TypeScript) modular monolith (see [`Backend/`](Backend))
- **Database:** PostgreSQL 15 with pgvector (HNSW cosine similarity), via Prisma ORM
- **Cache & Rate Limiting:** Redis
- **AI:** Embeddings-based semantic matching; LLM/RAG features are planned but not yet implemented
- **Authentication:** JWT (access + rotating refresh tokens), Argon2id password hashing
- **Deployment:** Docker Compose (backend + Postgres + Redis)

## Running the Full Stack Locally

1. **Backend** — see [`Backend/README.md`](Backend/README.md) for full setup (Docker Compose, migrations, seed data). It serves the API at `http://localhost:3000/v1`, with Swagger docs at `/v1/docs`.
2. **Frontend** — `cd frontend && cp .env.example .env && npm install && npm run dev`, served at `http://localhost:5173`. `VITE_API_BASE_URL` in `.env` must point at the backend's `/v1` base URL.
3. The backend's `CORS_ORIGINS` (see `Backend/.env.example`) must include the frontend's dev origin (`http://localhost:5173` by default).

**Current integration status:** the frontend's UI is fully built; its `src/services/api/` layer is wired to the real backend for auth, profiles, job matching, and market skill-trends/salary-benchmarks. Resume analysis, AI-generated roadmaps, career recommendations, and notifications remain backed by mock data because those modules (Resume, AI Worker, Notifications) don't have backend implementations yet — each mocked file documents exactly why. See `Backend/ASSUMPTIONS.md` for the full list of integration decisions and known limitations.

## Team of 4

| Member | Responsibility |
|---|---|
| **Member 1** | AI/ML and Recommendation Engine |
| **Member 2** | Backend, Database and Authentication |
| **Member 3** | Frontend, Dashboard and UX |
| **Member 4** | Data Pipeline, RAG, DevOps and QA |

## Project Flow

`User → Web App → API → Profile/Resume/Job Services → Recommendation Engine → LLM/RAG → PostgreSQL + Vector DB → Dashboard`

## Core Goal

Help users move through a complete career journey:

**Target Role → Skill Analysis → Skill Gaps → Learning Roadmap → Projects → Resume Evidence → Job Readiness**

The main objective is to create a transparent AI system that does not simply give career advice, but provides **personalized, explainable, and actionable career guidance**.

## Future Scope

- Real-time job market analysis
- Mock interview preparation
- AI-based assessment generation
- Adaptive roadmaps based on progress
- Personalized internship and job recommendations

### Contributors

This project is being developed collaboratively by a team of **4 members**.