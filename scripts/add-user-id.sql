-- Migration: add per-user ownership to data tables.
-- Run once in the Supabase SQL Editor.
-- Safe to re-run (uses IF NOT EXISTS). Existing rows keep user_id = NULL
-- (they show up only in community/admin stats, never in a user's personal dashboard).

alter table public.conversions   add column if not exists user_id uuid references auth.users(id);
alter table public.quiz_results   add column if not exists user_id uuid references auth.users(id);
alter table public.writing_checks add column if not exists user_id uuid references auth.users(id);

create index if not exists idx_conversions_user   on public.conversions(user_id);
create index if not exists idx_quiz_results_user   on public.quiz_results(user_id);
create index if not exists idx_writing_checks_user on public.writing_checks(user_id);
