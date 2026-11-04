# Pack 35 — Hardening das tabelas online

Data: 04/11/2026  
Status: implementado localmente e aplicado no Supabase de produção.

## Segurança

- Tabelas internas (`world_ledger`, `world_operations` e `world_premium_events`) receberam políticas explícitas `using(false)`/`with check(false)` para impedir acesso direto por clientes autenticados.
- Políticas de leitura própria do Boss, fila PvP e Premium passaram a usar `(select auth.uid())`, evitando reavaliação por linha.

## Performance

Foram adicionados índices para as relações de personagem, run do Boss, proprietário da fila PvP, recompensas do Boss e eventos Premium. Isso cobre as consultas novas sem remover índices existentes.

## Arquivos

- `supabase/migrations/014_online_security_indexes.sql`
- `scripts/online-check.ts`
- `docs/conhecimento/Auditoria-Backlog-2026-11-03.md`

## Verificação

Migration 014 aplicada no projeto `ezjtbyouxnxleaapkrxv`; tabelas e RLS conferidos pelos advisories Supabase. A suíte local continua cobrindo RLS, idempotência e propriedade dos dados.
