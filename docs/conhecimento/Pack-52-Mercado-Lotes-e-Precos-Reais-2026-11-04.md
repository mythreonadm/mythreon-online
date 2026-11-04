# Pack 52 — Lotes e preços reais do Mercado Negro

## Diagnóstico

O campo priceStats do Pack 42 vinha somente de world_trade_item_stats: não incluía as compras de world_market_listings, misturava moeda e comparava o preço do lote com preço de unidade. A nova interface usa salesHistory, calculado diretamente a partir dos registros concluídos. O campo antigo permanece na resposta para compatibilidade, sem ser a referência da interface atual.

## Regra de comparação

Agrupamento por template, raridade, tier, upgrade e moeda. A média é ponderada por unidades: soma dos preços pagos / soma das quantidades. Mínimo e máximo também são por unidade, antes da taxa do vendedor.

Entram compras concluídas no Mercado e trocas diretas em que um único tipo/variante de item é vendido por uma única moeda, sem itens na contraparte. Ficam fora presentes gratuitos, permutas, pagamento misto, lotes com itens diferentes e anúncios abertos/cancelados/expirados.

Totais cobrem o histórico disponível. A série diária cobre os últimos 30 dias, em UTC, somente dias com vendas. O gráfico posiciona os pontos pelas datas; não preenche dias sem negócio. Nenhuma conversão Gold/Coins é feita. Atributos sorteados podem explicar preços diferentes dentro de uma mesma variante.

## Interface

- Quantidade do lote entre 1 e o estoque disponível, até 999; equipamentos não empilháveis continuam unitários.
- Preço total inteiro; preço por unidade, taxa e recebimento líquido aparecem antes de publicar.
- Comprador paga o lote inteiro e o recebe no depósito; não há compra parcial de anúncio nesta etapa.
- Histórico fica disponível no anúncio e ao selecionar um item para vender, mesmo sem oferta ativa daquele template.
- Gráfico, tabela diária, volume, faixa e última venda em detalhes expansíveis.
- Respostas antigas de filtros não substituem uma consulta mais recente; trava local evita envio duplo durante a ação. Autoridade/idempotência seguem no servidor.
- Meus anúncios não esconde mais entradas a partir da nona dentro do limite retornado pela API (50).

## Evidências

online:check passou com mercado e trade reais de domínio em PGlite:

- duas vendas de 5/2 unidades por 500/100 gold: 600/7 = 85,71 por unidade;
- venda em Coins separada, replay sem duplicar evento;
- integração da venda direta comparável com venda do Mercado;
- variante +2 separada da +0;
- tabela diária em dois dias e anúncio aberto/cancelado fora da média;
- permuta e lote de itens diferentes concluídos pelo fluxo de trade sem contaminar a referência.

typecheck e build passaram. A prévia Electron scripts/market-ui-check.cjs passou em PC e 390px: formulário de lote de 5 por 1000, taxa 50, líquido 950, histórico/gráfico e clique repetido gerando um único comando. Capturas inspecionadas em node_modules/.cache/market-ui/. O teste de UI usa fixtures e não realiza compras reais.

## Arquivos

server/marketAnalytics.ts, server/world.ts, src/types/market.ts, src/ui/MarketPriceHistory.tsx, src/ui/OnlineMarket.tsx e scripts de teste online/interface. Sem migration de schema.

## Limites

O histórico é uma referência, não avaliação de sinergia/afixos nem mecanismo antifraude. Carga da agregação com grande volume ainda precisa de medição; pode exigir agregados persistidos e índices adicionais. A view/tabela legada usada por clientes antigos não foi reescrita. Moderação, prevenção de manipulação de preços, concorrência em conexões independentes e homologação de produção continuam pendentes. Nenhum push/deploy foi realizado.
