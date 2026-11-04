# Pack 14 — Personalização visual do humano

Data: 04/11/2026

## Implementado

- A forma humana usa o sprite base `assets/players/humano-v2.png` tanto em Personagem como durante a caça.
- Pele, cor do cabelo e cor da roupa continuam aplicadas com o filtro visual salvo na aparência.
- O painel de Personagem exibe a identidade atual do aventureiro e os principais detalhes escolhidos.
- Quando uma Matriz está ativa, a arte da linhagem continua sendo usada sem receber filtros da aparência humana.
- A troca entre humano e linhagem força o recarregamento visual para não manter a imagem anterior em cache.

## Limites

Este pack não altera atributos, dano, equipamentos ou regras de gameplay. As formas específicas de cabelo, roupa e corpo ainda podem receber sprites dedicados em um pack artístico posterior.
