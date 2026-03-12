# 4am-Student Backend Server

A production-grade Node.js + TypeScript + Express + PostgreSQL backend for the 4am-Student platform.

## Features

- 🔐 JWT authentication (access + refresh tokens) with bcrypt password hashing
- 🗄️ PostgreSQL database with Prisma ORM
- 🤖 Google Gemini AI integration for mock interviews (server-side only)
- 🛡️ Helmet, CORS, rate limiting security
- ✅ Zod request validation
- 📊 Server-side assessment scoring (anti-cheat)
- 🎯 Role-based access control (STUDENT / COMPANY / ADMIN)

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- A Google Gemini API key (optional, for AI mock interviews)

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Set Up PostgreSQL

Create a PostgreSQL database:

```sql
CREATE DATABASE 4am_student;
CREATE USER 4am_user WITH ENCRYPTED PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE 4am_student TO 4am_user;
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL=postgresql://4am_user:yourpassword@localhost:5432/4am_student
JWT_SECRET=6s8hT7kP2xL9mQ4nR1wV5jF0aE3uI8yG6s8hT7kP2xL9mQ4nR1wV5jF0aE3uI8y
JWT_REFRESH_SECRET=3dJ5fH8kN1pS4vX7zB0wE2aQ6uY9cR3dJ5fH8kN1pS4vX7zB0wE2aQ6uY9cR0mP
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

> ⚠️ **Security**: Never commit your `.env` file. Generate strong secrets using `openssl rand -base64 64`.

### 4. Run Database Migrations

```bash
npm run db:migrate
```

### 5. Seed the Database

This populates all 9 assessments with their questions from the original `data/assessments.ts`:

```bash
npm run db:seed
```

### 6. Start the Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3001`.

### 7. Open Prisma Studio (Optional)

```bash
npm run db:studio
```

## API Endpoint Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register (STUDENT or COMPANY) | No |
| POST | `/api/auth/login` | Login, returns access + refresh tokens | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout, invalidate refresh token | No |

**Register body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "STUDENT"
}
```

**Login body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response format:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "...", "email": "...", "name": "...", "role": "STUDENT" },
    "tokens": { "accessToken": "...", "refreshToken": "..." }
  }
}
```

### Assessments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/assessments` | List all active assessments | STUDENT |
| GET | `/api/assessments/:id/start` | Get assessment questions (no correct answers) | STUDENT |
| POST | `/api/assessments/:id/submit` | Submit answers, get score (server-side) | STUDENT |
| GET | `/api/assessments/results` | Get user's past results | STUDENT |

**Submit body:**
```json
{
  "answers": { "questionId1": 2, "questionId2": 0 },
  "timeTaken": 1800
}
```

### Mock Interviews (AI-Powered)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/interviews/start` | Start a new interview session | STUDENT |
| GET | `/api/interviews/:sessionId` | Get session details | STUDENT |
| POST | `/api/interviews/:sessionId/answer` | Submit answer, get AI feedback | STUDENT |
| POST | `/api/interviews/:sessionId/end` | End session, get overall feedback | STUDENT |

**Answer body:**
```json
{
  "answer": "I am a full-stack developer with 3 years of experience..."
}
```

### Jobs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/jobs` | List open jobs (with filters) | Any |
| GET | `/api/jobs/:id` | Get job details | Any |
| POST | `/api/jobs` | Create job posting | COMPANY |
| POST | `/api/jobs/:id/apply` | Apply to a job | STUDENT |
| GET | `/api/jobs/:id/applications` | View applications | COMPANY |
| PATCH | `/api/jobs/:id/applications/:appId` | Update application status | COMPANY |

### Student

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/students/profile` | Get student profile | STUDENT |
| PUT | `/api/students/profile` | Update student profile | STUDENT |
| GET | `/api/students/results` | Get assessment results | STUDENT |
| GET | `/api/students/interviews` | Get interview history | STUDENT |
| GET | `/api/students/applications` | Get job applications | STUDENT |

### Company

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/companies/profile` | Get company profile | COMPANY |
| PUT | `/api/companies/profile` | Update company profile | COMPANY |
| GET | `/api/companies/jobs` | Get posted jobs | COMPANY |

## Authentication

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

Access tokens expire in **15 minutes**. Use the refresh endpoint with the `refreshToken` to get a new pair.

## Scripts

```bash
npm run dev        # Start with hot reload
npm run build      # Compile TypeScript
npm run start      # Run compiled code
npm run db:migrate # Run Prisma migrations
npm run db:seed    # Seed assessment data
npm run db:studio  # Open Prisma Studio GUI
npm run db:generate # Regenerate Prisma client
```
