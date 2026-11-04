-- Histórico auditável de recompensas do Boss Diário.
begin;

create table if not exists public.world_daily_boss_rewards (
  id uuid primary key,
  run_id uuid not null references public.world_daily_boss_runs(id) on delete cascade,
  character_id uuid not null references public.world_characters(id) on delete cascade,
  owner_id uuid not null references public.world_accounts(id) on delete cascade,
  damage bigint not null check(damage >= 0),
  participation_ratio numeric(12,8) not null check(participation_ratio >= 0 and participation_ratio <= 1),
  defeated boolean not null default false,
  gold bigint not null check(gold >= 0),
  xp bigint not null check(xp >= 0),
  shards integer not null check(shards >= 0),
  loot jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique(run_id, character_id)
);

create index if not exists world_daily_boss_rewards_owner
  on public.world_daily_boss_rewards(owner_id, created_at desc);

alter table public.world_daily_boss_rewards enable row level security;
revoke all on public.world_daily_boss_rewards from public, anon, authenticated;
grant select on public.world_daily_boss_rewards to authenticated;
drop policy if exists own_daily_boss_rewards on public.world_daily_boss_rewards;
create policy own_daily_boss_rewards on public.world_daily_boss_rewards
  for select to authenticated using(owner_id = auth.uid());

commit;
