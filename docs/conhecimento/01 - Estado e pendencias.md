---
projeto: Mythreon Online
tipo: projeto
status: parcial
atualizado: 2026-11-02
resumo: Estado resumido do produto, cobertura documental e próximo trabalho.
---

# Estado e pendências

## Implementado e documentado

- Combate idle, itens, equipamento, elementos e relatórios: [[docs/conhecimento/Balanceamento-Combate-Economia]].
- Matriz e Divine Beast são caminhos exclusivos; Beasts têm ataques e crescimento: [[docs/conhecimento/Shop-Premium-Beasts]].
- Treino com maestria e conquistas: [[docs/conhecimento/Treino-e-Diferenciais-Mythreon]].
- Laboratório com simulações isoladas e primeira versão Windows: [[docs/conhecimento/Laboratorio-de-Builds-e-Windows]].
- Tutorial, Ferreiro, inventário, mortes/Bless, quests e Wiki já existem; detalhes e arquivos responsáveis estão no [[CEREBRO_MYTHREON]]. As partes ainda sem nota própria precisam ser extraídas e conferidas antes de alterar regras.

## Pendências reais

- [ ] Playtests prolongados de hunt, treino e economia; amostras isoladas não cobrem toda campanha.
- [ ] Migração de saves navegador/Windows e assinatura digital do executável.
- [ ] Resolver erros históricos da checagem global TypeScript e revisar avisos da cadeia de build.
- [ ] Backend autoritativo antes de Market, correio, nuvem e contratação premium.
- [ ] Completar artes e ampliar estados de animação sem mudar regras inadvertidamente.
- [ ] Consolidar lore, classes/Matrizes, quests e regras de inventário em notas próprias com evidências do código.
- [ ] Avaliar Cicatrizes da Essência e demais propostas; ainda não estão implementadas.

## Regra de atualização

Após cada tarefa: atualizar a nota original do sistema, registrar decisão/evidências/pendências, acrescentar continuidade ao Cérebro e executar sincronização. O observador atualiza catálogo e relações, não resolve nem interpreta essas pendências sozinho.

[[docs/conhecimento/00 - Fonte de conhecimento|Índice de conhecimento]] · [[docs/conhecimento/Registro de problemas|Problemas]]

## Jornada guiada e expansão de biomas — 2026-11-02

Implementados localmente: prólogo, 14 etapas graduais de iniciação, pausa ao completar objetivos, recursos didáticos garantidos, XP inicial gradual, seis contratos de NPC por gold/componentes, Pântano de Veyra e Deserto de Kaelor com dez mobs exclusivos e crônicas na Wiki. Transparência de linhagens: PNG prioritário e falhas de imagens independentes. Contas antigas preservadas por migração.

Pendentes: produzir as 12 artes finais (dois cenários e dez criaturas), testar custos/ritmo em sessões humanas longas e produzir vídeos da lore. Não houve publicação. [[docs/conhecimento/Jornada-Lore-Biomas|Regras, arquivos e evidências]] · [[docs/ARTE_BIOMAS_MYTHREON|Caminhos e prompts]].

### HP/MP e raridades — 2026-11-02

Corrigidos cache de máximos de vida/mana, concatenação de bônus e casas decimais das barras; cinco efeitos de raridade padronizados com teste visual. Ver Balanceamento-Combate-Economia.md. Portátil único continua anterior por falta de espaço; não confundir com build web e win-unpacked.

## Mundo online — 2026-11-02

Implementação local de Supabase Auth, motor no servidor, 36 rankings, chat global/privado, VIP, correio custodiado e troca com escrow/dois OKs/taxa. Banco e interface testados em ambiente local simulado. Projeto Supabase ainda não existe/configurado; sem publicação ou usuários reais conectados. Ativação precisa de migrations, SMTP e variáveis privadas na Vercel. Saves antigos preservados sem importação automática; migração de veteranos, arena online autoritativa e expiração agendada permanecem pendentes. [[docs/conhecimento/Contas-Online-e-Social|Arquitetura e evidências]] · [[docs/ATIVAR_MUNDO_ONLINE|Passo a passo]].

Decisão comercial ainda a alinhar: o correio foi liberado nos testes sem premium, mas existe intenção histórica de disponibilizá-lo como benefício premium. Confirmar esse bloqueio antes da abertura pública; não tratar a escolha de testes como revogação explícita da monetização planejada.

## Continuidade mais recente — Pack 53 — 04/11/2026

As seções datadas acima preservam o estado histórico, inclusive a observação de 02/11 sobre Supabase ainda não configurado. Para o estado posterior, consulte [[docs/conhecimento/Contas-Online-e-Social|Contas online]] e [[docs/conhecimento/Auditoria-Backlog-2026-11-03|Backlog por pack]]. Este pack foi verificado localmente; não houve nova homologação/publicação em produção.

[[docs/conhecimento/Pack-53-Profissoes-Tiers-e-Pulso-2026-11-04|Pack 53]] completa coleta T1–T5, requisitos de travessia, pulso visível com toque/teclado, receitas e alimentação por caldo. Os demais sistemas não devem ser considerados prontos para lançamento por essa entrega. Continuam pendentes homologação multiusuário/dispositivos, monetização com fluxo financeiro real, carga/latência, moderação e os detalhes descritos em cada pack.

## Continuidade — Pack 56 — 04/11/2026

A fonte mais recente para o problema de ações que voltam atrás é [[docs/conhecimento/Pack-56-Fila-Online-e-Recuperacao-2026-11-04|Fila online e recuperação]]. Prévia determinística e fila durável passaram em testes locais, incluindo telas reais. Os packs 54/55 também estão no backlog com calendário/cosméticos posteriores ao resumo do Pack53 acima. Ainda não há homologação deste pack em produção; o bundle grande, polling, dispositivos e concorrência permanecem abertos.

## Continuidade — Packs 57–60 — 04/11/2026

Profissões receberam pulso autoritativo, cenas e isca opcional nos Packs 57–58; Cards receberam evolução real, bônus compartilhados e sprites no Pack 59. O Pack 60 adiciona dez Cards para os mobs exclusivos de Pântano de Veyra e Deserto de Kaelor, levando o álbum a 48 espécies. A temporada de novembro preserva o catálogo original de 38 no denominador; a expansão entra na temporada de dezembro e o snapshot de `total_cards` não é sobrescrito no meio do mês. Ver [[docs/conhecimento/Pack-60-Cards-Veyra-Kaelor-e-Temporada-2026-11-04|Pack 60]].

Continuam sem homologação de produção: concorrência e latência reais, dispositivos móveis físicos, lançamento Windows/Android, publicação das migrations, histórico/paginação em grande escala, negociação de Cards, economia prolongada e playtests dos custos. Não declarar os oito sistemas do roadmap (Boss Diário, PvP, Mineração/Pesca, Cards, calendário, Mercado Negro, Loja Premium e cosméticos) concluídos apenas por testes locais.
