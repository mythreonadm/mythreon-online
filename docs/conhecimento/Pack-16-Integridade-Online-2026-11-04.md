# Pack 16 — Integridade online e ações idempotentes

Data: 04/11/2026

## Objetivo

Eliminar a janela de duplicação que existia quando a mesma ação online chegava duas vezes antes da primeira confirmação. O problema era especialmente sensível em correio, troca, venda, forja e comandos que movimentam gold, Coins ou itens.

## Alteração aplicada

O servidor agora reserva o `requestId` em `world_operations` antes de executar qualquer efeito:

1. A primeira requisição cria uma reserva vazia.
2. O comando é executado dentro da transação atual.
3. A resposta final é gravada na mesma reserva.
4. Uma repetição do mesmo `requestId` devolve a resposta já gravada.
5. Se a primeira chamada ainda estiver em andamento, a segunda é recusada com uma mensagem segura, sem executar novamente.

Em caso de erro, a transação desfaz também a reserva, permitindo uma nova tentativa legítima.

## Proteções mantidas

- `FOR UPDATE` continua protegendo personagens, ofertas e mensagens sensíveis.
- Revisionamento continua impedindo confirmar uma troca com oferta antiga.
- Escrow continua retirando os itens antes da troca e devolvendo-os no cancelamento.
- Correio continua idempotente por `requestId` e por estado de recebimento.
- RLS permanece isolando personagens, inventários, mensagens, correios e trocas.
- O cliente mantém o mesmo identificador durante retry e recuperação após queda de conexão.

## Validação

O `online:check` confirmou novamente:

- envio de correio repetido com o mesmo request sem duplicar registro;
- recebimento de correio apenas uma vez;
- revisão antiga de troca recusada;
- ofertas alteradas zerando as confirmações;
- cancelamento devolvendo escrow;
- histórico e estatísticas de troca preservados;
- RLS impedindo leitura e escrita por terceiros;
- autoridade de gameplay mantida no servidor.

## Próximo teste recomendado

Executar duas ações reais em abas/dispositivos diferentes com a mesma conta e observar a mensagem de confirmação. Depois testar queda de rede durante uma troca e recarregar a página: o cliente deve recuperar o mesmo `requestId`, concluir uma única vez e não duplicar gold, itens ou Pets.

## Integração com a memória

Este documento e a alteração do servidor entram no Cérebro Mythreon e no Obsidian via `npm run brain:sync`.
