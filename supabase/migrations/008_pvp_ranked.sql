-- PvP ranqueado online. O cliente não decide vencedor nem rating.
begin;
create table if not exists public.world_pvp_matches (
  id uuid primary key,
  challenger_id uuid not null references public.world_characters(id),
  opponent_id uuid not null references public.world_characters(id),
  challenger_owner_id uuid not null references public.world_accounts(id),
  opponent_owner_id uuid not null references public.world_accounts(id),
  status text not null default 'invited' check(status in ('invited','open','completed','expired','cancelled')),
  winner_id uuid references public.world_characters(id),
  challenger_rating_before integer not null default 1000 check(challenger_rating_before >= 0),
  opponent_rating_before integer not null default 1000 check(opponent_rating_before >= 0),
  challenger_rating_after integer,
  opponent_rating_after integer,
  expires_at timestamptz not null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  check(challenger_id <> opponent_id)
);
create index if not exists world_pvp_active_challenger on public.world_pvp_matches(challenger_id,status);
create index if not exists world_pvp_active_opponent on public.world_pvp_matches(opponent_id,status);
alter table public.world_pvp_matches enable row level security;
revoke all on public.world_pvp_matches from public, anon, authenticated;
grant select on public.world_pvp_matches to authenticated;
drop policy if exists own_pvp_matches on public.world_pvp_matches;
create policy own_pvp_matches on public.world_pvp_matches for select to authenticated using(challenger_owner_id = auth.uid() or opponent_owner_id = auth.uid());
commit;
