# Arena móvel, registro PvP e recuperação de caça — 2026-11-05

## Problemas corrigidos

- Contas antigas podiam manter `journeyVersion = 1` e `tutorialCompleted = false` mesmo sem uma etapa tutorial ativa. O portão de caça passou a tratar o tutorial como orientação, não como bloqueio do loop principal.
- Ao iniciar uma caça com progresso real (nível maior que 1), a introdução antiga é reparada apenas nos marcadores `introSeen`/`tutorialCompleted`; missões, inventário, níveis, gold e drops não são removidos.
- A arena do Boss Diário agora oferece controle de movimento por toque, além de WASD/setas.
- Dano PvP, suporte e nocaute são registrados pelo servidor em `dailyBossBattle.lastPvpEvent` e no histórico curto `dailyBossBattle.pvpLog` dos dois personagens envolvidos.

## Contrato autoritativo do PvP

O evento compartilhado contém:

`id`, `at`, `kind`, `attackerId`, `attackerName`, `targetId`, `targetName`, `damage`, `healed`, `targetHp`, `targetHpMax` e `knockedOut`.

O atacante e o alvo recebem exatamente o mesmo evento. A interface exibe um registro PvP dentro da arena e mantém os seis eventos mais recentes visíveis; o servidor conserva até 30 por personagem e por ciclo.

## Regras de teste

1. Entrar no mapa com a conta antiga e confirmar que a caça permanece ativa após o primeiro tick.
2. Em celular, entrar no Boss Diário, usar o D-pad da arena e verificar que a posição muda sem teclado.
3. Com dois jogadores, selecionar um alvo, aproximar-se, atacar e conferir o mesmo dano/vida restante nos dois clientes.
4. Conferir o painel “Registro de combate” no cliente atacante e no cliente atingido.

## Validação executada

- `npm run typecheck` — aprovado.
- `npm run online:bundle` — aprovado; runtime online regenerado.
- `npm run online:bundle-check` — aprovado.
- `npm run journey:check` — aprovado.
- `npm run online:check` — ainda encontra a falha histórica do calendário (`1 !== 0`, linha 373 do teste integrado); não relacionada à arena, ao PvP ou à migração de jornada.
