-- Pack 37: snapshots e recompensas idempotentes de temporada do PvP.
begin;

create table if not exists public.world_pvp_season_stats (
  id uuid primary key,
  season_key text not null,
  character_id uuid not null references public.world_characters(id) on delete cascade,
  owner_id uuid not null references public.world_accounts(id) on delete cascade,
  rating integer not null default 1000 check(rating >= 0),
  wins integer not null default 0 check(wins >= 0),
  losses integer not null default 0 check(losses >= 0),
  matches integer not null default 0 check(matches >= 0),
  updated_at timestamptz not null default now(),
  unique(season_key, character_id)
);

create index if not exists world_pvp_season_stats_leaderboard
  on public.world_pvp_season_stats(season_key, rating desc, wins desc);
create index if not exists world_pvp_season_stats_owner
  on public.world_pvp_season_stats(owner_id, season_key desc);

create table if not exists public.world_pvp_season_rewards (
  id uuid primary key,
  season_key text not null,
  character_id uuid not null references public.world_characters(id) on delete cascade,
  owner_id uuid not null references public.world_accounts(id) on delete cascade,
  tier text not null check(tier in ('BRONZE','PRATA','OURO','PLATINA','MITICO')),
  rating integer not null check(rating >= 0),
  wins integer not null check(wins >= 0),
  losses integer not null check(losses >= 0),
  reward_gold bigint not null check(reward_gold >= 0),
  reward_shards bigint not null check(reward_shards >= 0),
  reward_coins bigint not null check(reward_coins >= 0),
  claimed_at timestamptz not null default now(),
  unique(season_key, character_id)
);

create index if not exists world_pvp_season_rewards_owner
  on public.world_pvp_season_rewards(owner_id, claimed_at desc);

alter table public.world_pvp_season_stats enable row level security;
alter table public.world_pvp_season_rewards enable row level security;
revoke all on public.world_pvp_season_stats from public, anon, authenticated;
revoke all on public.world_pvp_season_rewards from public, anon, authenticated;
grant select on public.world_pvp_season_stats to authenticated;
grant select on public.world_pvp_season_rewards to authenticated;
drop policy if exists own_pvp_season_stats on public.world_pvp_season_stats;
create policy own_pvp_season_stats on public.world_pvp_season_stats
  for select to authenticated using(owner_id = (select auth.uid()));
drop policy if exists own_pvp_season_rewards on public.world_pvp_season_rewards;
create policy own_pvp_season_rewards on public.world_pvp_season_rewards
  for select to authenticated using(owner_id = (select auth.uid()));

commit;
