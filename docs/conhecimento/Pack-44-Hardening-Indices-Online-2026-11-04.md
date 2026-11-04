# Pack 44 — Hardening de índices online

Data: 04/11/2026  
Estado: implementado e aplicado

## Objetivo

Garantir que as FKs usadas pelos fluxos de Cards sazonais, PvP, Mercado Negro, Ledger, Correio, Amigos e Trade tenham cobertura adequada para leitura por dono, histórico e auditoria.

## Implementado

- Migration `018_online_fk_indexes.sql` com índices compostos por entidade e tempo, preservando consultas de histórico.
- Cobertura para progressos/recompensas de Cards, participantes de PvP, anúncios de Mercado, transações, Ledger e Correio.
- `scripts/online-check.ts` também aplica a migration no banco de teste para manter paridade local/online.

## Verificação

- Migration aplicada no Supabase de produção.
- Lista de migrations confirma a versão 018.
- `npm run online:check`, `npm run typecheck` e `npm run build` continuam passando.
- O advisor de segurança permanece apenas com o aviso pré-existente de proteção contra senhas vazadas desativada; não surgiu alerta novo de RLS.
