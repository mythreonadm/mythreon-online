# Pack 42 — Histórico de preços no Mercado Negro

> Substituído na interface atual pelo Pack 52: priceStats não abrangia compras do Mercado e não calculava preço por unidade. Ver Pack-52-Mercado-Lotes-e-Precos-Reais-2026-11-04.md. Este arquivo preserva o histórico da implementação anterior.

Data: 04/11/2026  
Estado: implementado localmente

## Objetivo

Dar contexto ao jogador antes da compra ou publicação, sem substituir o preço escolhido pelo vendedor. O Mercado passa a mostrar a referência de vendas reais já registradas para o mesmo item.

## Implementado

- `server/world.ts` consulta `world_trade_item_stats` para os templates presentes na página atual.
- A resposta `market.read` agora inclui `priceStats` com:
  - quantidade de eventos de venda;
  - unidades vendidas;
  - média, menor e maior preço em Gold;
  - média, menor e maior preço em Mythreon Coins;
  - data da última venda.
- `src/ui/OnlineMarket.tsx` exibe, em cada anúncio com histórico, a quantidade de vendas e a faixa/média da moeda selecionada.
- A referência é informativa: o preço anunciado, a taxa e a custódia continuam sendo calculados no servidor.

## Segurança e compatibilidade

Nenhuma operação de compra ou venda foi alterada. A consulta usa apenas estatísticas já agregadas e protegidas por RLS; não expõe identidade de compradores nem histórico privado.

## Próximo passo

Adicionar gráfico temporal e moderação administrativa somente depois de validar o volume real de transações e o playtest concorrente do Mercado.
