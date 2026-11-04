# Pack 29 — Matchmaking e histórico sazonal do PvP

Data: 04/11/2026  
Estado: implementado localmente; requer migration 011 em produção e playtest com duas contas reais.

## O que entrou

- Fila ranqueada server-side com entrada e saída idempotentes.
- Pareamento por temporada UTC e diferença máxima inicial de 150 pontos de rating.
- Preferência por quem entrou primeiro na fila.
- Apenas personagens online nos últimos 90 segundos podem ser pareados.
- O servidor cria o duelo em estado `open`; ambos podem resolver quando estiverem prontos.
- Histórico do jogador ampliado para 50 partidas, com `season_key` persistida.
- Temporada atual e término continuam visíveis no lobby.
- O duelo direto por convite permanece disponível como fallback.
- Poções, itens e vencedor continuam fora do controle do cliente.

## Segurança e concorrência

- A fila usa `FOR UPDATE SKIP LOCKED` para evitar que duas contas recebam o mesmo oponente.
- A operação passa pelo recibo idempotente de `world_operations`.
- Cada personagem só pode ter uma entrada de fila; uma entrada pareada fica marcada com `match_id`.
- Cancelar a fila não altera inventário, gold, XP ou rating.
- A resolução de rating continua dentro da transação autoritativa do servidor.

## Arquivos

- `supabase/migrations/011_pvp_matchmaking.sql`
- `server/world.ts`
- `src/ui/OnlinePvP.tsx`
- `scripts/online-check.ts`

## Verificação

`npm run online:check` cobre: entrada na fila, pareamento por rating, leitura do `match_id`, resolução do duelo e histórico sazonal.

## Ainda falta

1. Aplicar a migration 011 no Supabase de produção.
2. Adicionar matchmaking por ligas e limites de nível após dados reais.
3. Criar recompensas cosméticas por temporada e tela pública de histórico.
4. Testar concorrência com duas contas reais, reconexão e expiração simultânea.
