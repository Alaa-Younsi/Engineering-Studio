-- ============================================================================
-- Engineering Studio — content schema for the admin dashboard.
--
-- Run this once in the Supabase SQL Editor. It is idempotent: re-running it is
-- safe and will bring an existing project up to date.
--
-- AFTER RUNNING, two manual steps:
--   1. Authentication → Users → "Add user": create the studio's admin account
--      (admin@engineeringstudio.com), ticking "Auto Confirm User".
--   2. Run supabase/grant-admin.sql — or inline:
--        insert into public.admins (user_id)
--        select id from auth.users
--        where email = 'admin@engineeringstudio.com';
--
--   Only rows in public.admins can read submissions or edit site content.
--   Being merely signed in is NOT enough — otherwise anyone who self-registers
--   could read every client's contact details.
--
-- Consider also turning OFF Authentication → Providers → Email → "Enable sign
-- ups", so no new accounts can be created at all.
-- ============================================================================

-- ── Admin allow-list ────────────────────────────────────────────────────────
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- An admin may confirm their own membership; nobody else can read the list.
drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select to authenticated using (user_id = auth.uid());

/*
 * security definer so the policies below can consult the allow-list without
 * every caller needing read access to it. Kept STABLE so the planner can cache
 * it within a statement.
 */
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ── Articles (Nouvelles) ────────────────────────────────────────────────────
create table if not exists public.articles (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  date       date not null default current_date,
  title      text not null,
  cover      text,
  blocks     jsonb not null default '[]'::jsonb,   -- [{ heading?, paragraphs: [] }]
  tags       text[] not null default '{}',
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Projects (Portefeuille) ─────────────────────────────────────────────────
create table if not exists public.projects (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  location   text[] not null default '{}',
  tags       text[] not null default '{}',
  media      jsonb not null default '[]'::jsonb,    -- [{ type: 'image'|'video', src? }]
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Submissions (Devis / Réunion / Contact forms) ──────────────────────────
create table if not exists public.submissions (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('devis', 'reunion', 'contact')),
  name        text not null default '',
  email       text not null default '',
  phone       text,
  fields      jsonb not null default '[]'::jsonb,    -- [{ label, value }]
  attachments jsonb not null default '[]'::jsonb,    -- [{ name, path, size }]
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Added after the first release; safe on a fresh install too.
alter table public.submissions
  add column if not exists attachments jsonb not null default '[]'::jsonb;

/*
 * Server-side ceilings. The client validates too, but anyone can POST straight
 * at the REST endpoint with the public anon key, so these are the limits that
 * actually hold. Without them a single request could store megabytes of junk.
 */
alter table public.submissions drop constraint if exists submissions_size_guard;
alter table public.submissions add constraint submissions_size_guard check (
  length(name) <= 120
  and length(email) <= 200
  and (phone is null or length(phone) <= 40)
  and jsonb_typeof(fields) = 'array'
  and jsonb_array_length(fields) <= 40
  and length(fields::text) <= 24000
  and jsonb_typeof(attachments) = 'array'
  and jsonb_array_length(attachments) <= 5
  and length(attachments::text) <= 4000
);

alter table public.submissions drop constraint if exists submissions_email_shape;
alter table public.submissions add constraint submissions_email_shape check (
  email = '' or email ~ '^[^[:space:]@]+@[^[:space:]@.]+([.][^[:space:]@.]+)+$'
);

create index if not exists articles_date_idx on public.articles (date desc);
create index if not exists projects_created_idx on public.projects (created_at asc);
create index if not exists submissions_created_idx on public.submissions (created_at desc);

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.articles enable row level security;
alter table public.projects enable row level security;
alter table public.submissions enable row level security;

-- Public can read only what is published.
drop policy if exists "articles public read" on public.articles;
create policy "articles public read" on public.articles
  for select using (published = true);

drop policy if exists "projects public read" on public.projects;
create policy "projects public read" on public.projects
  for select using (published = true);

-- Admins can do everything, including reading drafts.
drop policy if exists "articles admin all" on public.articles;
create policy "articles admin all" on public.articles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "projects admin all" on public.projects;
create policy "projects admin all" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Anyone (including anonymous visitors) may submit a form…
drop policy if exists "submissions public insert" on public.submissions;
create policy "submissions public insert" on public.submissions
  for insert to anon, authenticated with check (read = false);

-- …but only admins can read, update or delete them.
drop policy if exists "submissions admin read" on public.submissions;
create policy "submissions admin read" on public.submissions
  for select to authenticated using (public.is_admin());

drop policy if exists "submissions admin update" on public.submissions;
create policy "submissions admin update" on public.submissions
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "submissions admin delete" on public.submissions;
create policy "submissions admin delete" on public.submissions
  for delete to authenticated using (public.is_admin());

-- ── Storage: public bucket for covers & project media ───────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- ── Storage: private bucket for plans attached to a devis ───────────────────
-- Visitors may drop files in but can never list or read them back; the
-- dashboard opens them through short-lived signed URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'devis-files', 'devis-files', false, 15728640,
  array[
    'application/pdf','application/zip','application/x-zip-compressed',
    'application/x-rar-compressed','application/vnd.rar','application/octet-stream',
    'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png','image/jpeg','image/webp'
  ]
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "devis files visitor insert" on storage.objects;
create policy "devis files visitor insert" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'devis-files');

drop policy if exists "devis files admin read" on storage.objects;
create policy "devis files admin read" on storage.objects
  for select to authenticated using (bucket_id = 'devis-files' and public.is_admin());

drop policy if exists "devis files admin delete" on storage.objects;
create policy "devis files admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'devis-files' and public.is_admin());
