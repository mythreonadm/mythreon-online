# Loja Mythreon — economia, Premium e monetização segura

## Objetivo

A Loja Mythreon financia o desenvolvimento sem transformar pagamento em vitória automática. A progressão principal continua vindo de caça, treino, matrizes, Bestas Divinas/Pets, fazenda e boas builds.

## Mythreon Coins

- Referência comercial inicial: **1.000 Mythreon Coins = R$ 1,00**.
- Pacotes preparados: 1.000 (R$1), 5.500 (R$5), 12.000 (R$10) e 65.000 (R$50).
- Coins também podem ser refinadas no jogo usando Mythreon Shards + gold, conforme a economia vigente.
- O navegador nunca cria Coins sozinho. A futura compra real deve passar por checkout externo e webhook assinado no servidor; a variável `VITE_MYTHREON_CHECKOUT_URL` apenas aponta o botão para esse checkout.
- Toda concessão de Coins deve ser idempotente, auditável e vinculada ao usuário/ID da transação.

## Premium Account

Benefícios planejados:

- +10% de XP online e offline;
- auto-venda de loot configurável por raridade e por item;
- treino offline estendido e bônus de treino;
- prioridade cosmética, efeitos e missões de temporada;
- acesso antecipado a recursos sociais, Market e correio quando esses módulos estiverem liberados;
- suporte e histórico de transações.

Premium não garante dano, drop raro, vitória em duelo ou item lendário. Jogadores gratuitos podem superar uma conta Premium com build, treino e dedicação melhores.

Planos comerciais preparados para checkout: 30 dias (R$ 4,90), 90 dias (R$ 12,90) e 365 dias (R$ 39,90). Eles aparecem como “preparar contratação” até que o checkout e o webhook sejam conectados; o cliente não ativa Premium por conta própria.

## Itens de progressão

### Tomo da Sabedoria Eterna

Concede **+20% de dano de habilidade** durante 1h, 4h, 12h ou 24h. O tomo eterno mantém o efeito permanente. O bônus é aplicado no perfil de combate e não altera dano básico, drop ou XP.

### Itens equipáveis de apoio

Itens da loja podem facilitar uma rota ou corrigir uma build, mas não devem possuir os maiores valores possíveis do jogo. O objetivo é oferecer conveniência e alternativas, não substituir a caça e o Ferreiro.

### Ovos de Besta Divina/Pet

Ovos T3, T4 e T5 podem ser adquiridos por Coins. A eclosão continua aleatória e respeita a tabela de raridades; adquirir o ovo não garante um Pet lendário.

### Baú de Suprimentos

Entrega uma recompensa controlada de fragmentos e materiais. É uma fonte de conveniência, não uma rota ilimitada de itens de topo.

### Chave da Roleta Arcana

Consome uma chave e sorteia no servidor entre gold, fragmentos, ovos e suprimentos. O resultado deve ser registrado no histórico e nunca decidido apenas pelo cliente.

### Skins e luminescência

Skins, Mantos e Luminescência de Matriz/Pet são cosméticos. Não concedem atributos ocultos. Quando houver efeitos de brilho, eles devem ser claramente marcados como visuais.

## Salvaguardas de economia

- preços, duração e tabelas ficam em catálogo versionado;
- nenhuma compra aceita valores definidos pelo cliente;
- ações online são validadas em `server/game.ts`;
- recompensas e saldo são gravados no servidor;
- compras futuras devem registrar `provider`, `transaction_id`, `user_id`, `coins`, `status`, `created_at` e `fulfilled_at`;
- reembolsos e chargebacks removem apenas o saldo ainda disponível, nunca itens que já foram consumidos sem revisão administrativa.

## Pendências para produção

1. Conectar checkout real e webhook assinado.
2. Criar tabela de transações e função idempotente de concessão de Coins.
3. Adicionar limites, logs administrativos e política de reembolso.
4. Testar todos os pacotes em ambiente de homologação antes de abrir a venda.
