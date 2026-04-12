-- Enable required extension
create extension if not exists pgcrypto;

-- Profiles (role support)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- User-owned application records (includes interview + notes payload)
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  role text not null,
  status text not null check (status in ('Applied', 'Interview', 'Rejected', 'Offer')),
  date_applied timestamptz not null,
  interview_date date,
  interview_time text,
  location text,
  notes text,
  initials text,
  reminders jsonb,
  preparation jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists applications_user_id_idx on public.applications(user_id);

-- Optional per-user settings
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  notifications_enabled boolean not null default true,
  onboarding_complete boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.user_settings enable row level security;

-- ownership policies
create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id);

create policy "applications_select_own" on public.applications
for select using (auth.uid() = user_id);

create policy "applications_insert_own" on public.applications
for insert with check (auth.uid() = user_id);

create policy "applications_update_own" on public.applications
for update using (auth.uid() = user_id);

create policy "applications_delete_own" on public.applications
for delete using (auth.uid() = user_id);

create policy "settings_select_own" on public.user_settings
for select using (auth.uid() = user_id);

create policy "settings_upsert_own" on public.user_settings
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- auto-create profile for new users
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'role', 'user'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- self-service account deletion RPC (called by authenticated user)
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

grant execute on function public.delete_my_account() to authenticated;
