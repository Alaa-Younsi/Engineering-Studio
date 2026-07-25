-- ============================================================================
-- Engineering Studio — content schema for the admin dashboard.
-- Run this in the Supabase SQL Editor once, then create an admin user under
-- Authentication → Users. Every signed-in user can manage content; the public
-- (anon) role can only read published rows.
-- ============================================================================

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

create index if not exists articles_date_idx on public.articles (date desc);
create index if not exists projects_created_idx on public.projects (created_at asc);

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.articles enable row level security;
alter table public.projects enable row level security;

-- Public can read only what is published.
drop policy if exists "articles public read" on public.articles;
create policy "articles public read" on public.articles
  for select using (published = true);

drop policy if exists "projects public read" on public.projects;
create policy "projects public read" on public.projects
  for select using (published = true);

-- Authenticated admins can do everything (including read drafts).
drop policy if exists "articles admin all" on public.articles;
create policy "articles admin all" on public.articles
  for all to authenticated using (true) with check (true);

drop policy if exists "projects admin all" on public.projects;
create policy "projects admin all" on public.projects
  for all to authenticated using (true) with check (true);

-- ── Storage bucket for covers & project media ───────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- ── Optional: seed the current demo content ─────────────────────────────────
-- Uncomment to pre-fill the tables with the placeholder content the site
-- shipped with. Safe to skip — you can add everything from the dashboard.
--
-- insert into public.articles (slug, date, title, tags, blocks) values
--   ('grow-your-brand-smarter-faster', '2026-02-18', 'Grow your brand smarter & faster with grafty',
--    array['MEP','Electricité CFO','Plomberie'],
--    '[{"heading":"Sustainable design","paragraphs":["Remplacez ce texte."]}]'::jsonb);
