# Pack 36 — Cosméticos online e aplicação visual

Data: 04/11/2026  
Status: implementado localmente; publicação continua dependente de revisão e deploy.

## Objetivo

Concluir a camada visual de skins, luminescências e addons sem transformar cosméticos em poder de combate. O loadout continua separado de `baseStats`, Gear Score, dano, defesa, XP, drops, velocidade e regras de PvP.

## O que entrou

- Catálogo visual central em `src/utils/cosmetics.ts`, com identificadores estáveis para Manto da Nebulosa, Capa do Primeiro Canto, Luminescência da Matriz e Addon do Boss Luminescente.
- O sprite do personagem na hunt e no painel de Personagem passa a receber a classe visual do cosmético equipado.
- O Pet ativo recebe a aura cosmética selecionada, sem substituir a Matriz e sem remover o companheiro.
- Efeitos usam CSS leve, têm fallback visual e respeitam `prefers-reduced-motion` já existente.
- A tela de Personagem informa quais cosméticos estão ativos, permitindo auditoria visual pelo jogador.
- O comando online `equipCosmetic` foi coberto com teste de propriedade: item possuído equipa e persiste; item não possuído é rejeitado.

## Arquivos alterados

- `src/utils/cosmetics.ts`
- `src/ui/Zone.tsx`
- `src/ui/Personagem.tsx`
- `src/index.css`
- `scripts/online-check.ts`

## Limites conhecidos

- A arte final de cada skin/addon ainda depende dos PNG/GIF que serão colocados em `public/assets/items/` e `public/assets/players/`.
- O efeito visual é aplicado como aura/classe até existir atlas individual de capa, roupa e partículas.
- Falta validar em celulares reais, dispositivos com aceleração reduzida e em duas contas online simultâneas.

## Evidência esperada

Executar `npm run typecheck`, `npm run online:check`, `npm run build`, `npm run online:bundle-check`, `npm run journey:check`, `npm run brain:sync`, `npm run brain:check` e `git diff --check`.

## Revisão pelo Pack 55 — 04/11/2026

A inspeção confirmou que o campo de aura do Pet não possuía uma atribuição alcançável pelos prefixos anteriores. A frase acima não era evidência de ativação funcional dessa aura. [[docs/conhecimento/Pack-55-Guarda-Roupa-Skins-e-Auras-2026-11-04|Pack55]] adiciona item/slot explícitos, comando de remoção, verificação de propriedade após negociação e apresentação HeroArt compartilhada. A sprite mensal completa e a arte do addon agora foram testadas; Manto da Nebulosa ainda depende de PNG próprio.
