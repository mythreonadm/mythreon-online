-- Canais públicos do painel Comunidade integrado ao Registro de Combate.
alter table public.world_messages add column if not exists channel text not null default 'global';
alter table public.world_messages drop constraint if exists world_messages_channel_check;
alter table public.world_messages add constraint world_messages_channel_check check (channel in ('global','trade','help'));
create index if not exists world_messages_channel_recent on public.world_messages(channel, created_at desc) where recipient_id is null;
