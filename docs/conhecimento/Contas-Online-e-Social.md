---
projeto: Mythreon Online
tipo: decisao
status: codigo-publicado-aguardando-servicos
atualizado: 2026-11-02
resumo: Contas Supabase, motor autoritativo, ranking e sistemas sociais; ativação hospedada ainda pendente.
---

# Contas online, ranking e comunidade

## Estado real e autorização

O usuário pediu cadastro real entre PC/celular, ranking, chat, mensagens privadas, VIP, correio e troca bilateral. Ao ser consultado, informou não ter projeto Firebase/Supabase e escolheu preparar Supabase. Código e testes locais foram concluídos; a correção de inicialização foi publicada na Vercel em 9f4285b. Projeto Supabase, SMTP e conexão do banco ainda não foram configurados. Não declarar jogadores conectados em produção nem cadastro público ativo.

Guia operacional: [[docs/ATIVAR_MUNDO_ONLINE|Ativar o mundo online]]. Configuração-modelo sem segredos: .env.example. Nenhuma conta real, mensagem real, projeto Supabase ou cobrança foi criado/enviado. O código foi publicado; isso não equivale à ativação dos serviços.

## Arquitetura e autoridade

- Supabase Auth recebe e-mail/senha, confirma e-mail, mantém sessão e oferece recuperação. A aplicação não armazena senhas online. Conta pode possuir até três personagens com nome único e ID UUID.
- API Node em api/world.js verifica Bearer usando /auth/v1/user. Não confia em um userId enviado pelo navegador nem apenas em decodificar JWT. Exige confirmação de e-mail e valida a origem.
- Postgres, conexão TLS privada DATABASE_URL no servidor. Supabase anon/publishable é pública, DATABASE_URL e service_role nunca entram em VITE_. Compilação recusa secret/service_role no campo público. Não é necessário service_role para a API.
- O motor atual foi isolado em createGameStore(runtime), preservando o useGameStore local. O servidor usa uma instância por operação, sem timers nem localStorage; aplica comandos autorizados sobre o estado real salvo.
- O cliente online envia intenções: equipar UID, sintetizar IDs de componentes, comprar vial por ID etc. Não existe endpoint de substituir o personagem, gold ou inventário por um JSON do cliente.
- Matrizes e vials enviados como objetos pela interface são resolvidos por IDs para os registros reais do servidor. updateSettings aceita somente configurações de automação; não aceita gold, atributos ou premium. Visitas de tutorial têm lista própria e não podem fabricar progresso de kills/treino/síntese.
- Comandos serializados por conta e linhas dos personagens bloqueadas em ordem nas trocas. Transação única inclui débito, crédito, taxa, histórico e recibo. O navegador não escreve diretamente nessas tabelas.
- RLS separa personagens e mensagens privadas por dono/participantes. Rankings expõem somente nome, mapa e métricas, sem e-mail ou inventário.

## Salvamento, tempo e reconexão

O estado compartilhado contém personagem, matrizes, atividade, meditação, morte, último combate e contadores. Consulta a cada três segundos avança somente o tempo realmente decorrido no servidor. Dez polls rápidos não geram dez ticks. Caça/treino continuam como atividade persistida e a volta pode aplicar a simulação offline com os limites existentes; o tutorial conserva suas pausas.

A curva de XP é normalizada no servidor preservando a fração da barra em revisões de balanceamento. HP/MP e atributos são recalculados com as regras existentes. Relógio e RNG vêm do servidor. Ecos/balloons online são disponibilizados por ticks do servidor e consumidos uma única vez; chamar activateBuff arbitrariamente não concede bônus.

Recibos de idempotência são registrados em world_operations por conta + requestId. Repetir o mesmo comando após perda de resposta não repete a transação. O navegador preserva comando pendente em localStorage, antes de enviá-lo e retenta com o mesmo ID; bloqueia novas mutações até resolver uma resposta incerta. Respostas antigas são descartadas por revisão para evitar sobrescrever estado mais novo. Heartbeats não bloqueiam a interface enquanto aguardam rede. Nenhum progresso financeiro offline é aceito como snapshot importável.

O estado local anterior permanece intacto. Há botão Baixar backup na versão local. Não existe migração automática dos personagens locais para a economia online: importação editável de level/gold/itens seria insegura para ranking e trocas. Migração de veteranos permanece pendente de fluxo administrativo validado. Não apagar saves antigos nem apresentar essa separação como migração já concluída.

## Ranking

36 categorias compartilhadas em src/online/rules.ts e projetadas exclusivamente pelo servidor: nível, biomas, maior Tier, descobertas, matrizes nomeadas, sínteses, kills, chefes, gold disponível, tempo de caça/treino, cinco skills, maestria, missões, Beasts, cartas, desmontes, aprimoramentos, trocas, atributos principais, resistências, crítico, XP/gold de caça, danos e valor dos drops. Páginas de cinquenta registros; métricas atualizam quando o personagem é sincronizado. Bônus temporários refletem o último estado calculado, não uma simulação contínua de todos os jogadores offline.

