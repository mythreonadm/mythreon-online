# Trade online, links de item e Mythreon Coins

## Estado implementado

- O botão **Linkar no chat** usa o formato seguro `[[MYTHREON_ITEM:...]]`, contendo apenas dados públicos do item (template, nome, raridade, tier, upgrade e até oito atributos).
- O botão **Anunciar no Trade** abre o canal de Trade com o link pronto para o jogador acrescentar preço e descrição.
- A Comunidade possui Chat Mundial, Chat de Trade, Chat de Help, mensagens privadas, VIP, Correio e Trocas.
- A mensagem é persistida no servidor com canal validado (`global`, `trade` ou `help`) e atualizada por Realtime/polling.
- A troca direta agora reserva e transfere Gold, Mythreon Coins e itens dentro de uma transação do servidor. Os dois jogadores precisam confirmar novamente após qualquer alteração.
- O Correio também aceita Gold, Mythreon Coins e itens; o recebimento só ocorre uma vez e respeita o limite do depósito.
- O histórico de trocas registra preços em Gold e Mythreon Coins. A tabela agregada do mercado calcula preço médio, mínimo e máximo nas duas moedas sem expor o conteúdo privado das ofertas.

## Segurança

- O cliente nunca decide o saldo final: o servidor valida inteiros seguros, saldo disponível, itens pertencentes ao personagem, limite de itens e relíquia vinculada.
- A taxa da troca continua em Gold (`10 + 2% do Gold oferecido`); Mythreon Coins não substituem a taxa.
- Anúncio no Chat de Trade é apenas divulgação. A entrega segura ocorre somente pela aba **Trocas**, com reserva e confirmação dos dois lados.
- As migrations `005_online_trade_coins.sql` e `006_market_stats_rls.sql` precisam existir no projeto Supabase antes do deploy que usar moedas no online. Elas já foram aplicadas no projeto conectado.

## Arquivos principais

- `src/ui/itemChat.ts`
- `src/ui/ItemModal.tsx`
- `src/ui/CombatCommunity.tsx`
- `src/ui/OnlineCommunity.tsx`
- `server/transfers.ts`
- `server/world.ts`
- `supabase/migrations/005_online_trade_coins.sql`
- `supabase/migrations/006_market_stats_rls.sql`

## Próximos passos

1. Aplicar a migration no Supabase.
2. Fazer build e publicar a versão web.
3. Testar: link normal, anúncio no Trade, troca Gold + Coins + item, cancelamento, expiração, correio e histórico.
4. Futuramente, criar anúncios com escrow e botão **Comprar**; o chat atual permanece deliberadamente separado do mercado para evitar transferências fora do fluxo seguro.
