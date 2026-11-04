# Pack 38 — Jornal de Mythreon

## Objetivo

Dar ao Arquivo uma camada viva de comunicação: atualizações, eventos ativos, avisos de teste e pequenos relatos de lore em um único lugar.

## Implementado

- Nova seção `Jornal` dentro do Arquivo/Wiki.
- Entradas tipadas com data, categoria, resumo, texto completo, tags e sinalizador de evento ativo.
- Destaque visual para eventos ativos.
- Identidade visual própria para Atualização, Evento, Lore e Aviso.
- Conteúdo inicial registra o Boss Diário, o PvP sazonal, cosméticos, o Refúgio e o roadmap online.

## Arquivos

- `src/data/mythreonJournal.ts`
- `src/ui/Wiki.tsx`
- `docs/conhecimento/Pack-38-Jornal-de-Mythreon-2026-11-04.md`

## Operação

Cada pack deve acrescentar uma entrada curta ao catálogo antes de rodar `npm run brain:sync`. Eventos usam `active: true` e devem ser desligados quando o período acabar. O Jornal é editorial e não altera regras de combate ou economia.

## Próximos passos

- Gerar entradas automaticamente a partir de um changelog validado no release.
- Adicionar filtros por categoria e busca dentro do Jornal.
- Publicar uma versão resumida na landing page quando houver evento ativo.
