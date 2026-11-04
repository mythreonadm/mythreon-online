-- Pack 29: fila de matchmaking e metadados de temporada do PvP.
begin;

alter table public.world_pvp_matches
  add column if not exists season_key text;

update public.world_pvp_matches
set season_key = coalesce(season_key, to_char(created_at at time zone 'utc', 'YYYY-MM'))
where season_key is null;

alter table public.world_pvp_matches
  alter column season_key set default to_char(now() at time zone 'utc', 'YYYY-MM');

alter table public.world_pvp_matches
  alter column season_key set not null;

create index if not exists world_pvp_matches_season_history
  on public.world_pvp_matches(season_key, status, resolved_at desc);

create table if not exists public.world_pvp_queue (
  character_id uuid primary key references public.world_characters(id) on delete cascade,
  owner_id uuid not null references public.world_accounts(id) on delete cascade,
  season_key text not null,
  rating integer not null check(rating >= 0),
  status text not null default 'queued' check(status in ('queued','matched','cancelled')),
  match_id uuid references public.world_pvp_matches(id) on delete set null,
  joined_at timestamptz not null default now(),
  matched_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists world_pvp_queue_search
  on public.world_pvp_queue(season_key, status, rating, joined_at);

alter table public.world_pvp_queue enable row level security;
revoke all on public.world_pvp_queue from public, anon, authenticated;
grant select on public.world_pvp_queue to authenticated;
drop policy if exists own_pvp_queue on public.world_pvp_queue;
create policy own_pvp_queue on public.world_pvp_queue
  for select to authenticated using(owner_id = auth.uid());

commit;
