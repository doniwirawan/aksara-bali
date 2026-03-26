-- Run this in Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- Table: conversions (log all Latin→Balinese conversions)
create table if not exists public.conversions (
  id          bigserial primary key,
  input_length  integer not null,
  output_length integer not null default 0,
  mode        text not null default 'latin_to_bali',
  locale      text not null default 'id',
  created_at  timestamptz not null default now()
);

-- Table: quiz_results (store quiz session results)
create table if not exists public.quiz_results (
  id           bigserial primary key,
  score        integer not null,
  total        integer not null,
  accuracy     integer not null,
  max_streak   integer not null default 0,
  difficulty   text not null default 'all',
  time_seconds integer,
  created_at   timestamptz not null default now()
);

-- Table: writing_checks (log handwriting check results)
create table if not exists public.writing_checks (
  id            bigserial primary key,
  word_latin    text not null,
  score         integer not null,
  precision_pct integer,
  recall_pct    integer,
  passed        boolean not null,
  created_at    timestamptz not null default now()
);

-- Enable Row Level Security (RLS) — allow insert from anon, restrict reads
alter table public.conversions enable row level security;
alter table public.quiz_results enable row level security;
alter table public.writing_checks enable row level security;

-- Policy: anyone can insert (logging)
create policy "Allow anon insert conversions"
  on public.conversions for insert to anon with check (true);

create policy "Allow anon insert quiz_results"
  on public.quiz_results for insert to anon with check (true);

create policy "Allow anon insert writing_checks"
  on public.writing_checks for insert to anon with check (true);

-- Policy: only service role can select (for admin dashboard)
create policy "Service role can read conversions"
  on public.conversions for select using (auth.role() = 'service_role');

create policy "Service role can read quiz_results"
  on public.quiz_results for select using (auth.role() = 'service_role');

create policy "Service role can read writing_checks"
  on public.writing_checks for select using (auth.role() = 'service_role');

-- Useful views for the dashboard
create or replace view public.daily_conversions as
  select date_trunc('day', created_at) as day, count(*) as total
  from public.conversions
  group by 1 order by 1 desc;

create or replace view public.quiz_stats as
  select
    count(*) as total_sessions,
    round(avg(accuracy)) as avg_accuracy,
    max(max_streak) as best_streak,
    round(avg(score::float / total * 100)) as avg_score_pct
  from public.quiz_results;
