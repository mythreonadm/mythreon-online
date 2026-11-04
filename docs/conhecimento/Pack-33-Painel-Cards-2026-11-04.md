# Pack 33 — Painel de origem dos bônus de Cards

Data: 04/11/2026  
Status: implementado localmente.

## O que entrou

O painel de Personagem agora mostra uma seção própria para a formação equipada, com o total de HP, ATK, DEF e velocidade recebido dos Cards. A mensagem deixa explícito que esses bônus são complementares e entram na hunt, no Gear Score e no duelo.

## Regra de consistência

O painel reutiliza exatamente os mesmos pesos do cálculo central (`15% HP`, `20% ATK`, `15% DEF`, `0,2% SPD`). Assim, o valor exibido não cria uma segunda regra de combate: ele apenas explica a origem do que já foi aplicado por `recalcStats`.

## Arquivo alterado

- `src/ui/Personagem.tsx`

## Próximo passo

Adicionar uma visão opcional de detalhamento por carta e um histórico sazonal de coleção, sem aumentar o poder fora dos caps já existentes.

## Continuidade — Pack 59

Detalhamento por carta e evolução estão no Álbum; Personagem agora usa formationBonus compartilhado e mostra frações sem truncá-las (ex.+3,3DEF). Índice, hunt e PvP usam helpers comuns e limite defensivo de5 UIDs válidos. [[docs/conhecimento/Pack-59-Cards-Evolucao-e-Bonus-Reais-2026-11-04|Regras e evidências]].
