---
projeto: Mythreon Online
tipo: decisao
status: implementado-com-artes-pendentes
atualizado: 2026-11-02
resumo: Introdução guiada, economia inicial gradual e travessias por NPC ligam a lore aos sete biomas.
---

# Jornada, lore e biomas

## Decisão e alcance

Personagens novos recebem prólogo de três páginas e uma iniciação obrigatória. A caça não começa ao criar o personagem. Uma missão é apresentada por vez, a seguinte exige resgatar a anterior. O guia indica onde cumprir o objetivo. Os sistemas necessários ficam acessíveis em cada etapa; os demais abrem ao concluir. Salvar e sair mantém a etapa. A intro lida não se repete.

A história original do Primeiro Canto, das sete Consciências e da Grande Ruptura permanece. As novas crônicas descrevem consequências regionais e conectam NPCs, conflitos e travessias. São uma expansão narrativa proposta e implementada localmente, sujeita à revisão autoral.

## Iniciação (14 missões)

1. Arquivo/Wiki: ler, aceitar e visitar.
2. Preparar elixires: em Explorar, entrar no Bosque e configurar HP ou MP; ativar gasto é opcional.
3. Derrotar dez lobos.
4. Visitar Matriz; recebe A1, S1 e P1 garantidos.
5. Criar E equipar uma Matriz.
6. Caçar vinte criaturas e ganhar 300 gold; recebe três espadas comuns para os serviços do Ferreiro.
7. Visitar Ferreiro.
8. Desmanchar um equipamento, com seleção explícita.
9. Aprimorar um equipamento uma vez; recompensa anterior fornece fragmentos.
10. Vender um item.
11. Visitar Personagem, Divine Beasts e Shop, sem exigir compra nem uma Beast.
12. Treinar trinta segundos reais, sem XP de personagem; pausa ao concluir o objetivo.
13. Visitar Laboratório: projeção não garante vitória nem libera mapa.
14. Visitar Mochila e Depósito; recebe a Pulseira do Primeiro Eco e libera o jogo completo.

A caça pausa ao completar uma missão inicial. Durante leitura/retorno não acumula combate offline do tutorial. O treinamento introdutório também pausa ao atingir trinta segundos. Receber recompensa duas vezes é impedido; itens de recompensa vão para o depósito se não couberem na mochila. O depósito está disponível após os lobos para recuperar recursos.

O compêndio deixa de autoaceitar todas as metas no primeiro acesso. Somente metas atingidas, com a anterior resgatada, são ativadas. Nenhuma descoberta ou missão já concluída é apagada.

## Progressão e gold

- XP por nível 1–25: floor(max(200 × nível^1,35; 100 × 1,25^(nível−1))).
- Após 25: floor((100 × 1,25^24) × (nível/25)^3,5), com continuidade crescente.
- Saves existentes preservam nível e fração da barra de XP na migração.
- Tutorial: 20–25 XP por missão. Missões de história de Lyss: 150 XP; chefe: 300; repetível: 150. Compêndio deixa de conceder grandes saltos de XP (25 por meta).
- Ouro de Lyss: história 500; chefe 1.000; repetível 350. Não alteramos os valores base dos monstros antigos nesta rodada. A progressão de gold recebe novos destinos nas travessias.
- Passagens consomem gold e itens reais da mochila, uma única vez, sem reembolso por recompensa. Validam todos os requisitos antes de descontar qualquer recurso.
- O multiplicador de debug não obedece mais a uma flag gravada no navegador publicado: debug fica limitado ao hostname localhost.

Amostra sintética de cinco minutos, cinco sementes: níveis 2, 2, 3, 2, 2; 45–49 lobos e 365–404 gold. São 100 ticks, sem equipamento nem poções, restaurando HP a cada tick para medir ritmo de abates sem mortes. Não representa sobrevivência real, Matriz equipada, boosts nem balanceamento de todas as builds. A simulação reproduzível está em scripts/journey-check.cjs. Custos e tempos finais exigem testes com jogadores.

## Contratos permanentes

| Destino | Nível do contrato | Missão anterior | Gold | Materiais da mochila | NPC |
|---|---:|---|---:|---|---|
| Pico de Dhor | 15 | LYSS_BOSS | 3.500 | A1 ×30, A2 ×20, S1 ×10 | Bolk |
| Mar de Azhar | 26 | PICO_DHOR_BOSS | 18.000 | A9 ×40, A11 ×30, S7 ×15 | Nara |
| Pântano de Veyra (lateral) | 26 | PICO_DHOR_BOSS | 15.000 | A4 ×40, A11 ×25, S5 ×15 | Tomé |
| Ruínas de Asterion | 46 | MAR_AZHAR_BOSS | 50.000 | A12 ×60, A5 ×40, S6 ×20 | Sinax |
| Deserto de Kaelor (lateral) | 46 | MAR_AZHAR_BOSS | 65.000 | A13 ×60, A6 ×40, S10 ×20 | Nara |
| Cicatriz Profunda | 71 | RUINAS_ASTERION_BOSS | 200.000 | A14 ×80, A15 ×40, S7 ×30 | Seraphine |

Todos os materiais têm fontes anteriores ao destino. Entregar abre permanentemente o mapa e conclui a missão de contrato. Depois é preciso aceitar a missão regional, caçar suas espécies e enfrentar seu guardião. Os níveis individuais dos monstros continuam válidos. O Laboratório pode simular um mapa ainda fechado; simular não é autorização de entrada.

## Preservação de saves antigos

Saves sem journeyVersion recebem versão 0: mantêm acesso aos cinco mapas antigos compatíveis com o nível, além do mapa atual, e não recebem prólogo obrigatório retroativo. Passagens antigas correspondentes são registradas como concluídas para permitir as novas histórias regionais. Veyra e Kaelor exigem contratos também de veteranos. Dhor mantém nível base 11 para quem já tinha acesso; o contrato de personagens novos exige 15. tutorialCompleted antigo é reconhecido como pré-requisito da história de Lyss, mesmo sem TUT_BACKPACK explícita.

