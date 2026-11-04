# Pack 32 — Cartas aplicadas aos atributos da hunt

Data: 04/11/2026  
Status: implementado localmente e coberto por teste de regressão.

## Objetivo

Fazer a formação de Cards Colecionáveis participar do combate normal sem permitir que ela substitua equipamento, Matriz ou Besta Divina. Antes deste pack, os Cards já apareciam no Álbum, Gear Score e cálculo de poder do PvP, mas o jogador não recebia os bônus durante a hunt.

## Regra de balanceamento

Cada carta equipada continua limitada ao loadout de até cinco cartas e passa a contribuir com uma escala moderada dos atributos do template, antes dos caps normais de `recalcStats`:

- HP: 15% do valor da carta;
- ATK: 20% do valor da carta;
- DEF: 15% do valor da carta;
- SPD: 0,2% do valor da carta (mantendo velocidade como bônus pequeno).

Cartas ausentes, inválidas ou que não pertençam à coleção são ignoradas pelo cálculo. A validação do comando `setCardLoadout` continua impedindo que o cliente equipe UIDs não possuídos.

## Arquivos principais

- `src/engine/stats.ts`: soma os bônus de cartas no recálculo autoritativo dos atributos.
- `src/store/gameStore.ts`: recalcula os atributos imediatamente após salvar a formação local.
- `src/ui/CardAlbum.tsx`: comunica que os bônus afetam hunt, Gear Score e duelo.
- `scripts/online-check.ts`: verifica aumento de HP/ATK ao equipar uma carta e rejeição de carta não possuída.

## Verificação

- `npm run typecheck`
- `npm run online:check`
- `npm run build`
- `npm run online:bundle-check`

## Próximos passos

1. Exibir no painel de Personagem a origem “Cards” separada dos demais modificadores.
2. Criar recompensas de temporada e ranking de coleção sem alterar a autoridade do servidor.
3. Fazer playtest com cinco cartas em personagens de níveis diferentes para confirmar que os pesos continuam complementares.

## Continuidade — Pack 59

Os pesos continuam iguais, mas passaram à fonte única src/engine/cardCollection.ts. Álbum e Personagem mostram a parcela aplicada, separada do atributo bruto. Evolução1–5 por gold/cópias livres recalcula os mesmos bônus; UID e espécie principal permanecem. [[docs/conhecimento/Pack-59-Cards-Evolucao-e-Bonus-Reais-2026-11-04|Regras, arquivos e evidências]].
