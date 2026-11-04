# Pack 22 — Baú por tempo online

Data: 04/11/2026

## Entregue

- Cada ciclo de hunt ou treino online acumula 3 segundos de presença no `onlineChestSeconds`.
- A cada 5 minutos, o jogador pode abrir o Baú do Refúgio.
- A recompensa é Gold escalado pelo nível e Mythreon Shards, sem entregar equipamento raro diretamente.
- O contador é persistido no personagem, funciona no modo local e no mundo online e não depende do relógio informado pelo cliente.
- A ação `claimOnlineChest` é validada no servidor e impede resgate antes do tempo ou duplicação.
- O painel visual foi colocado no Refúgio, próximo às rotas de caça e treino.

## Arquivos principais

- `src/types/index.ts`
- `src/engine/save.ts`
- `src/store/gameStore.ts`
- `server/game.ts`
- `src/ui/OnlineChest.tsx`
- `src/ui/Zone.tsx`
- `scripts/online-check.ts`

## Próximos ajustes

- Recompensa semanal por presença acumulada.
- Baús cosméticos sem poder de combate para eventos.
- Telemetria agregada de abertura para balancear Gold/Shards.
