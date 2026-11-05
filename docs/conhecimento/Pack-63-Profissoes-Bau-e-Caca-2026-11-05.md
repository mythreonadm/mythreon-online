---
projeto: Mythreon Online
tipo: entrega
status: implementado-localmente
data: 2026-11-05
resumo: Pulso online tolerante à latência, continuidade de caça após reconciliação e trilha diária do Baú do Refúgio.
---

# Pack 63 — pulso online, caça estável e Baú do Refúgio

## Correções entregues

### Pesca e mineração

Os comandos `beginProfessionChallenge`, `finishProfessionChallenge` e `cancelProfessionChallenge` são ações server-only. O controlador online não tenta validá-los como se fossem métodos locais do Zustand; ele os envia diretamente ao runtime autoritativo. Isso elimina o caminho que podia deixar a UI fora de sincronia depois do primeiro minério.

A tolerância de entrega do pulso passou de 750 ms para 5 s. O início, o alvo, a recarga, a ferramenta, a skill, a isca, a bolsa e o uso único continuam verificados no servidor. A janela ficou mais justa para celular e redes móveis sem aceitar nota ou horário enviado pelo cliente.

### Caça que volta ao Refúgio

Durante a reconciliação online, `tick()` usa `character.currentZoneId` como fonte de verdade, em vez de interromper a caça por um frame em que `currentZoneId` ainda esteja antigo. O servidor também responde com erro explícito se `startHunting` não conseguir iniciar, em vez de aceitar silenciosamente uma ação que deixaria a tela no Refúgio.

Saves antigos em que a iniciação ficou sem uma missão tutorial ativa continuam podendo caçar depois da introdução. Isso evita travar uma conta entre etapas; o Diário de Missões permanece disponível para retomar a iniciação.

### Baú do Refúgio

O baú agora é uma trilha diária em UTC, com cinco marcos cumulativos:

| Marco | Recompensa base |
| --- | --- |
| 5 minutos | 300 gold + 1 Mythreon Shard |
| 30 minutos | 1.000 gold + 2 Shards |
| 2 horas | 3.500 gold + 5 Shards |
| 6 horas | 10.000 gold + 10 Shards |
| 12 horas | 25.000 gold + 25 Shards |

O nível acrescenta um pequeno componente de gold e shards. Cada marco pode ser resgatado uma vez por dia; o contador não é consumido ao abrir, e o dia seguinte zera tempo e marcos. Isso mantém o benefício de presença valorizável sem criar um gerador infinito de moeda.

## Arquivos autorais

- `src/data/onlineChest.ts` — marcos, chave UTC e normalização diária.
- `src/types/index.ts` e `src/engine/save.ts` — estado persistido do baú.
- `src/store/gameStore.ts` — normalização, recompensa, fonte da zona ativa e continuidade.
- `src/ui/OnlineChest.tsx` — trilha visual dos cinco marcos.
- `src/engine/professionChallenge.ts` — tolerância de confirmação.
- `src/online/controller.ts` — envio direto de ações server-only de profissão.
- `src/engine/journey.ts` — recuperação de saves sem missão ativa.
- `server/game.ts` — validação explícita do início da caça.
- `scripts/online-check.ts` — regressão do baú diário.
- `server/generated/online-runtime.cjs` e `server/generated/premium-runtime.cjs` — runtimes regenerados.

## Validações executadas

- `npm run typecheck` passou.
- `npm run professions:pulse-check` passou.
- `npm run online:check` passou.
- `npm run journey:check` passou com a regressão da caça contínua.
- `npm run online:bundle-check` passou.
- `npm run build` passou; permanece apenas o aviso conhecido do chunk principal acima de 500 kB.
- `git diff --check` passou.

Não houve commit, push, deploy ou alteração de schema. Depois do deploy, validar em uma sessão real: iniciar um mapa e permanecer por vários abates, concluir um minério, pescar em seguida, abrir os cinco marcos do baú em dias diferentes e repetir o fluxo em rede móvel.

[[docs/conhecimento/Pack-62-Caca-Coleta-e-Pets-2026-11-05|Pack 62]] · [[docs/conhecimento/Registro de problemas|Registro de problemas]] · [[docs/conhecimento/00 - Fonte de conhecimento|Fonte de conhecimento]]
