# Pack 53 — Profissões T1–T5 e pulso visível

## Estado e decisões

Implementação local concluída em 04/11/2026. Sem push/deploy e sem alteração de schema. Não considerar os demais packs finalizados.

- Há cinco veios e cinco pontos de pesca, T1–T5, exigindo skills 0/20/40/60/80 e ferramenta do tier ou superior.
- Cada ponto tem zoneId. A liberação usa canEnterZone, a mesma regra das travessias de Jornadas, conferida no domínio do jogo e na interface.
- T1: Bosque; T2: Dhor; T3: Azhar; T4/T5: Cicatriz Profunda. Asterion, deserto e pântano ainda precisam de rotas laterais próprias.
- Cinco recursos novos: MINERIO_COBRE, MINERIO_ECLIPSE, TRUTA_GELO, PEIXE_CORAL e PEIXE_ASTRAL. Todos empilham até 999; ItemIcon procura a arte e recua para emoji.
- O ID legado cristal_dhor permanece, mas agora produz cobre T2. Cristal de Essência passou ao veio T3 cristal_azhar. mar_azhar permanece como ID, com peixe-coral T3 e skill 40; lago_dhor cobre a etapa T2. Recursos antigos no inventário não foram convertidos nem apagados.

## Jogabilidade

ProfessionPrecisionAction agora mostra marcador branco e faixas de prata/dourado. Segurar e soltar funciona por Pointer API e por Espaço/Enter; Esc, perda de foco, cancelamento de toque e expiração não coletam recursos. RAF e timers são limpos ao desmontar.

O pulso dura 3000 ms. Centro aleatório entre 40% e 75% da barra, raio dourado de 4,5% e bom de 11%. A janela de precisão é calculada em src/engine/professionPrecision.ts. Todas as coletas válidas mantêm a regra anterior: +1 skill, ou +2 no perfeito. Rendimento usa multiplicador 0,85/1/1,25, arredondado para baixo e mínimo 1. Intervalo anterior preservado: max(1500, 5000 - floor(skill/10)*100).

Recarga é exibida em segundos e compartilhada por todos os pontos da mesma profissão. Removidos alerts bloqueantes da página; mensagens ficam no painel. Layout foi corrigido para não exceder 390 px, com recursos e ferramentas usando ItemIcon.

## Receitas e utilidade

Seis receitas novas reaproveitam os produtos existentes: liga de cobre, lapidação obsidiana, condensação do Eclipse, isca de água fria, caldo de coral e caldo astral. Cada recurso coletado possui caminho de refino.

O caldo antigo exigia MELANCIA_LUNAR, item de pet existente. Agora exige COLHEITA_MELANCIA, a melancia da Fazenda. Nomes de colheitas são resolvidos pelo catálogo de sementes, sem mostrar identificador cru.

Venda por unidade: Lingote 60 gold; Cristal Refinado 180; Isca 20; Caldo 190. O conjunto atual de receitas tem margem positiva contra a venda dos ingredientes ao Ferreiro; isso não comprova equilíbrio global da economia.

Caldo da Marca-d’Água foi adicionado à alimentação do Pet ativo: até 40 pontos de nutrição e 10 de humor, respeitando máximo 100 e decaimento existente. A interface usa pontos, sem prometer duração exata. As iscas continuam produtos de venda/refino; ainda não são consumidas pela pesca. Lingotes/cristais ainda precisam de mais destinos no Ferreiro.

## Conhecimento dentro do jogo

Wiki ganhou seção Mineração & Pesca, com tabelas e receitas derivadas do catálogo atual, requisitos, fórmulas e preços ao Ferreiro. Jornal ganhou a atualização pack-53-professions. Artes e prompts em [[docs/ARTE_ITENS_PENDENTES|Artes pendentes]], seção Pack 53.

## Evidências

- npm run professions:check: dez pontos, cinco tiers, skill/ferramenta/travessia, recarga, conservação de inventário em rejeição com stack parcial, dez receitas, margem de refino, ingrediente consumido uma vez, alimento e limites de precisão.
- npm run online:check: passou a incluir travessia negada no comando online e replay da mesma requisição T5 sem recurso/skill duplicados. Restante da regressão de conta, trade, Boss e PvP passou.
- npm run typecheck: passou.
- npm run build: passou; permanece aviso de chunk principal acima de 500 kB (~1,07 MB).
- scripts/professions-ui-check.cjs: passou em Electron offscreen, fixtures locais, mouse/toque emulados pela Pointer API, teclado, cancelamento, pulso perfeito, recarga em cinco veios e largura 390 px sem overflow. Capturas desktop/mobile em node_modules/.cache/professions-ui/ inspecionadas.

## Limites e próximo trabalho

O teste visual emula eventos; ainda exige homologação em celulares físicos. A precisão continua calculada pelo cliente, como antes: cooldown, acesso e itens são validados no servidor, mas este pack não oferece prova de tempo/nonce do minigame contra automação. O teste PostgreSQL usa PGlite com conexão serializada, sem comprovar concorrência real de produção.

Pendências: cenas próprias de rio/personagem e mineração, consumo útil de isca, requisitos de recursos em forja, progressão de skill menos linear após medição, biomas laterais, desempenho de reconciliação online, proteção server-side do desafio e artes novas. Os preços do Mercado são livres e não equivalem à tabela do Ferreiro.

Arquivos principais: src/data/professions.ts, src/data/items.ts, src/engine/professionPrecision.ts, src/engine/shop.ts, src/store/gameStore.ts, src/ui/Professions.tsx, src/ui/ProfessionPrecisionAction.tsx, src/ui/ProfessionsGuide.tsx, src/ui/Wiki.tsx, src/ui/DivineBeasts.tsx, src/data/mythreonJournal.ts, scripts de verificação e package.json.

## Atualização posterior — Pack 57

A pendência de nota confiada ao cliente foi substituída pelo [[docs/conhecimento/Pack-57-Pulso-Autoritativo-de-Coleta-2026-11-04|pulso online autoritativo]]: desafio único, tempo do servidor e finalização sem score enviado. Interface prepara, conta e mostra a nota confirmada. A observação anterior sobre precisão cliente descreve o estado do Pack53 e continua válida apenas para o modo offline. Ainda faltam cenas, iscas, rotas e medição real; o protocolo não é prova contra toda automação.
