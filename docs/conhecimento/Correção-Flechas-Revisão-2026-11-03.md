# Revisão de flechas e mapa de pendências — 2026-11-03

## Correção aplicada

Flechas T1–T5 agora são normalizadas pelo `templateId` (`FLECHA_T1` até `FLECHA_T5`) sempre que um save antigo é carregado e também em cada comando online. A normalização força `category: FLECHA`, `slot: MUNICAO`, `stackable: false`, `maxStack: 1` e `quantity: 1`.

O descarte passou a ser uma ação persistida (`discardItem`) em vez de alterar apenas o estado local da interface. Isso corrige o caso em que a flecha parecia sumir, mas retornava após sincronizar com o servidor. Venda e desmanche continuam aceitando a categoria `FLECHA`; itens equipados permanecem protegidos até serem desequipados.

Arquivos alterados: `src/store/gameStore.ts`, `src/ui/Backpack.tsx`, `src/ui/Inventory.tsx`, `src/engine/save.ts`, `server/game.ts` e `server/generated/online-runtime.cjs`.

## Verificações executadas

- `npm run typecheck` — aprovado.
- `npm run online:bundle` — runtime recompilado.
- `npm run online:bundle-check` — aprovado.
- `npm run journey:check` — aprovado.
- `npm run brain:sync` — 516 arquivos, 16 notas originais, 84 alterações.
- `npm run brain:check` — aprovado.

## Próximas instâncias prioritárias

1. Testar em produção com uma Flecha de Madeira no inventário: vender 1, desmanchar 1 e descartar 1; repetir com uma flecha equipada após desequipar.
2. Confirmar no Supabase que a migration de trade (`003_trade_audit.sql`) está aplicada antes de ativar o Mercado Negro.
3. Adicionar testes automatizados de regressão para itens legados, flechas duplicadas e ações online idempotentes.
4. Finalizar as artes individuais da prancha em `public/assets/ui/`: `CALENDARIO_ESSENCIA.png`, `SELO_SEQUENCIA_SEMANAL.png` e `SKIN_PREMIUM_MES_01.png`.
5. Atualizar o editor visual de aparência também no fluxo de criação online.
6. Só depois iniciar Baú por tempo, Boss Diário, pesca/mineração e cards com autoridade de servidor, RLS e rate limit.

## Regra de continuidade

O Cérebro Mythreon e o vault `Mythreon Obsidian` são derivados do projeto. Após qualquer alteração relevante, executar `npm run brain:sync`; para validar a integridade, executar `npm run brain:check`. Não editar `server/generated/online-runtime.cjs` manualmente: alterar `server/*.ts` ou `src/` e recompilar.
