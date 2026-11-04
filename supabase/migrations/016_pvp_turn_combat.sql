-- Pack 40: combate PvP por turnos, log de ações e HP autoritativo.
begin;

alter table public.world_pvp_matches
  add column if not exists round integer not null default 1 check(round >= 1),
  add column if not exists turn_owner uuid references public.world_characters(id),
  add column if not exists challenger_hp integer not null default 100 check(challenger_hp >= 0),
  add column if not exists opponent_hp integer not null default 100 check(opponent_hp >= 0),
  add column if not exists combat_log jsonb not null default '[]'::jsonb,
  add column if not exists last_action_at timestamptz;

create index if not exists world_pvp_turn_owner on public.world_pvp_matches(turn_owner,status);

commit;
