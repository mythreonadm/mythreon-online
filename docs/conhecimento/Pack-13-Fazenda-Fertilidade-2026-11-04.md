# Pack 13 — Fazenda: fertilidade e receitas avançadas

Data: 04/11/2026

## Implementado

- Cada canteiro possui fertilidade persistente de 25% a 100%.
- Cada colheita reduz 12 pontos de fertilidade, evitando produção infinita sem planejamento.
- Fertilidade abaixo de 50% reduz o rendimento em uma unidade e aumenta o tempo de crescimento.
- A receita Composto Fértil de Lyss recupera 25 pontos de fertilidade em um canteiro vazio.
- Nova skill Fertilidade registra o uso de composto.
- Novas receitas de progressão: Banquete da Besta e Elixir da Essência.
- Os produtos refinados recebem tiers/raridades coerentes com o custo dos ingredientes.
- A migração corrige saves antigos locais e personagens online sem fertilidade ou skills novas.
- A validação online aceita `fertilizeFarmPlot` como ação controlada pelo servidor.

## Balanceamento

- A fertilidade mínima impede que um canteiro fique inutilizável.
- Composto não pode ser usado em um canteiro plantado.
- O jogador decide entre vender a colheita bruta, refinar por valor ou investir em fertilidade.
- Nenhum custo de semente, rendimento base ou expansão de terreno foi removido.

## Próximo passo

Medir a economia com 20 ciclos de plantio por faixa de nível e ajustar preços/rendimentos somente após dados reais.
