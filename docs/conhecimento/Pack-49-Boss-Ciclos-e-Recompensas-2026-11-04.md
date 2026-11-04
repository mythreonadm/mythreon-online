# Pack 49 — Boss Diário: ciclos e recompensas recuperáveis

## Comportamento

- O painel lista até 50 recompensas não recebidas do personagem, das mais antigas às mais recentes. Após um resgate, a lista carrega as próximas.
- dailyBoss.claim aceita runId de uma batalha anterior; sem ele, mantém compatibilidade com o ciclo atual.
- A consulta encerra ciclos abertos cujo prazo passou. Um resgate explícito também encerra o ciclo vencido antes de validar a recompensa.
- A criação usa conflito da chave única de ciclo e consulta a linha efetivamente criada; duas inicializações não precisam criar dois Bosses.
- Inscrição repetida não reforça HP novamente. O reforço e o teto de quatro vezes o HP-base foram preservados.
- Somente quem causou dano recebe prêmio. O último golpe registra no máximo a vida restante, evitando contribuição inflada por overkill.
- Resgatar vitória antiga não reduz um bônus de XP ainda ativo. Não estende a validade original até o ciclo atual.
- Bolsa e depósito cheios recusam o resgate e preservam a recompensa. Uma tentativa de empilhar parcialmente acontece em cópia antes de escolher o depósito, evitando duplicar a parte já empilhada.
- O painel envia runId também ao entrar/atacar: se o ciclo mudou, o servidor pede atualização. O botão mostra cooldown de 2,5s, e a tela bloqueia envio repetido enquanto uma ação está em andamento.
- Resposta de resgate antigo não substitui o Boss atual da tela.

## Evidências

Validações concluídas nesta rodada: online:check, typecheck e build. O runtime da API foi regenerado pelo build; permanece o aviso conhecido de chunk principal acima de 500 kB. Não houve publicação.

online:check passou em PGlite usando handleWorld real: duas contas inscritas no mesmo HP compartilhado; inscrição repetida sem novo reforço; último golpe limitado a 1 HP; recusa de recompensa sem dano; descoberta de ciclo antigo; recusa de terceiros; rollback com bolsa/depósito cheios; resgate antigo idempotente; preservação de bônus mais recente; stack quase cheio com depósito sem duplicação.

## Arquivos de implementação

- server/world.ts
- src/ui/DailyBoss.tsx
- scripts/online-check.ts

Não há migração de schema. O runtime é regenerado pelo build.

## Limites e sequência

As janelas existentes continuam UTC (00h, 08h e 16h); não foram renomeadas nem migradas. A consulta processa encerramentos de forma preguiçosa, sem agendador independente.

Os testes de três usuários rodam em uma conexão serializada. Não comprovam concorrência em múltiplas conexões, carga ou experiência em celular. Ainda faltam cenário/mapa cooperativo completo, apresentação dos ataques dos participantes, reação/dano do Boss, testes de escala e balanceamento real. A criação concorrente usa a constraint já existente, mas precisa de teste com conexões PostgreSQL independentes antes de abrir o servidor.
