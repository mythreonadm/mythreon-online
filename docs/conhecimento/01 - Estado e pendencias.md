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
