-- Pack 43: progresso mensal de coleção e recompensa sazonal idempotente de Cards.
begin;
create table if not exists public.world_card_season_progress (
  id uuid primary key,
  season_key text not null,
  character_id uuid not null references public.world_characters(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  unique_cards integer not null default 0 check(unique_cards >= 0),
  total_cards integer not null default 0 check(total_cards > 0),
  updated_at timestamptz not null default now(),
  unique(season_key, character_id)
);
create index if not exists world_card_season_progress_owner on public.world_card_season_progress(owner_id, season_key desc);
create table if not exists public.world_card_season_rewards (
  id uuid primary key,
  season_key text not null,
  character_id uuid not null references public.world_characters(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  unique_cards integer not null check(unique_cards >= 0),
  total_cards integer not null check(total_cards > 0),
  tier text not null,
  reward_gold bigint not null default 0 check(reward_gold >= 0),
  reward_shards bigint not null default 0 check(reward_shards >= 0),
  reward_coins bigint not null default 0 check(reward_coins >= 0),
  claimed_at timestamptz not null default now(),
  unique(season_key, character_id)
);
create index if not exists world_card_season_rewards_owner on public.world_card_season_rewards(owner_id, claimed_at desc);
alter table public.world_card_season_progress enable row level security;
alter table public.world_card_season_rewards enable row level security;
revoke all on public.world_card_season_progress from public, anon, authenticated;
revoke all on public.world_card_season_rewards from public, anon, authenticated;
grant select on public.world_card_season_progress to authenticated;
grant select on public.world_card_season_rewards to authenticated;
drop policy if exists own_card_season_progress on public.world_card_season_progress;
create policy own_card_season_progress on public.world_card_season_progress for select to authenticated using(owner_id=auth.uid());
drop policy if exists own_card_season_rewards on public.world_card_season_rewards;
create policy own_card_season_rewards on public.world_card_season_rewards for select to authenticated using(owner_id=auth.uid());
commit;
