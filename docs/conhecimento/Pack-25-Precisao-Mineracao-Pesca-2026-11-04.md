# Pack 25 — Precisão manual em Mineração e Pesca

## Entrega

- Mineração e Pesca continuam podendo evoluir como atividades de ritmo, sem bloquear o loop idle.
- O botão de cada ponto agora abre um pulso manual: o jogador inicia o ciclo e clica no momento ideal.
- Três resultados são possíveis: perfeito (1,5x de qualidade e +2 skill), bom (1x e +1 skill) e fora do pulso (0,85x e +1 skill).
- O servidor aceita somente os multiplicadores discretos `0.5`, `1` e `1.5`, mantendo cooldown e validação de nível.
- O rendimento extra é moderado e não usa premium, preservando a economia.

## Arquivos

- `src/types/index.ts` — tipo `Precision`.
- `src/store/gameStore.ts` — rendimento/skill por precisão.
- `server/game.ts` — validação dos multiplicadores online.
- `src/ui/ProfessionPrecisionAction.tsx` — interação manual.
- `src/ui/Professions.tsx` — integração nos veios e pontos de pesca.

## Próxima fatia dos ofícios

1. Ferramentas e varas T1–T5 como itens equipáveis.
2. Receitas de refino (minério, peixe, sopa e elixir) no Ferreiro/Fazenda.
3. Desafios server-side com token de pulso assinado para reduzir automação abusiva.
