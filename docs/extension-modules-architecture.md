# Student Platform Extension Architecture

This document describes the plug-and-play extension modules added without altering existing dashboard layout, styling, or core logic.

## 1. Backend Architecture

- Entry point: `backend/index.js`
- New extension gateway: `app.use('/api/extensions', extensionRoutes)`
- Route module: `backend/routes/extensionRoutes.js`
- Auth model: all extension APIs use existing `requireAuth` and `requireRole(['student'])`
- Data layer: new Mongoose models isolated from existing models

### Architectural Principles

- Additive only: no existing APIs removed or behavior changed
- Isolated namespace: all endpoints under `/api/extensions/*`
- Optional activation: existing pages work unchanged
- Reusable services: frontend API wrapper in a dedicated extension service

## 2. Database Schema (New Models)

- `StudyLog`
  - `userId`, `date`, `studyMinutes`, `distractionMinutes`, `socialMediaMinutes`, `focusScore`, `productivityScore`, `source`
- `GamificationProfile`
  - `userId`, `streakDays`, `totalPoints`, `level`, `lastStudyDate`, `badges[]`, `weeklyChallenges[]`
- `MemoryQuizAttempt`
  - `userId`, `topic`, `score`, `totalQuestions`, `correctAnswers`
- `PomodoroRoom`
  - `name`, `ownerId`, `type`, `allowCamera`, `activeUsers`, `currentPhase`, `phaseEndsAt`, `isActive`
- `ConfessionPost`
  - `userId`, `message`, `mood`, `likes`, `isAnonymous`
- `MarketplaceListing`
  - `sellerId`, `title`, `description`, `category`, `price`, `downloads`, `isActive`
- `Wallet`
  - `userId`, `balance`, `totalEarnings`, `totalSpent`
- `WalletTransaction`
  - `walletId`, `userId`, `type`, `amount`, `reason`, `referenceType`, `referenceId`

## 3. API Routes

Base prefix: `/api/extensions`

### Module 1 — Gamified Learning
- `GET /gamified/overview`
- `POST /gamified/study-log`
- `POST /gamified/memory-quiz/attempt`

### Module 2 — AI Study Mirror
- `GET /study-mirror/analytics?days=14`

### Module 3 — Pomodoro Virtual Study Room
- `GET /pomodoro/rooms`
- `POST /pomodoro/rooms`
- `POST /pomodoro/rooms/:id/join`
- `POST /pomodoro/rooms/:id/leave`
- `POST /pomodoro/session/complete`

### Module 4 — Study vs Distraction Tracker
- `POST /distraction/log`
- `GET /distraction/report?days=14`

### Module 5 — AI Learning Tools
- `POST /ai-tools/assignment-generator`
- `POST /ai-tools/notes-generator`
- `POST /ai-tools/presentation-generator`
- `POST /ai-tools/homework-helper`

### Module 6 — Viral Student Engagement Tools
- `GET /viral/random-knowledge`
- `POST /viral/exam-panic-sheet`
- `POST /viral/procrastination-alarm`

### Module 7 — Community Features
- `GET /community/confessions`
- `POST /community/confessions`
- `GET /community/global-map`
- `GET /community/live-study-rooms`

### Module 8 — Student Marketplace
- `GET /marketplace/listings`
- `POST /marketplace/listings`
- `POST /marketplace/listings/:id/purchase`
- `GET /marketplace/wallet`
- `POST /marketplace/wallet/top-up`
- `GET /marketplace/earnings`

## 4. Folder Structure (Added)

- `backend/models/StudyLog.js`
- `backend/models/GamificationProfile.js`
- `backend/models/MemoryQuizAttempt.js`
- `backend/models/PomodoroRoom.js`
- `backend/models/ConfessionPost.js`
- `backend/models/MarketplaceListing.js`
- `backend/models/Wallet.js`
- `backend/models/WalletTransaction.js`
- `backend/routes/extensionRoutes.js`
- `frontend/src/services/extensions/extensionApi.ts`
- `frontend/src/features/FeatureHubPage.tsx`
- `frontend/src/modules/StudyModulesPage.tsx`
- `frontend/src/tools/LearningToolsPage.tsx`

## 5. Integration Strategy

- Existing dashboard/pages are untouched and continue operating as-is.
- New UI is isolated under dedicated routes:
  - `/features`
  - `/modules`
  - `/tools`
- Existing routing structure remains unchanged, only optional route additions were made.
- New APIs are namespaced under `/api/extensions` to avoid conflicts.

## 6. Minimal UI Pages for New Tools

- `FeatureHubPage`: high-level extension entry page
- `StudyModulesPage`: modules 1,2,3,4,7,8 in a lightweight operational dashboard
- `LearningToolsPage`: modules 5 and 6 (AI + viral utilities)

## 7. Reusable Services

- `frontend/src/services/extensions/extensionApi.ts`
  - Centralized typed wrapper for all new extension endpoints
  - Reuses existing axios client/auth handling from `frontend/src/services/api.ts`

## Notes

- The extension APIs currently implement deterministic helper generators for AI tools.
- Real-time behavior is currently lightweight (polling style), keeping dependency footprint unchanged.
- This architecture is ready for future optional websocket integration if needed.
