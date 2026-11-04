# Pack 17 — Boss Diário cooperativo

Data: 04/11/2026  
Escopo: primeira fatia online do Boss Diário, sem alterar o ciclo de caça automática.

## O que foi criado

- Catálogo determinístico de seis Bosses Diários em `src/data/dailyBoss.ts`.
- Três janelas universais por dia, calculadas em UTC: manhã (00–08), tarde (08–16) e noite (16–24).
- Migração `supabase/migrations/007_daily_boss.sql` com as tabelas `world_daily_boss_runs` e `world_daily_boss_participants`, RLS e publicação de atualização dos eventos.
- Operações online `dailyBoss.read`, `dailyBoss.join`, `dailyBoss.attack` e `dailyBoss.claim` em `server/world.ts`.
- Dano individual com intervalo mínimo de 2,5 segundos, HP coletivo escalado por inscrições e fechamento automático da janela.
- Recompensa proporcional à contribuição, com XP e Gold; Boss derrotado concede +5% de XP até o encerramento do ciclo atual.
- Aba `Boss Diário` em `src/App.tsx` e painel responsivo em `src/ui/DailyBoss.tsx`.
- Testes de integração no `scripts/online-check.ts`: inscrição, ataque, rate limit, leitura, encerramento e resgate.

## Regras de segurança

- Cada personagem só pode contribuir uma vez por ação e a participação é vinculada ao `owner_id` autenticado.
- O servidor calcula o dano e a recompensa; o cliente só solicita a ação.
- A recompensa é marcada com `claimed_at`, evitando resgate duplicado.
- As tabelas ficam com RLS habilitado; participantes só enxergam a própria linha, enquanto o resumo público usa apenas totais e ranking limitado.

## Pendências do próximo slice

1. Aplicar a migração 007 no projeto Supabase de produção.
2. Validar com duas contas reais e três dispositivos, incluindo reconexão no meio do ataque.
3. Adicionar loot próprio do Boss e uma tela de histórico de contribuição.
4. Publicar o ciclo no Ranking e no Jornal de Mythreon.
5. Conectar efeitos visuais/áudio e uma arena específica para o mapa do Boss.

## Validação local

`npm run online:check` deve cobrir a fatia online; `npm run typecheck`, `npm run build`, `npm run brain:sync` e `npm run brain:check` continuam obrigatórios antes do deploy.
