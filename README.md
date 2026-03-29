# Job Interview Tracker

A polished, mobile-first job search companion for tracking applications, interviews, and outcomes with clean analytics and timezone-safe scheduling.

## Overview

Job Interview Tracker helps you manage the full interview pipeline in one place. You can add and edit applications, schedule interviews, review upcoming events in a calendar view, and monitor conversion rates through lightweight insights.

The interface is redesigned with an Apple-inspired visual language focused on clarity, hierarchy, and calm spacing for day-to-day use.

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

## Screens / Sections

### 1) Dashboard
High-level overview of your pipeline:
- KPI cards
- Pipeline health and interview rate
- Upcoming interviews
- Recent application activity

### 2) Applications
Main list management screen:
- Search bar
- Status filtering
- Sort options (Newest / Company)
- Cleaner detail rows and quick delete affordance

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
- Delete-all action (placeholder)
- App info and architecture notes

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
  context/           # Application state (applications/interviews)
  hooks/             # UI and reminder hooks
  lib/               # Date helpers, validation, utilities
  pages/             # App screens (Dashboard, Applications, etc.)
  global.css         # Tokens + reusable style primitives

server/
  index.ts           # Express setup
  routes/            # API route handlers

shared/
  api.ts             # Shared types for client/server
```

## Future Improvements / Roadmap

- Persist data to local storage or database
- Add authentication and multi-device sync
- Introduce richer chart visualizations for insights
- Add notification delivery integrations (email/push)
- Improve export with full CSV schema and filters
- Prepare native wrappers for iOS/Android deployment workflows

## Timezone-Safe Date Handling Notes

Interview dates are intentionally handled as **local date strings** (`YYYY-MM-DD`) rather than direct UTC timestamps. This prevents the common “one day off” issue when users are in different timezones.

Core helpers:
- `parseLocalDate()` in `client/lib/dates.ts`
- `formatLocalYMD()` in `client/lib/dates.ts`

These helpers are used in scheduling flows and calendar matching to keep date behavior consistent.

## Author

**Kennedy**  
Built as a portfolio-ready mobile product concept focused on practical job search workflow design.
