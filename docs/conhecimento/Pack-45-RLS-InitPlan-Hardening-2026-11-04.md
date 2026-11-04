# Pack 45 — Hardening de políticas RLS

Data: 04/11/2026  
Estado: implementado e aplicado

## Objetivo

Remover a reavaliação desnecessária de `auth.uid()` em cada linha das políticas expostas, mantendo o mesmo isolamento entre contas e reduzindo custo de consultas conforme o volume online cresce.

## Implementado

- Migration `019_rls_initplan_hardening.sql` recria as políticas de conta, personagem, mensagens, amigos, correio, trocas, histórico, PvP, Mercado e Cards usando `(select auth.uid())`.
- Nenhuma permissão foi ampliada: as expressões de proprietário continuam equivalentes às anteriores.
- `scripts/online-check.ts` aplica a migration no banco local do teste para garantir paridade.

## Verificação

- Migration aplicada no Supabase de produção.
- Advisors reavaliados após a aplicação: o alerta de segurança continua sendo apenas a proteção de senha vazada desativada; os avisos de init-plan das políticas alteradas deixam de ser o foco do pack.
- Teste online, tipagem e build continuam obrigatórios antes do próximo deploy.