Chefes usam contador vitalício no servidor, sem depender do histórico limitado a cem combates. Gold disponível não inclui o reservado em trocas.

## Comunicação e VIP

Chat global autenticado e mensagens privadas persistidos. Texto máximo de 500 caracteres e intervalo de 1,5 segundo entre mensagens da conta. Renderização como texto React, sem HTML. O painel mostra as cinquenta mensagens globais mais recentes e cem privadas; conversas podem ser filtradas por destinatário. Os registros antigos permanecem no banco, mas ainda não há paginação de todo o histórico.

VIP usa convite/aceite e permite remover/recusar. Presença é baseada em heartbeat confirmado pelo servidor nos últimos noventa segundos, com lista visível limitada a duzentos nomes e contador total separado. Não é o número de sessões autenticadas nem uma prova de conexão instantânea.

Realtime em world_messages/world_friends/world_mail/world_trades invalida a consulta social; a API refaz a leitura autorizada. Há atualização de contingência a cada quinze segundos e botão Atualizar. Nenhuma mensagem privada é transmitida diretamente pelo cliente por canal público.

## Correio e troca

Regras iniciais em ONLINE_RULES: iniciação concluída + nível cinco para enviar transferências; até dez itens por oferta/envio; relíquia UNICO_SIGILO_INICIACAO vinculada. Chat, amigos, ranking e transferências não exigem premium nesta primeira implementação de testes. Esta é uma escolha provisória para validar os fluxos antes de existir contratação premium; não é uma instrução explícita do usuário para revogar o plano antigo de correio premium. Antes da abertura pública, alinhar esse bloqueio com a monetização já planejada. Pagamentos/premium comercial e Market Online permanecem separados.

Taxa: dez gold + ceil(2% do gold transferido), por envio de correio ou por lado da troca. Itens não acrescentam percentual ao cálculo.

- Correio retira anexos/gold/taxa no envio e mantém anexos custodiados. Só o destinatário pode receber, uma vez. Gold vai ao saldo; itens ao depósito. Precisa de espaço no depósito para receber.
- Troca: convite a jogador online, aceite, oferta de cada lado, reserva de gold/taxa/itens no servidor e dois OKs. UID/quantidade devem existir na mochila/depósito; item equipado não pode ser oferecido.
- Qualquer mudança de oferta desfaz ambos os OKs. Revisão antiga é recusada. Recebimento e consumo da taxa ocorrem no mesmo commit quando os dois confirmam. Mesmo quem só recebe paga sua taxa mínima.
- Itens recebidos vão ao depósito, com capacidade validada. Cancelamento devolve gold/taxa e itens reservados; reembolso não perde itens se o depósito estiver cheio.
- Uma troca por personagem de cada vez. Linhas dos dois jogadores são bloqueadas em ordem, inclusive para convidar, para impedir convite concorrente sobre o mesmo personagem.
- Prazo de trinta minutos. Expiração/reembolso são processados na próxima interação com a troca; não há serviço de limpeza agendado independente. O jogador pode abrir/cancelar uma troca expirada para recuperar a reserva.
- Ledger registra envios e conclusão da troca; recibos impedem reaplicação da mesma operação. Histórico de trocas encerradas permanece visível.

## Segurança que não pode ser removida por conveniência

Não habilitar INSERT/UPDATE/DELETE do navegador nas tabelas financeiras. Não criar save remoto que aceite o Character inteiro do cliente. Não permitir importar premium, saldo ou resultado de arena local como verdade. Recompensas de arena local foram bloqueadas no modo online: é necessário validar a partida/resultado no servidor para liberá-las. O modo local continua funcionando como antes.

Ferreiro exige sair da caça também na API; forja/reencanto aceitam apenas equipamentos. As quantidades de venda são limitadas pelo estoque real. O modo online não herda a flag DEBUG do navegador.

## Arquivos

| Camada | Arquivos |
|---|---|
| Banco e RLS | supabase/migrations/001_online_world.sql |
| Publicação Realtime | supabase/migrations/002_realtime.sql |
| Entrypoint publicado | api/world.js → server/generated/online-runtime.cjs |
| API, autenticação e transação | server/http.ts |
| Comandos e métricas | server/game.ts |
| Operações sociais/financeiras | server/world.ts, server/transfers.ts |
| Motor isolável | src/store/gameStore.ts |
| Auth, transporte e sincronização | src/online/client.ts, controller.ts, OnlineSession.tsx |
| Regras compartilhadas | src/online/rules.ts |
| Interfaces | src/ui/OnlineCommunity.tsx, src/App.tsx, src/ui/LandingPage.tsx, src/ui/CommerceBenefits.tsx |
| Evento de bônus autorizado | src/ui/Zone.tsx, src/types/index.ts |
| Backup local | src/utils/saveBackup.ts |
| Hospedagem e Windows | vercel.json, vite.config.ts, desktop/main.cjs |
| Ambiente e tipos | .env.example, tsconfig.server.json, src/vite-env.d.ts, package.json, package-lock.json |
| Desenvolvimento e diagnóstico | scripts/world-dev.ts, online-doctor.mjs |
| Testes | scripts/online-check.ts, run-ts-check.cjs, ts-test-loader.cjs, online-ui-check.cjs, vite-online-test.config.mjs |

