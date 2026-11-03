# Comunidade no Registro de Combate — 2026-11-03

O painel inferior do jogo agora possui duas abas principais: `Registro de Combate` e `Comunidade`. A Comunidade fica na mesma região da hunt para evitar que o jogador precise abandonar a tela de jogo.

Dentro da Comunidade existem três canais públicos: `Chat Mundial`, `Chat de Trade` e `Chat de Help`. Cada canal é persistido no servidor com a coluna `world_messages.channel`; mensagens antigas sem canal são tratadas como `global`.

Arquivos principais: `src/ui/CombatLog.tsx`, `src/ui/CombatCommunity.tsx`, `server/world.ts` e `supabase/migrations/004_chat_channels.sql`.

Aplicar a migration 004 depois das migrations 001–003 no Supabase antes de publicar os canais em produção. Mensagens privadas e as funções de amigos, correio e troca continuam disponíveis na tela Comunidade completa; o painel inferior é focado nos três chats públicos.
