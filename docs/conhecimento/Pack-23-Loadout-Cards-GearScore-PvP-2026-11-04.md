# Pack 23 — Loadout de Cards, Gear Score e PvP

## Entrega

- A personagem agora possui `cardLoadout`, uma formação persistente de até cinco cartas.
- A Arena permite salvar a formação escolhida. A interface continua permitindo trocar o tamanho da equipe para 1, 3 ou 5 cartas.
- Cartas equipadas entram no Gear Score através de HP, ATK, DEF e velocidade, usando pesos pequenos e auditáveis.
- O cálculo autoritativo de poder do PvP online considera a mesma formação salva. A coleção inteira não aumenta poder; apenas cartas equipadas.
- O servidor valida que cada UID pertence à coleção da personagem e limita o loadout a cinco cartas.

## Regras de balanceamento

- Cartas são uma camada complementar: não substituem equipamento, matriz ou Besta Divina.
- O bônus é calculado com os atributos da carta no nível atual e não recebe bônus de premium.
- Formação vazia continua válida para quem ainda não encontrou cartas.
- Trocar a formação não altera a caça, o inventário, os drops ou as regras de gameplay.

## Arquivos

- `src/types/index.ts` — campo `cardLoadout`.
- `src/engine/save.ts` — defaults e migração de saves antigos.
- `src/engine/gearScore.ts` — pontuação de cartas equipadas.
- `src/store/gameStore.ts` — ação `setCardLoadout`.
- `src/ui/ArenaDuelos.tsx` — salvar formação.
- `server/game.ts` — validação online do comando.
- `server/world.ts` — poder de PvP autoritativo.

## Próxima fatia

1. Mostrar o bônus de cada carta no painel de personagem.
2. Aplicar cartas ao matchmaking e ao resumo de combate, sem permitir poções no PvP.
3. Criar temporadas, fila e replay de partidas.
