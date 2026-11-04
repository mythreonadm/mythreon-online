# Pack 47 — Armazém das Ferramentas

Mineração e Pesca já tinham recursos, cooldown, precisão manual, receitas e ferramentas T1–T5 no catálogo. O elo que faltava era uma fonte explícita para adquirir os tiers avançados.

## Regras

- Picaretas e varas T2–T5 são compradas com gold.
- Cada tier exige a skill correspondente: 20, 40, 60 e 80.
- A compra é bloqueada se a bolsa estiver cheia ou se o jogador já possuir o mesmo tier.
- Ferramentas continuam fora dos slots de combate e devem ser equipadas na tela de profissões.
- Em conta online, a ação passa por `world.command` e o servidor revalida skill, saldo e espaço.

## Custos

| Tier | Skill mínima | Gold |
|---|---:|---:|
| T2 | 20 | 2.000 |
| T3 | 40 | 12.000 |
| T4 | 60 | 60.000 |
| T5 | 80 | 250.000 |

## Arquivos

- `src/data/professions.ts`
- `src/store/gameStore.ts`
- `server/game.ts`
- `src/ui/Professions.tsx`

## Próximo teste

Comprar uma picareta/vara em dois dispositivos, interromper a rede após o clique e confirmar que o `requestId` não duplica a ferramenta nem desconta gold duas vezes.
