# Pack 30 — Loot próprio do Boss Diário

Data: 04/11/2026  
Estado: implementado localmente; requer migration 007 em produção e playtest com múltiplos participantes.

## Entrega

- O resgate do Boss Diário agora entrega loot real, além de gold e XP.
- Cada participante recebe componentes do boss; a quantidade aumenta quando a janela termina em vitória.
- Participantes com pelo menos 2% de contribuição podem receber um Ovo de Besta Divina coerente com o nível da janela.
- A chance do ovo melhora quando o boss é derrotado e cresce com a contribuição, sem ser garantida para todos.
- Todo resgate concede Mythreon Shards em quantidade proporcional ao nível e à participação.
- O loot tenta entrar na mochila e usa o Depósito como fallback; se ambos estiverem cheios, nenhum item é perdido silenciosamente e o recibo informa apenas o que foi entregue.
- A coluna `claimed_at` continua sendo a trava de idempotência: repetir o resgate não duplica gold, XP, itens ou shards.

## Arquivos

- `server/world.ts`
- `scripts/online-check.ts`
- `docs/conhecimento/Pack-30-Loot-Boss-Diario-2026-11-04.md`

## Verificação

`npm run online:check` valida gold, XP, loot e shards no resgate e a proteção contra resgate duplicado.

## Próximos passos

1. Aplicar a migration 007 no Supabase de produção.
2. Testar com duas ou mais contas reais, mochila cheia e Depósito cheio.
3. Adicionar tabela de loot histórico por participante para auditoria pública.
4. Criar recompensas cosméticas exclusivas por colocação de dano.