Não houve reset, edição de contas reais, git push ou publicação.

## Direção narrativa para vídeos futuros

Cada capítulo tem apresentação, conflito, missão e resolução em src/data/worldJourney.ts, compartilhados com a Wiki e os contratos:

- Lyss: despertar sob raízes luminosas → aprender com Mirelle e Sinax → conter o Espectro → revelar a trilha de Dhor.
- Dhor: plano aberto da montanha metade lava/metade gelo → coleta das duas assinaturas → prova do Colosso → correntes descem até Azhar e Veyra.
- Azhar: pilares submersos e ecos do Canto → cartografia entre serpentes e medusas → Leviatã → vislumbre das ruínas e das dunas.
- Veyra: memória pulsa nos cipós → veneno protege e contamina → Matriarca do Lodo → preservar um fragmento de Lyss. Rota opcional.
- Asterion: arquivo em pedra → registros disputados → Guardião → localização da Cicatriz.
- Kaelor: dunas vitrificadas e um farol quebrado → miragens e metal → Sentinela do Zênite → devolver a noite ao deserto. Rota opcional.
- Cicatriz: identidades engolidas pelo Vazio → conservar o próprio nome → Devorador → espaço para o próximo Canto.

A Wiki contém seção Jornada e Biomas. Vídeos ainda não existem. Spoilers das resoluções ficam recolhidos na interface.

## Imagens

AssetImage prioriza PNG em /assets/players/, inclusive nas prévias de Matriz e personagem. GIF/GIFF continuam como fallback; mapas, itens e demais imagens mantêm prioridade animada. Os PNGs existentes de linhagens foram preservados. Falha da imagem do monstro já não esconde o sprite do personagem; cada um tem estado de erro próprio. Falha terminal de todas as extensões aciona corretamente o emoji.

Veyra e Kaelor usam gradientes provisórios e monstros usam emojis até receberem artes. Música reutiliza forest e ruins respectivamente. [[docs/ARTE_BIOMAS_MYTHREON|Artes e prompts dos biomas]].

## Arquivos responsáveis

| Responsabilidade | Arquivos |
|---|---|
| Lore, contratos, NPCs | src/data/worldJourney.ts (novo), src/engine/journey.ts (novo) |
| Regiões e missões | src/data/zones.ts, src/data/quests.ts |
| Progresso, recursos e persistência | src/types/index.ts, src/engine/questEngine.ts, src/engine/save.ts, src/store/gameStore.ts |
| Curva e debug | src/engine/stats.ts, src/config.ts |
| Introdução, direção do objetivo | src/ui/JourneyGuide.tsx (novo), src/App.tsx |
| Crônicas e entrega ao NPC | src/ui/WorldJourney.tsx (novo), src/ui/Quests.tsx, src/ui/Wiki.tsx, src/ui/Zone.tsx |
| Imagens, fallback e som | src/ui/AssetImage.tsx, src/ui/Zone.tsx, src/ui/AudioManager.tsx, src/index.css |
| Marcadores e rastreador | src/utils/questSignals.ts, src/ui/QuestTracker.tsx |
| Verificação | scripts/journey-check.cjs (novo), scripts/journey-ui-check.cjs (novo), package.json, tsconfig.json |
| Tipagem das prévias | src/ui/Matrix.tsx (conversões explícitas para exibir números) |

ES2022 habilitado na checagem e duas cópias antigas deepseek_typescript... excluídas da compilação de tipos; arquivos preservados no disco. Vite já não os importava. A Wiki corrige a informação antiga de drops para 18%/65%, alinhada à regra existente.

## Evidências e limites

- npm run typecheck: sem erros.
- npm run journey:check: sequência de 14 missões, recompensas de componentes/espadas, relíquia sem duplicação, seis contratos, débito atômico, fontes de materiais alcançáveis, espécies regionais, migração e amostra de XP.
- node scripts/build-lab-check.cjs: projeções preservam o save e continuam reproduzíveis.
- npm run brain:check: índice recuperável, sem leitura de binários e sem perda de notas.
- Interface automatizada em perfil isolado: prólogo, primeiro aceite, navegação para Wiki, missão seguinte sem antecipar Matriz, PNG prioritário e emoji de monstro sem esconder personagem.
- Artes finais pendentes; custos são parâmetros iniciais, não promessa de equilíbrio definitivo.

[[docs/conhecimento/Balanceamento-Combate-Economia|Regras de combate e economia]] · [[docs/conhecimento/01 - Estado e pendencias|Estado e pendências]]

A curva usa o maior valor entre a nova base inicial e a curva antiga até 25; a exigência de XP dos níveis avançados não diminui nesta revisão.

## Entrega Windows desta revisão

Build web final e aplicativo em release/win-unpacked atualizados. 187 arquivos de dist conferidos por hash contra o pacote, manifesto de execução validado, janela nativa abre e Worker retorna oito inimigos/seis planos. Registro: release/journey-verification.json.

O portátil único release/Mythreon-Online-0.1.0-Windows-x64.exe continua sendo a versão anterior: a compactação desta revisão falhou por espaço insuficiente em C:, mesmo após remover apenas o cache de extração de testes anteriores. O arquivo .7z incompleto desta tentativa foi removido; arquivos pessoais e portátil anterior preservados. Para jogar a versão atual no Windows, abrir release/win-unpacked/Mythreon Online.exe e manter a pasta inteira. Para gerar outro portátil, liberar espaço e executar npm run desktop:portable; não apresentar o portátil antigo como atualizado.
