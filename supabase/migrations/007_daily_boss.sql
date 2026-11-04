-- Boss Diário cooperativo. Aplicar depois das migrações 001–006.
begin;
create table if not exists public.world_daily_boss_runs (
  id uuid primary key,
  cycle_key text not null unique,
  boss_template_id text not null,
  boss_name text not null,
  boss_title text not null,
  level integer not null check(level between 1 and 500),
  base_hp bigint not null check(base_hp > 0),
  hp_total bigint not null check(hp_total > 0),
  hp_remaining bigint not null check(hp_remaining >= 0),
  status text not null default 'open' check(status in ('open','defeated','expired')),
  opened_at timestamptz not null default now(),
  closes_at timestamptz not null,
  resolved_at timestamptz
);
create index if not exists world_daily_boss_active on public.world_daily_boss_runs(status, closes_at);

create table if not exists public.world_daily_boss_participants (
  run_id uuid not null references public.world_daily_boss_runs(id) on delete cascade,
  character_id uuid not null references public.world_characters(id) on delete cascade,
  owner_id uuid not null references public.world_accounts(id),
  damage bigint not null default 0 check(damage >= 0),
  joined_at timestamptz not null default now(),
  last_action_at timestamptz,
  claimed_at timestamptz,
  primary key(run_id, character_id)
);
create index if not exists world_daily_boss_participant_owner on public.world_daily_boss_participants(owner_id, joined_at desc);

alter table public.world_daily_boss_runs enable row level security;
alter table public.world_daily_boss_participants enable row level security;
revoke all on public.world_daily_boss_runs, public.world_daily_boss_participants from public, anon, authenticated;
grant select on public.world_daily_boss_runs to authenticated;
grant select on public.world_daily_boss_participants to authenticated;
drop policy if exists read_daily_boss on public.world_daily_boss_runs;
create policy read_daily_boss on public.world_daily_boss_runs for select to authenticated using(true);
drop policy if exists own_daily_boss_participation on public.world_daily_boss_participants;
create policy own_daily_boss_participation on public.world_daily_boss_participants for select to authenticated using(owner_id = auth.uid());
do $$ begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='world_daily_boss_runs') then
    alter publication supabase_realtime add table public.world_daily_boss_runs;
  end if;
end $$;
commit;
