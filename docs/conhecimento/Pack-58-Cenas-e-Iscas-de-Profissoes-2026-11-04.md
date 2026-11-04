---
projeto: Mythreon Online
tipo: entrega
status: implementado-localmente
data: 2026-11-04
resumo: Cenas de coleta com artes existentes e consumo opcional e atômico da Isca da Cicatriz.
---

# Pack 58 — cenas de profissões e isca utilizável

## Entrega

A Pesca e a Mineração receberam uma cena por profissão, com fundo do bioma, humano de aparência/skin salva, ferramenta equipada, recurso local e estado da coleta. Os botões Observar trocam o ponto apresentado sem entrar em outra hunt ou mudar o personagem.

As cenas reutilizam forest/mountain/ocean/abyss, humano-v2 e as artes existentes EFEITO_PESCA_MORDIDA.png e EFEITO_MINERACAO_FAISCA.png. Água, margem, veios, linha e flutuação são camadas CSS/SVG. Não foi criado bitmap novo. O herói é apresentado como humano durante a atividade; isso não desequipa nem altera a Matriz/Pet no estado de jogo.

Preparação, pulso ativo, confirmação e sucesso acompanham eventos reais do widget. Quantidade e bônus aparecem somente no resultado confirmado. Não existe coleta por clicar na imagem ou em Observar.

A opção de efeitos, animação, modo reduzido e prefers-reduced-motion é respeitada, inclusive após mudança nas configurações. O fundo usa os candidatos GIF/GIFF/PNG do AssetImage, com PNG prioritário quando movimento está desativado. Listeners são removidos ao desmontar; há apenas duas cenas, sem RAF separado por cenário.

## Isca

- FISHING_BAIT em src/data/professions.ts define ISCA_CICATRIZ, uma unidade por uso, +1 peixe.
- A escolha é opcional e começa desmarcada. Sem isca, a pesca anterior continua disponível.
- A quantidade extra é somada após o cálculo de precisão. Não acrescenta skill nem muda a recarga.
- A preparação registra baitId no desafio do servidor, sem consumo antecipado. O cliente não pode trocar a isca no pedido final.
- O servidor confere a isca na mochila ao preparar e ao finalizar. Se ela for vendida, movida ou consumida por outro fluxo, a coleta é rejeitada.
- Cancelamento, expiração, soltura antecipada e falhas não consomem isca.
- Consumo e entrega são feitos no mesmo clone do personagem, antes do set/commit. Bolsa cheia não deixa preenchimento parcial nem perde isca.
- A última isca pode liberar seu slot para o peixe. Stacks continuam limitadas a999.
- A API retorna baitConsumed e bonusQuantity. Replay com o mesmo requestId não consome novamente; UUID de pulso já usado não concede outro peixe.
- No modo offline, fishSpot aceita baitId opcional com as mesmas regras de consumo/entrega.
- ItemIcon usa a arte ISCA_RARA.png já existente para o item de ID ISCA_CICATRIZ. Não renomear o ID salvo para corresponder ao arquivo.

O ganho tem valor diferente em cada bioma. Usar isca não é promessa de lucro contra a venda dela ao Ferreiro; a escolha permite priorizar uma espécie/recurso. Receitas e preço de venda da isca foram preservados.

## Arquivos principais

- src/data/professions.ts: regra única da isca.
- src/engine/professionChallenge.ts e server/game.ts: escolha vinculada ao desafio e conferência na conclusão.
- src/store/gameStore.ts: consumo/entrega atômicos e metadados do bônus.
- src/ui/ProfessionScene.tsx e professionScene.css: apresentação e preferências de vídeo.
- src/ui/ProfessionPrecisionAction.tsx: eventos da atividade e resultado com bônus.
- src/ui/Professions.tsx: cenas, Observar, escolha de isca e integração online/offline.
- src/ui/ItemIcon.tsx: arte existente da isca.
- ProfessionsGuide e mythreonJournal: regras dentro do jogo.
- scripts/professions-bait-check.ts e package.json: professions:bait-check.
- scripts/online-check.ts: consumo e replay pelo banco/API.
- scripts/online-flow-ui-check.cjs: cenas, presença do herói, consumo online e troca de configurações.
- scripts/professions-ui-check.cjs: prévia sem mudar estado, eventos locais e layout.

## Validação

- professions:bait-check passou: escolha opcional, bônus exato, uso único, cancelamento/expiração, falta/movimentação da isca, bolsa cheia, último slot livre, divisão de stacks999 e recarga offline.
- professions:pulse-check, professions:check e online:session-check passaram.
- online:check passou em PostgreSQL/PGlite serializado: o fluxo real de preparação/finalização consome uma isca; replay mantém quantidade e skill.
- typecheck e build passaram. Runtime foi regenerado pelo script. Continua o aviso conhecido do bundle principal acima500kB (~1,10MB).
- UI online real com HTTP/motor local passou em PC e390px: herói carregado/posicionado na cena, precisão, isca, quantidade extra, cancelamento e configurações de vídeo. Capturas profession-scene-desktop.png/mobile.png em node_modules/.cache/online-flow inspecionadas.
- UI offline passou com mouse, teclado e toque emulados, Observar sem mutar o personagem e recarga compartilhada.
- Revisão visual corrigiu colisão entre position:relative do HeroArt e o posicionamento da cena; seletor específico e teste de presença impedem repetir o erro.

## Limites e continuidade

A arte humana atual está em pé. A pose sentada à margem solicitada ainda não está concluída: precisa de sprite/atlas próprio que preserve a personalização e skins. Não chamar esta base visual de animação final de pesca. A prancha de faísca também é uma ilustração de impacto, não uma sequência de frames de mineração.

A água é composta sobre o fundo do bioma existente, não um novo cenário exclusivo de rio. Faltam riverbank/mine próprios, pose, sincronização fina da mão/ferramenta e variantes cosméticas. Quedas de imagem usam os fallbacks existentes; não foram produzidas as artes de recursos que continuam no backlog.

Sem deploy, commit, push, migração ou escrita em banco de produção. Não houve teste físico Android, latência móvel, GPU real nem múltiplas conexões de banco concorrentes. Os limites de processamento e anti-automação do Pack57 continuam válidos.

Próximos slices: destinos de lingotes/cristais no Ferreiro, rotas laterais, curva de skill e medições reais, além dos outros sistemas pendentes do backlog. Manter o escopo global dos packs; cenas/isca não encerram Boss, PvP, Cards, Mercado ou monetização.

[[docs/conhecimento/Pack-57-Pulso-Autoritativo-de-Coleta-2026-11-04|Pulso autoritativo]] · [[docs/conhecimento/Pack-53-Profissoes-Tiers-e-Pulso-2026-11-04|Tiers e receitas]] · [[docs/conhecimento/Auditoria-Backlog-2026-11-03|Backlog]]
