# Job Interview Tracker

A polished, mobile-first job search companion for tracking applications, interviews, and outcomes with clean analytics and timezone-safe scheduling.

## Overview

Job Interview Tracker helps you manage the full interview pipeline in one place. You can add and edit applications, schedule interviews, review upcoming events in a calendar view, and monitor conversion rates through lightweight insights.

The interface uses an Apple-inspired visual language focused on clarity, hierarchy, and calm spacing, now hardened with onboarding, empty states, confirmation dialogs, and resilient local persistence.

## Key Features

- Full application CRUD (create, view, edit, delete)
- Status tracking: Applied, Interview, Offer, Rejected
- Interview planning with date, time, and location
- Timezone-safe interview date handling (`YYYY-MM-DD` local date flow)
- Search, filtering, and sorting on Applications
- Dashboard with summary stats, upcoming interviews, and recent activity
- Insights screen with rates and trend summaries
- Grouped, native-feeling forms and settings layout
- Mobile tab navigation with floating add action
- First-run onboarding modal
- Loading, empty, success/error, and confirmation states across key flows
- Local-first persistence with future-ready sync adapter hooks

## Screens / Sections

### 1) Dashboard
High-level overview of your pipeline:
- KPI cards
- Pipeline health and interview rate
- Upcoming interviews
- Recent application activity
- loading and empty-state feedback

### 2) Applications
Main list management screen:
- Search bar
- Status filtering
- Sort options (Newest / Company)
- Cleaner detail rows and quick delete affordance
- confirmation dialog for delete

### 3) Interviews
Calendar and agenda workflow:
- Monthly calendar with selected-day emphasis
- Interview indicator dots by date
- Selected-day interview agenda list
- Link-through to interview detail/edit

### 4) Insights
Performance-focused analytics:
- Total applications
- Interview rate
- Offer rate
- Rejection rate
- 4-month trend summary bars

### 5) Settings
Grouped app preferences and metadata:
- Notification toggle
- Export data action (placeholder)
- Sync action via local-first adapter (cloud-ready)
- Delete-all confirmation flow
- App info + platform mode info

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Routing:** React Router 6 (SPA)
- **Styling:** TailwindCSS 3 + design tokens in `client/global.css`
- **Icons:** Lucide React
- **Backend:** Express (integrated dev server architecture)
- **Validation:** Custom validation helpers in `client/lib/validation.ts`
- **Testing:** Vitest
- **Package manager:** pnpm

## Run Locally

### Prerequisites
- Node.js 18+
- pnpm

### Commands

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:8080`.

Other useful commands:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm start
```

## Project Structure

```text
client/
  components/        # Reusable UI and feature components
  context/           # Application state + local persistence
  hooks/             # UI and reminder hooks
  lib/               # Date helpers, validation, utilities, platform helpers
  pages/             # App screens (Dashboard, Applications, etc.)
  services/          # Sync/auth-ready service adapters
  global.css         # Tokens + reusable style primitives

server/
  index.ts           # Express setup
  routes/            # API route handlers

shared/
  api.ts             # Shared types for client/server

capacitor.config.ts  # Starter config for native shell packaging
```

## Future Improvements / Roadmap

- Add real authentication provider (Supabase/Firebase/Auth0)
- Replace local sync adapter with authenticated cloud sync
- Add conflict resolution + offline queue strategy
- Introduce richer chart visualizations for insights
- Implement production CSV export and import
- Add push notifications for interview reminders
- Expand Capacitor setup with iOS/Android build scripts and CI

## Timezone-Safe Date Handling Notes

Interview dates are intentionally handled as **local date strings** (`YYYY-MM-DD`) rather than direct UTC timestamps. This prevents the common “one day off” issue when users are in different timezones.

Core helpers:
- `parseLocalDate()` in `client/lib/dates.ts`
- `formatLocalYMD()` in `client/lib/dates.ts`

These helpers are used in scheduling flows and calendar matching to keep date behavior consistent.

## App Store / Capacitor Readiness Notes

- `capacitor.config.ts` is included as a baseline native packaging config.
- UI includes safe-area-aware nav/FAB spacing for mobile devices.
- Platform detection helper (`client/lib/platform.ts`) is in place for native/web branching.
- Sync service abstraction (`client/services/sync.ts`) is ready to swap to real cloud backends.

## Author

**Kennedy**  
Built as a portfolio-ready mobile product concept focused on practical job search workflow design.
