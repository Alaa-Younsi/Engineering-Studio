-- ============================================================================
-- Grant the studio account access to the admin dashboard.
--
-- Signing in is not enough: /admin refuses any account that is not in
-- public.admins, so a self-registered user can never read client submissions.
-- Adding that row is a deliberate manual step — this is it.
--
-- BEFORE running this, the account must exist in Supabase Auth:
--   Authentication → Users → "Add user" → Create new user
--     Email:    admin@engineeringstudio.com
--     Password: (the one you chose — set it here, never in this repo)
--     Tick "Auto Confirm User", otherwise sign-in fails until it is verified.
--
-- Then paste this into the SQL Editor and run it. Re-running is safe.
-- ============================================================================

insert into public.admins (user_id)
select id
from auth.users
where email = 'admin@engineeringstudio.com'
on conflict (user_id) do nothing;

-- ── Verify ──────────────────────────────────────────────────────────────────
-- Must return exactly one row. If it returns none, the auth user does not
-- exist yet — create it in Authentication → Users, then re-run the insert.
select u.email,
       u.email_confirmed_at is not null as confirmed,
       a.created_at        as admin_since
from public.admins a
join auth.users u on u.id = a.user_id;
