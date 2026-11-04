-- Entitlement Premium: saldo comercial é controlado por webhook/server, nunca pelo navegador.
begin;
create table if not exists public.world_premium_entitlements (
  account_id uuid primary key references public.world_accounts(id) on delete cascade,
  plan_id text not null check (plan_id in ('PREMIUM_30D','PREMIUM_90D','PREMIUM_365D')),
  status text not null default 'active' check (status in ('active','cancelled','refunded')),
  starts_at timestamptz not null,
  expires_at timestamptz not null,
  provider text not null default 'manual',
  provider_customer_id text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists world_premium_entitlements_expiry on public.world_premium_entitlements(status, expires_at);
create table if not exists public.world_premium_events (
  event_id text primary key check (char_length(event_id) between 8 and 160),
  account_id uuid not null references public.world_accounts(id) on delete cascade,
  plan_id text not null check (plan_id in ('PREMIUM_30D','PREMIUM_90D','PREMIUM_365D')),
  status text not null check (status in ('active','cancelled','refunded')),
  payload jsonb not null,
  received_at timestamptz not null default now()
);
alter table public.world_premium_entitlements enable row level security;
alter table public.world_premium_events enable row level security;
revoke all on public.world_premium_entitlements, public.world_premium_events from public, anon, authenticated;
grant select on public.world_premium_entitlements to authenticated;
drop policy if exists own_premium_entitlement on public.world_premium_entitlements;
create policy own_premium_entitlement on public.world_premium_entitlements for select to authenticated using (account_id=auth.uid());
commit;
