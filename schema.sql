-- ============================================
-- ARETE AGORA — Database Schema
-- Run this ENTIRE file once in Supabase's SQL Editor.
-- (Dashboard → SQL Editor → New query → paste this → Run)
-- ============================================

-- ---------- 1-on-1 STUDY REQUESTS ----------
create table study_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text not null,
  time_slot text not null,
  status text not null default 'open',  -- 'open' or 'matched'
  created_at timestamptz default now()
);

create table teach_matches (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references study_requests(id),
  student_name text not null,
  student_email text not null,
  student_topic text not null,
  mentor_name text not null,
  mentor_email text not null,
  zoom_link text,
  created_at timestamptz default now()
);

-- ---------- DEBATE REQUESTS ----------
create table debate_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text not null,
  time_slot text not null,
  status text not null default 'open',  -- 'open' or 'matched'
  created_at timestamptz default now()
);

create table debate_matches (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references debate_requests(id),
  requester_name text not null,
  requester_email text not null,
  opponent_name text not null,
  opponent_email text not null,
  topic text not null,
  zoom_link text,
  created_at timestamptz default now()
);

-- ============================================
-- ACCESS POLICIES
-- Your site has no login system — anyone can submit a request or
-- claim one. These policies allow that ("anon" = any visitor).
-- ============================================

alter table study_requests enable row level security;
create policy "anyone can submit a study request"
  on study_requests for insert to anon with check (true);
create policy "anyone can view study requests"
  on study_requests for select to anon using (true);
create policy "anyone can claim a study request"
  on study_requests for update to anon using (true);

alter table teach_matches enable row level security;
create policy "anyone can create a teach match"
  on teach_matches for insert to anon with check (true);
create policy "anyone can view teach matches"
  on teach_matches for select to anon using (true);

alter table debate_requests enable row level security;
create policy "anyone can submit a debate request"
  on debate_requests for insert to anon with check (true);
create policy "anyone can view debate requests"
  on debate_requests for select to anon using (true);
create policy "anyone can claim a debate request"
  on debate_requests for update to anon using (true);

alter table debate_matches enable row level security;
create policy "anyone can create a debate match"
  on debate_matches for insert to anon with check (true);
create policy "anyone can view debate matches"
  on debate_matches for select to anon using (true);
