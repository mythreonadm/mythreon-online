---
projeto: Mythreon Online
tipo: sistema
status: implementado-localmente
atualizado: 2026-11-05
---

# Encantamentos Únicos

## Regra de design

Um equipamento Incomum ou superior pode receber **um único Encantamento Único**. O aspecto é persistido dentro do item, acompanha mochila, depósito, equipamento e save online, e não substitui upgrade, tier ou afixos.

## Aquisição

Cada bioma possui uma Runa Encantada própria. A runa cai raramente de criaturas derrotadas; chefes têm chance maior e variantes Elite têm chance intermediária. O jogador precisa reunir 100 runas do mesmo mapa e pagar gold no Ferreiro. O custo é autoritativo e cresce com `tier × (upgradeLevel + 1)`; o cliente não pode enviar um valor de custo.

| Mapa | Aspecto | Elemento/efeito | Runa |
|---|---|---|---|
| Bosque de Lyss | Aspecto da Vida | Sagrado, radiante, pequena sorte | `RUNA_ENCANTADA_BOSQUE_LYSS` |
| Pico de Dhor | Aspecto Flamejante | Fogo, incandescente | `RUNA_ENCANTADA_PICO_DHOR` |
| Mar de Azhar | Aspecto Congelado | Gelo, congelante | `RUNA_ENCANTADA_MAR_AZHAR` |
| Pântano de Veyra | Aspecto Envenenado | Veneno, envenenado | `RUNA_ENCANTADA_PANTANO_VEYRA` |
| Ruínas de Asterion | Aspecto Eletrizante | Eletricidade, eletrocutado | `RUNA_ENCANTADA_RUINAS_ASTERION` |
| Deserto de Kaelor | Aspecto da Sorte | Sorte, afortunado | `RUNA_ENCANTADA_DESERTO_KAELOR` |
| Cicatriz Profunda | Aspecto Sombrio | Morte, sangrante | `RUNA_ENCANTADA_CICATRIZ_PROFUNDA` |

O catálogo já reserva aspectos de vento, terra, água, psíquico e metal para novos mapas/variantes sem alterar a regra de um aspecto por item.

## Efeito por peça

- **Arma:** usa o elemento do aspecto e adiciona dano elemental passivo proporcional ao dano causado. No Tier do item, parte de 10% e escala suavemente até Tier 5.
- **Flecha:** o aspecto só participa do cálculo quando existe um arco equipado, respeitando a regra de que flecha não concede atributo fora do arco.
- **Armadura, escudo e joias:** adiciona resistência elemental do aspecto. O aspecto da sorte também concede Luck.
- **Visual:** `ItemIcon` acrescenta uma aura animada por elemento (`flamejante`, `congelado`, `eletrizante`, `envenenado`, `sombrio`, `lyss`, `sorte`). A animação respeita `prefers-reduced-motion`.

## Fluxo online e proteção

`enchantItem(uid, zoneId)` só é aceito no servidor, valida mapa, categoria, raridade, ausência de encantamento, quantidade de runas e gold. O Ferreiro fica bloqueado durante a caça. A operação cobra os recursos, grava o encantamento e recalcula os stats; falhas não alteram o personagem.

## Arquivos responsáveis

- `src/types/index.ts` — `ItemEnchantment` e campo `Item.enchantment`.
- `src/data/enchantments.ts` — catálogo, runas e escala dos Tiers.
- `src/engine/forge.ts` — custo e operação atômica de imbuir.
- `src/engine/combat.ts` — drop das runas e dano elemental passivo.
- `src/engine/stats.ts` — resistências e Luck de peças encantadas.
- `src/store/gameStore.ts` — ação local/online e persistência.
- `server/game.ts` — validação autoritativa do comando.
- `src/ui/Shop.tsx` — painel do Ferreiro.
- `src/ui/ItemIcon.tsx`, `src/index.css` — aura visual e tooltip.

## Validação desta entrega

- `npm run typecheck` passou.
- `npm run build` passou.
- `npm run online:bundle-check` passou após recompilar o runtime.
- `npm run brain:check` e `npm run journal:check` passaram.
- Teste isolado: Espada Incomum T2 + 100 runas de Dhor + 10.000 gold resultou em Aspecto Flamejante e cobrou 2.000 gold.
- `npm run online:check` continua com uma falha histórica e independente na expectativa do calendário (`1 !== 0`); não foi introduzida por este sistema.

## Próximas melhorias

1. Criar sprites dedicadas das runas e efeitos em `public/assets/items/`.
2. Adicionar tooltip detalhado com fórmula e resistência ao passar o mouse no item encantado.
3. Exibir a origem da runa no bestiário e no registro de combate.
4. Fazer simulação de DPS/resistência para calibrar o intervalo de 10% a 13,2% por Tier antes do lançamento público.