A CSP Windows permite somente origens públicas HTTPS/WSS gravadas pela build; preserva isolamento, sem Node no renderer. Executáveis anteriores não foram recompilados com esta migração; recompilar depois de preencher a configuração real.

## Evidências e pendências

- PostgreSQL local em memória (PGlite): propriedade, criação de personagens, tutorial online inicial, RLS, privado inacessível a terceiros, escrita direta negada, VIP, correio repetido, saldo/estoque, escrow, oferta alterada, revisão antiga, dois OKs, taxas e reembolso. Poll rápido não gera XP gratuito; bônus sem evento é recusado.
- Interface com duas contas e terceiro navegador: cliente oficial Supabase com Auth/Realtime de teste local, mensagens por WebSocket, VIP, ranking, janela de troca e mesmo saldo ao relogar no outro aparelho simulado. Não é validação da infraestrutura hospedada.
- typecheck inclui frontend e servidor. Testes anteriores de jornada, vitais, Laboratório e Cérebro continuam disponíveis. Build web não significa publicação.
- Auditoria npm de dependências de produção retornou zero vulnerabilidades no momento da execução; isso não é garantia permanente nem auditoria de segurança independente.

Ainda necessário: projeto Supabase real, migrations e SMTP, variáveis na Vercel, publicação autorizada, teste real de e-mail/recuperação/Realtime em PC/celular, concorrência/carga em staging e política de retenção/moderação. Próximas implementações: migração administrativa de veteranos, resultados de arena autoritativos e expiração agendada. Não esconder esses limites em futuras conversas.

[[docs/ATIVAR_MUNDO_ONLINE|Guia de ativação]] · [[docs/conhecimento/00 - Fonte de conhecimento|Índice autoral]]

### Evidência adicional de middleware e correio

A API também foi testada recusando origem externa, ausência de sessão, token inválido e e-mail não confirmado antes de acessar o banco. Correios ainda não recebidos têm prioridade na caixa para não ficarem inacessíveis sob o limite de histórico recente. Prévias reais do ambiente de teste em docs/anexos/online-teste-ranking.png e online-teste-troca.png; não representam serviço hospedado ativo.

## 2026-11-02 — Ativação e inicialização da API

O usuário pediu ativar o mundo online e informou que ainda não criou projeto Supabase nem possui SMTP. Instalação/conexão de Supabase e Vercel foi solicitada; sem credenciais configuradas no projeto local. O usuário já enviou o commit 17958bf (subindo mundo online). Verificação pública: site retorna HTTP200; GET /api/world retornava HTTP500 FUNCTION_INVOCATION_FAILED, embora o handler devesse retornar405 antes de ler configuração.

Reprodução local em Node ESM simples: import relativo sem extensão falha com ERR_MODULE_NOT_FOUND. Correção: fonte HTTP em server/http.ts, bundle CommonJS primeiro-partido em server/generated/online-runtime.cjs, entrypoint ESModule api/world.js com import explícito .cjs. Gerador scripts/build-online-runtime.mjs; npm run build regenera o bundle antes do Vite. Artefato versionado para não depender da ordem de builds da Vercel; não contém segredos. Nunca editar o artefato manualmente. online:bundle-check verifica correspondência com as fontes.

Teste de runtime Node real scripts/online-runtime-check.mjs: entrypoint importa e responde GET405, POST503 sem configuração, OPTIONS204 e origem externa403. PostgreSQL, typecheck, jornada e vitais verificados. Não confundir essa correção de inicialização com Supabase/banco/e-mails já ativados.

### Verificação pública após publicação de 9f4285b

Push autorizado pela solicitação de ativar o mundo online, concluído em origin/main. Endpoint publicado deixou de falhar na importação: GET /api/world retorna405 JSON, POST sem configuração retorna503 JSON com O mundo online ainda não foi configurado. Site continua HTTP200. Assim, o crash foi corrigido no ambiente hospedado. Supabase e Vercel foram encontrados como integrações disponíveis, mas a última verificação ainda os mostrou não instalados/conectados. O usuário confirmou não ter projeto Supabase nem SMTP. Próximo passo depende de instalar/conectar os serviços; não repetir essa pendência se uma mensagem posterior confirmar a conexão.
