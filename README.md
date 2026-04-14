# Job Interview Tracker

A mobile-first interview tracker built with React + TypeScript, now with **Supabase Auth** and **user-scoped cloud data**.

## Overview

Job Interview Tracker helps you track applications, interview schedules, and outcomes in one place. Phase two adds secure authentication and per-user data isolation so each account sees only its own records.

## Auth Features (Phase Two)

- Email/password sign up
- Email/password sign in
- Google OAuth sign in
- Password reset email flow
- Session persistence (Supabase)
- Sign out
- Self-service account deletion via secure RPC
- Role support: `user` (default), `admin`
- Separate `/admin/login` route using the same Supabase auth backend

## Data Ownership & Privacy

- Application records are stored in Supabase table `applications`.
- Every record includes a `user_id` owner.
- Row-Level Security (RLS) policies enforce owner-only access for normal users.
- Users can only read/write/delete rows where `user_id = auth.uid()`.
- Notes, interview fields, reminders, and prep data are stored within each user-owned application record.

## Tech Stack

- React 18 + TypeScript + Vite
- React Router 6
- TailwindCSS 3
- Supabase Auth + PostgREST API for auth + database
- Vitest

## Required Environment Variables

Create `.env.local`:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## Supabase Setup

1. Create a Supabase project.
2. Run SQL from `supabase/schema.sql` in the Supabase SQL editor.
3. In Supabase Auth:
   - Enable Email provider
   - Enable Google provider (optional but required for Google sign-in)
4. Add redirect URLs (local + production) for auth callbacks.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` locally and in deployment env vars.

## Local Development

```bash
pnpm install
pnpm dev
```

Useful checks:

```bash
npm run build:client
pnpm typecheck
pnpm test
```

## Current Routes

- `/auth/login`
- `/auth/signup`
- `/auth/reset`
- `/admin/login`
- `/admin` (admin-role guarded)
- Main app routes remain protected behind authenticated sessions.

## Timezone-Safe Date Handling

Interview dates are handled as local `YYYY-MM-DD` values using:
- `parseLocalDate()`
- `formatLocalYMD()`

This avoids off-by-one issues across timezones in calendar/list/detail views.

## Migration Notes

- Local-only persistence has been replaced by user-scoped cloud persistence when authenticated.
- Existing workflows (add/edit/delete, dashboard/interviews/insights derivations) remain the same.
- Account and role data are managed through Supabase `auth.users` + `profiles`.

## Author

Kennedy
