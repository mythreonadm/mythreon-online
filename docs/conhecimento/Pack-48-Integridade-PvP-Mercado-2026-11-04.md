# Pack 48 — Integridade de PvP, Mercado e ferramentas

## Correções implementadas

- PvP por turnos: o atacante que zera a vida adversária vence. Antes, o encerramento recalculava o maior power e podia premiar o personagem derrotado.
- A resolução legada por power é recusada em partidas com turno ativo, impedindo pular a batalha.
- Desafios por nome consultam o estado real do oponente para definir HP inicial e rating.
- Ligas escolhem a maior faixa atingida; a busca ascendente anterior retornava Bronze para qualquer rating.
- O vendedor recupera anúncios expirados pelo botão “Recuperar item”, usando a mesma transação de cancelamento. A mudança para cancelled impede segundo resgate.
- Taxa do Mercado fica limitada ao preço. Anúncios baratos antigos também recebem esse limite no fechamento; a interface identifica a taxa como desconto do vendedor.
- Compra de ferramentas recusa um template já presente na mochila, no depósito ou equipado, também no servidor.

## Evidências automatizadas

scripts/online-check.ts cobre combate até o fim por turnos, recusa do atalho pvp.resolve, vitória por nocaute contra adversário de power maior, HP do desafiado, fronteiras das cinco ligas, recuperação de anúncio expirado apenas pelo dono, repetição do mesmo requestId, recusa de segundo resgate com outro requestId, venda por 1 gold sem saldo negativo e recusa de ferramenta duplicada.

Os cenários usam PGlite local e a API de domínio real. Não demonstram concorrência entre conexões PostgreSQL independentes, rede real ou experiência visual em aparelhos.

Validação executada: online:check passou com os cenários acima; typecheck passou para cliente e servidor; build passou e regenerou o runtime de API; brain:check passou; git diff --check não apontou erro de whitespace. O build mantém o aviso conhecido de chunk principal acima de 500 kB. Revisão React das mudanças incrementais: sem novos hooks condicionais, efeitos ou listeners; identificadores dos itens preservados e botões de recuperação ligados à mesma operação autoritativa.

## Publicação

Sem alteração de schema ou migração de dados. As fontes e o runtime precisam do próximo deploy autorizado para chegar aos jogadores. Nenhum deploy foi realizado nesta rodada.

## Continuidade

Ainda faltam coleta de métricas reais de balanceamento, Boss Diário em múltiplas contas, moderação e histórico gráfico do Mercado, conclusão comercial do checkout e testes mobile. Ver backlog consolidado. O Pack 46 não comprova correção total da latência: executeOnlineAction já aplicava a resposta antes da aplicação repetida adicionada naquele pack; é necessário testar/reconciliar a fila de prévias otimistas em cliques rápidos.
