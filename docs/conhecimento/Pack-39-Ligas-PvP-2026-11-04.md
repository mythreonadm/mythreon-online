# Pack 39 — Ligas visuais do PvP

## Objetivo

Dar ao jogador uma leitura imediata do lugar que ocupa na escada ranqueada sem criar uma segunda economia ou duplicar o cálculo de rating.

## Implementado

- Liga derivada server-side do rating atual.
- Faixas Bronze, Prata, Ouro, Platina e Mítico.
- Progresso percentual até a próxima liga.
- Mítico exibe estado de topo sem barra artificial.
- Lobby recebe a liga junto da temporada e do histórico.

## Regra

Bronze: 0–1199; Prata: 1200–1399; Ouro: 1400–1599; Platina: 1600–1799; Mítico: 1800+.

As ligas são somente uma camada de leitura. O cálculo autoritativo continua sendo o rating Elo já persistido, e as recompensas usam o tier da temporada encerrada.

## Validação

`npm run typecheck`, `npm run online:check`, `npm run build`, `npm run brain:sync` e `npm run brain:check`.

## Próximos passos

Turnos em tempo real, reconexão e playtest com duas contas permanecem no backlog antes de abrir a Arena ao público.
