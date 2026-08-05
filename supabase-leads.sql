create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null default 'meta_lead_ads',
  external_id text,
  form_id text,
  campaign_id text,
  ad_id text,
  patient_name text,
  guardian_phone text,
  area text,
  hospital text,
  requested_service text,
  memo text,
  status text not null default 'new',
  raw_payload jsonb not null default '{}'::jsonb
);

create unique index if not exists leads_external_id_idx
  on public.leads (source, external_id)
  where external_id is not null and external_id <> '';

alter table public.leads enable row level security;

drop policy if exists "leads_service_role_only" on public.leads;
create policy "leads_service_role_only"
  on public.leads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
