# Cérebro do Projeto — Mythreon Online

> **Resumo de contexto e continuidade entre IAs.** A entrada principal é [[00 - Comece aqui]], seguida de [[docs/conhecimento/00 - Fonte de conhecimento]]. Regras, decisões e procedimentos duráveis ficam nas notas originais em docs/conhecimento. Use este documento para arquitetura resumida e histórico; confira o código antes de afirmar como o jogo funciona. O índice automático apenas localiza fontes e relações.

**Última revisão:** 02/11/2026  
**Pasta do projeto:** `C:\Users\dreey\OneDrive\Área de Trabalho\MYTHREON ONLINE`  
**Idioma de colaboração com o criador:** português do Brasil  
**Estado:** protótipo jogável em evolução; mudanças locais podem ainda não ter sido enviadas ao Git/Vercel.

## Configurações de apresentação e compatibilidade — 2026-11-03

- O cabeçalho mantém `Sair da conta` no extremo direito e oferece a engrenagem `Configurações`.
- Preferências persistentes no navegador: `mythreon_video_mode` (`auto`, `compat`, `reduced`), `mythreon_animations_enabled`, `mythreon_effects_enabled`, `mythreon_mute`, `mythreon_sfx_enabled` e `mythreon_volume`.
- O modo **Compatibilidade** evita depender da animação de projétil/CSS e exibe um marcador `✦ HIT` no local do impacto, mantendo números de dano e os dois impactos de combo visíveis.
- O modo **Econômico** reduz animações sem remover os resultados de combate. Sons de ataque podem ser desligados separadamente da música.
- A engrenagem é o ponto oficial para orientar jogadores que não enxergam efeitos em alguns navegadores, GPUs ou celulares.

## Fluidez do mundo online — 2026-11-03

- Ações online agora usam atualização otimista: a interface aplica a prévia local imediatamente e enfileira a confirmação do servidor em segundo plano, mantendo a ordem dos comandos.
- O estado visual não fica congelado durante uma requisição comum. `pending` fica reservado para recuperação de uma operação incerta (queda/timeout), não para cada clique.
- Uma leitura completa de segurança é feita em segundo plano a cada hora; a leitura curta de atividade continua independente para manter caça e treino atualizados.
- Em caso de falha incerta, a operação continua registrada em `localStorage` com o mesmo `requestId`, permitindo repetição idempotente sem duplicar a ação.

## Gear Score, inventário e troca — 2026-11-03

- `src/engine/gearScore.ts` centraliza o Gear Score: equipamento, afixos, atributos derivados, skills, maestria/tempo de treino, nível, bônus da Matriz, resistências e vínculo de Divine Beast entram em uma pontuação arredondada para comparação de progressão. É uma métrica de orientação, não substitui o cálculo real de dano.
- O Gear Score aparece no painel superior e no cabeçalho da aba Personagem. Ícones da Mochila e do Depósito foram ampliados para leitura melhor em desktop e celular.
- A troca agora apresenta uma `Bag de envio`: itens selecionados ficam separados em uma área visual própria, podem ser removidos antes do envio e o lado do outro jogador continua visível via atualização social em tempo real. A confirmação dupla e a reserva server-side permanecem obrigatórias.

## Refúgio, Bless e aceleração de testes — 2026-11-03

- Cards de mapas foram centralizados em uma grade uniforme, com áreas de clique e títulos mais claros.
- O botão Bless saiu da cabine e foi incorporado ao lado da barra de XP no cabeçalho. Com 0 Bless, fica vermelho, brilhando e pulsando; com Bless ativo, mostra a contagem normal.
- A cabine mantém o acesso direto a Treinar e Meditar; quando HP/MP estão completos, a área de cura informa o estado em vez de esconder a ação.
- A Shop recebeu o `VIAL_XP_RUSH` / `Elixir da Ascensão`: 1.000 gold, duração de 1 hora e bônus temporário de +1000% XP. É um acelerador de QA/testes e deve ser removido ou protegido por flag antes do lançamento oficial.

## Continuidade — Pântano de Veyra e conteúdo de mobs — 2026-11-03

- O Pântano de Veyra agora possui uma linha própria de progressão: cinco componentes de Ataque (A16–A20), cinco Suportes (S14–S18), duas Passivas (P13–P14), cinco materiais de drop e oito equipamentos de tier 3.
- Cada mob de Veyra foi ligado ao seu componente, essência, material e pool de equipamento correspondente. A Matriarca do Lodo permanece chefe e concentra a Pulseira da Matriarca e o material Coroa de Lodo.
- O drop de equipamento aceita `equipmentDropIds`; materiais regionais usam `materialDropId`/`materialChance`. Zonas antigas continuam usando o pool geral por tier.
- Pranchas de arte para recorte manual estão em `imagens/pantano/`: `PANTANO_VEYRA_LOOT_SHEET.png`, `PANTANO_VEYRA_EQUIPAMENTOS_SHEET.png` e `PANTANO_VEYRA_MATRIZES_SHEET.png`.
- As pranchas são referências de recorte; os ícones individuais ainda devem ser exportados para `public/assets/items/` com os IDs dos templates quando o criador concluir a transparência.
- Validação: `npm run typecheck` passou. Git/OneDrive ainda pode exigir `git add` manual dos PNGs por bloqueio de `index.lock`.
- As novas formas humanoides A16–A20 foram registradas em `src/data/lineages.ts`; as artes esperadas são `miasmideo.png`, `libeluniano.png`, `memoriano.png`, `silteano.png` e `matriarcal.png` em `public/assets/players/`.
- O combate ganhou efeitos sonoros procedurais por componente de Ataque (`A1–A20`) e uma camada especial para o combo, em `src/utils/sfx.ts`; não exige arquivos de áudio adicionais e respeita mute/volume.

---

## 1. Instruções para a próxima IA

1. Comece por `00 - Comece aqui.md`, o índice `docs/conhecimento/00 - Fonte de conhecimento.md` e a nota do assunto. Consulte seções deste Cérebro quando precisar de contexto/histórico. Confira `git status` e o código atual; planos antigos podem estar desatualizados.
2. **Não implemente de novo algo que já existe.** Confirme cada pedido contra o código, não apenas contra a lista de pendências.
3. Preserve as mecânicas existentes quando o pedido for visual. Não altere regras, dados, saves ou funcionalidades sem pedido explícito.
4. Faça alterações pequenas e localizadas. Preserve compatibilidade com saves antigos; campos novos devem ter defaults/migração no carregamento.
5. Nunca trate ideias futuras como funcionalidade existente. Use os estados **Implementado**, **Parcial**, **Planejado** ou **Bloqueado por decisão/arte**.
6. Não remova imagens, pastas, arquivos não rastreados ou conteúdo do usuário. Antes de propor limpeza, confirme uso e histórico.
7. Ao concluir, atualize **Estado dos sistemas** e acrescente uma entrada em **Registro de continuidade**: data, pedido, decisões, arquivos modificados, validação, limitações e próximo passo.
8. Se algo não puder ser concluído, deixe instruções reproduzíveis e específicas neste arquivo. Não esconda itens incompletos sob uma afirmação de conclusão.
9. O jogo é single-player/local neste estágio. Não prometa negociação, persistência em nuvem ou segurança de MMO enquanto não houver backend autoritativo.
10. Responda ao criador em português claro, com resumo, arquivos alterados e validação. Não faça push, deploy, envio de mensagens ou publicação sem solicitação explícita.
11. O observador atualiza hashes, símbolos exportados, documentos, dependências locais e tópicos por arquivo. Ele não interpreta sozinho a intenção semântica de uma mudança; complete a seção de estado/registro após cada tarefa para preservar decisões e raciocínio.

### Prompt curto para iniciar uma sessão com outra IA

> Acesse a pasta Mythreon Online e leia `00 - Comece aqui.md`, o índice `docs/conhecimento/00 - Fonte de conhecimento.md` e a nota do assunto. Consulte o Cérebro para contexto histórico quando necessário. Ele contém as decisões e o contexto persistente do jogo. Confira o estado atual do código antes de editar, porque planos antigos podem estar desatualizados. Continue o pedido do usuário sem duplicar funções existentes, preserve saves e gameplay, faça mudanças incrementais e atualize o próprio Cérebro com o que mudou e o próximo passo.

### Memória e conhecimento no Obsidian — versão 2

- Cofre oficial: raiz MYTHREON ONLINE. A entrada é [[00 - Comece aqui]], e a fonte autoral é [[docs/conhecimento/00 - Fonte de conhecimento]]. Notas originais em docs/conhecimento não são sobrescritas pelo observador.
- Este Cérebro registra contexto e continuidade; o painel Mythreon Obsidian contém somente índices, catálogo com links para as notas originais e mapa técnico. A antiga cópia gerada deste arquivo foi preservada em Arquivo e deixou de ser fonte concorrente.
- Ativação Cérebro.bat e npm run brain:watch iniciam um supervisor que reinicia o observador após falha e recarrega seu código quando atualizado. O observador tem lock contra duplicatas, verificação periódica de 30 s e recuperação de arquivos temporariamente indisponíveis. Fechar a janela encerra a observação; não é um serviço permanente do Windows.
- npm run brain:sync faz reconstrução pontual. npm run dev mantém observação junto do Vite ou utiliza o observador já existente. O supervisor dedicado é a opção de recarga automática do código do Cérebro.
- Binários e diretórios release/dist/node_modules/.git/.obsidian são ignorados. Assets entram como metadados sem leitura do conteúdo. O índice compacto fica em .mythreon-brain/neurons.json; estado interno em state.json; catálogo semântico em knowledge.json; estado da última sincronização em status.json.
- changes.jsonl registra caminhos/estados observados sem o limite do resumo recente. Não reconstrói versões intermediárias enquanto o observador estava desligado e não substitui Git ou histórico de decisões.
- O observador cataloga arquivos e relações; cabe ao criador/IA registrar por que as regras mudaram. Obsidian não interpreta código sozinho e não elimina o custo de contexto das IAs. Use leitura seletiva de notas e fontes.
- brain:seal e brain:open preservam a opção de cópia Gzip/AES-256-GCM mediante MYTHREON_BRAIN_KEY. A memória de trabalho permanece legível; criptografia não reduz tokens. Não salvar a chave ou credenciais em notas/repositório.
- Recuperação, diagnóstico e limites: [[docs/conhecimento/Operacao do Cerebro e Obsidian]]. Estado e falhas conhecidos: [[docs/conhecimento/Registro de problemas]].

---

## 2. Visão e identidade do jogo

**Mythreon Online** é um RPG idle/MMORPG de navegador em pixel art. O jogador explora zonas, caça automaticamente, coleta componentes e itens, sintetiza uma Matriz/Raça, cria uma build com atributos livres e pode formar vínculos com Divine Beasts. A intenção é combinar progresso idle, coleção, construção de personagem e descoberta de história.

### Direção visual

- Pixel art como linguagem de sprites, monstros, itens, Divine Beasts, mapas e efeitos.
- Interface escura de fantasia arcana, com ouro para importância/objetivos, ciano para informação e roxo para sistemas mágicos.
- Logo e identidade Mythreon devem manter legibilidade em tamanhos pequenos e contraste com fundos escuros.
- GIF/Giff pode ser usado para animações; manter PNG como fallback.
- Evitar introduzir uma estética visual diferente em cada aba. A Wiki, a Forja/Ferreiro e os menus devem parecer partes do mesmo jogo.
- Arte nova deve ter nomes de arquivo estáveis, sem espaços ou caracteres incompatíveis; documentar caminho e nome esperado.

### Pilares de produto definidos pelo criador

- Liberdade de build: o jogador escolhe como distribuir atributos, mesmo quando a Matriz ou Beast sugere uma especialização.
- Três caminhos de evolução: Matriz/Raças, Divine Beasts e atributos/builds — conferir o desenho exato no código antes de alterar a progressão.
- Diversidade combinatória de builds é uma promessa aspiracional do jogo; não garantir um número específico como balanceado sem contagem verificável.
- História do mundo, classes/linhagens, bestiário e Wiki devem se reforçar mutuamente.
- O combate idle e as métricas de hunt são base para balanceamento futuro.
- Ideias de mercado, negociação entre jogadores e recursos online avançados são futuras; não devem ser apresentadas como existentes.

---

## 3. Decisões explícitas do criador

Use esta lista para evitar reabrir decisões já tomadas:

- A interface do jogo deve evoluir sem remover funcionalidades que já existem.
- Os assets devem ser pixel art. O criador pode produzir imagens enquanto a implementação segue no código.
- Imagens de jogo devem aceitar GIF/Giff, com PNG como fallback. Para fundos de mapa, priorizar a versão animada equivalente quando disponível.
- Poções são configuradas na tela de caça e cada uso automático consome gold diretamente; ativação deve permanecer opcional.
- Forjar, vender e desmanchar pertencem ao **Ferreiro**. Venda deve mostrar valor antes de confirmar; venda/desmanche em lote precisam de seleção por item e por raridade.
- Durante a caça, o Ferreiro fica indisponível.
- O inventário deve empilhar componentes até 999.
- A morte sem Bless deve ter penalidade de itens; o Anel da Guarda Eterna deve impedir a perda. A regra atualmente implementada está descrita na seção 5 e pode ser rebalanceada somente com pedido/contexto.
- Ainda não há negociação entre jogadores. O criador também cogitou uma roleta de ouro para consumir gold excedente; isso é ideia futura, salvo implementação posterior confirmada no código.
- Quests iniciais devem ensinar o jogo por ações contextuais, com sinais visuais, indicador de objetivo e resgate claro.
- O sistema de atributos elementais deve ser compreensível na Wiki e nos detalhes de dano.
- O projeto pode usar inicialmente conta/senha local para preservar progresso; Firebase/nuvem foi mencionado como etapa futura, não assumir que já está conectado.
- Criador testou e aprovou rodadas anteriores de melhorias visuais; preserve os elementos aprovados salvo pedido para mudar.
- Os braceletes/pulseiras ocupam um slot próprio, com regeneração de vida e mana resolvida em cada tick de caça. A pulseira exclusiva do tutorial é uma recompensa permanente e deve continuar idempotente em saves antigos.
- A progressão inicial deve respeitar o onboarding: a cadeia da história do Bosque começa depois de `TUT_BACKPACK`; o Espectro exige nível 15 tanto na interface como na validação de combate.
- Ao balancear monstros, separar pressão de combate (HP/ataque/armadura) de multiplicadores de recompensa. Estrelas não devem multiplicar XP e gold na mesma proporção dos atributos.
- O vault `Mythreon Obsidian/` é uma camada de navegação gerada pelo Cérebro. Não substitui este documento nem interpreta intenção semântica sem registro humano/IA.

---

## 4. Arquitetura atual

### Stack confirmada no projeto

- React 18 + TypeScript, construído com Vite.
- Tailwind CSS e tema visual `arcane`.
- Zustand para estado global em `src/store/gameStore.ts`.
- Persistência local em `localStorage`, com saves locais por conta. Não é backend online.
- Publicação atual historicamente feita por Git/Vercel pelo criador; não assumir que código local foi publicado.
- `npm run build` executa `vite build`. Esse comando **não** executa `tsc --noEmit`; não descreva build como typecheck completo.

### Mapa de código

| Caminho | Responsabilidade |
|---|---|
| `src/App.tsx` | Abas, autenticação local, composição das telas, rotas de missão e contexto global |
| `src/types/index.ts` | Tipos centrais de personagem, itens, inimigos, quests e relatórios |
| `src/data/` | Conteúdo e definições de balanceamento: zonas, itens, componentes, raças, Divine Beasts, quests, skills e relações elementais |
| `src/engine/combat.ts` | Simulação de combate/ticks, dano, stamina, drops integrados e registros de encontro |
| `src/engine/drops.ts` | Geração de itens, raridade, afixos e drops de inimigos |
| `src/engine/stats.ts` | Atributos derivados, níveis e resistências |
| `src/engine/inventory.ts` | Empilhamento, slots, equipar/desequipar |
| `src/engine/save.ts` | Salvar/carregar e migrar saves locais |
| `src/engine/questEngine.ts` | Progresso e resgate de missões |
| `src/store/gameStore.ts` | Ações e transições do estado do jogo; persiste alterações |
| `src/ui/Zone.tsx` | Casa, mapas, combate, configuração de poções, stamina e métricas |
| `src/ui/Personagem.tsx` | Equipamentos, atributos e inspeção de itens |
| `src/ui/Backpack.tsx`, `Depot.tsx`, `Shop.tsx` | Mochila, depósito e Ferreiro |
| `src/ui/Matrix.tsx`, `DivineBeasts.tsx` | Evolução pela Matriz e sistema de Divine Beasts |
| `src/ui/Quests.tsx`, `QuestTracker.tsx` | Quadro de quests, tutorial e rastreamento contextual |
| `src/ui/Wiki.tsx` | História e enciclopédia do jogo |
| `src/ui/AssetImage.tsx`, `ItemIcon.tsx` | Resolução e renderização de assets com fallbacks |
| `src/index.css`, `tailwind.config.js` | Tokens visuais, responsividade e animações CSS |
| `public/assets/` | Artes e sons publicados junto ao jogo |

### Navegação identificada em `App.tsx`

Explorar, Personagem, Mochila, Depósito, Matriz, Divine Beasts, Ferreiro, Jornadas, Duelo e Arquivo/Wiki. Antes de adicionar aba nova, verificar se a função cabe numa aba existente e se já existe componente relacionado.

### Assets

Pastas atuais: `public/assets/backgrounds`, `branding`, `items`, `monsters`, `music`, `pets`, `players`, `ui`, `vfx`. A pasta `imagens/` na raiz também existe. Localizar o asset concreto com busca/listagem antes de criar duplicatas.

---

## 5. Estado dos sistemas — conferido no código/documentação em 31/10/2026

> Resumo de referência, não substitui inspeção dos arquivos atuais. Código mais recente prevalece se divergir.

| Sistema | Estado conhecido | Observação para continuidade |
|---|---|---|
| Combate idle e hunt | Implementado | Tick de 3s; preservar cálculos e simulação online/offline ao mexer no visual. |
| Conta e save | Implementado localmente | `localAccounts.ts` e `save.ts`; não equivale a Firebase/autenticação segura de servidor. |
| Laboratório de Builds | Implementado em 02/11/2026 | `buildLab.ts`, Worker e UI; 20 tentativas/alvo, alternativas reais e hipotéticas, teste de cinco vitórias. Não promete mínimo universal nem lucro garantido. |
| Windows | Protótipo executável em 02/11/2026 | Electron, protocolo local seguro, portátil x64 em `release/`; saves separados do navegador. Sem assinatura digital ou sincronização online. Veja `docs/conhecimento/Laboratorio-de-Builds-e-Windows.md`. |
| Matrizes, síntese e raças | Implementado | Conferir `components.ts`, `races.ts`, `lineages.ts`, `synthesis.ts` antes de alterar pool ou número de builds. |
| Pontos de atributo/build | Implementado anteriormente segundo a conversa | Confirmar `StatAllocation.tsx`, tipos e `stats.ts` antes de afirmar números/regras. A escolha de build pertence ao jogador. |
| Divine Beasts | Implementado como sistema e coleção | Dados/lore em `src/data/divineBeasts.ts`; UI em `src/ui/DivineBeasts.tsx`; não presumir que cada arte criada já está na pasta certa. |
| História e Wiki | Implementado e em evolução | `Wiki.tsx`; conferir assets e conteúdo efetivamente carregados. Wiki deve espelhar regras reais e separar lore de sistemas futuros. |
| Ferreiro, vendas e desmanche | Implementado | `Shop.tsx`, engines de shop/forge/salvage; caça bloqueia acesso segundo a implementação recente. |
| Seletor de venda/desmanche automático | Implementado segundo a última rodada | Há seleção por template/raridade; conferir exclusão/proteção de lendários. |
| Itens e comparação | Implementado | `ItemModal.tsx` compara novo vs. equipado; comparar valores reais, não duplicar os mesmos dados nos dois lados. |
| Stacks até 999 | Implementado para categorias configuradas/migração | `save.ts` migra componentes existentes; não supor que todo item stackable mudou sem checar categoria. |
| GIF/Giff e PNG | Implementado em `AssetImage.tsx` | Conferir caminhos/capitalização dos arquivos e fallback; em hosts Linux, maiúsculas/minúsculas importam. |
| Identidade/logo | Assets existem em `public/assets/branding` | Logo horizontal e marca possuem PNG/SVG. Não substituir logo por texto/emoji sem motivo. |
| Tutorial/quests | Implementado com progressão contextual | Quests em `data/quests.ts`; rastreador abre aba/zona/alvo quando os metadados permitem. Confirmar a etapa no código para cada nova missão. |
| Relatório de hunt | Implementado | Histórico de encontros inclui tempo, dano, XP, gold, loot e valor potencial de venda conforme esquema atual. Saves antigos podem não conter breakdown elementar. |
| Elementos | Implementado recentemente | 12 afinidades, matriz em `elementalChart.ts`, elementos/resistências em criaturas, resistências no personagem, Wiki e dano; afixos elementais aleatórios em armas incomuns+. Rever balanceamento com dados antes de mudar percentuais. |
| Morte, Bless e anel | Implementado recentemente | Sem Bless/anel, mochila e conteúdo são removidos, com 10% adicional de perder item equipado; Bless é consumida e protege itens; anel evita perdas. DeathScreen informa as perdas. É regra severa e deve ser comunicada claramente se alterada. |
| Stamina online/offline | Implementado recentemente | Defaults 120/480 minutos; consumo pela simulação e regeneração cruzada; barras na caça e modal. Confirmar fórmula e `TICK_MS` no código antes de balancear. |
| Flechas T1–T5 | Implementado recentemente | `ARROW_TEMPLATES`, drop por tier, stack 999, slot munição e Wiki. Sem consumo ou efeito de dano até integração explícita no combate. |
| Arena/Duelos | Aba existe | Mecânica e equilíbrio podem evoluir; separar duelo do combate de hunt e não compartilhar alterações de regra sem revisar. |
| Roleta com gold | Planejado/ideia | A ideia foi considerada, mas o foco acordado passou a ser Arena; não marcar como pronta sem encontrar implementação. |
| Marketplace/trade por correio/Discord | Futuro | Ideias do produto; não há infraestrutura de servidor/economia entre contas aqui. Explicar como roadmap, não como função online ativa. |
| Firebase/save na nuvem | Futuro | O criador mencionou aprimorar depois. Necessita serviço, regras de segurança e migração; não simular conexão com armazenamento local. |
| Spritesheet de ataque/magia/dano/morte | Parcial/depende de arte | GIF/PNG existentes funcionam; estados novos precisam de arte e integração. Veja `IMPLEMENTACAO_PENDENTE.md`. |

### Regra elemental atual (resumo; confirmar na fonte)

- Tipos: FOGO, ELETRICIDADE, VENTO, TERRA, AGUA, GELO, MORTE, SAGRADO, PSIQUICO, VENENO, METAL e BASE.
- Base é neutro. Vantagem: 1,25×; resistência: 0,75×. Resistência individual de criatura/personagem é adicional e limitada a 80%. Sem imunidade neste desenho.
- Relações e elementos oficiais do código ficam em `src/data/elementalChart.ts`.
- Dano e registros: `src/engine/combat.ts`; resistências derivadas: `src/engine/stats.ts`; templates/drop: `src/data/items.ts`, `src/data/zones.ts`, `src/engine/drops.ts`.

### Regra de morte atual (resumo; confirmar na fonte)

- XP: perda de 5% com Bless; 15% sem Bless. Gold: perda de 10%.
- Uma Bless é consumida na morte e protege itens.
- Sem Bless e sem anel, perde a mochila e conteúdo; 10% de chance adicional de perder uma peça equipada elegível.
- Anel `UNICO_ANEL_GUARDIA` / “Anel da Guarda Eterna” bloqueia perdas de itens enquanto equipado.
- Código: `src/engine/combat.ts`, item em `src/data/items.ts`, interface em `src/ui/DeathScreen.tsx`.

---

## 6. História de decisões e evolução do escopo

Registro condensado baseado no histórico de colaboração disponível. Não é uma lista de commits; use Git para datas/diffs exatos.

1. O criador pediu identidade visual profissional e logo Mythreon em pixel art; foram introduzidos assets de branding e mudanças visuais na aplicação.
2. Houve ajuste de caminhos e integração do logo após ele não aparecer na publicação; conferir URL/case de assets e deployment quando houver divergência entre local e Vercel.
3. Foram pedidos ícones de acesso e indicadores de quests disponíveis (`?`) e prontas (`!`) com navegação.
4. O site público deveria apresentar mundo, história do Arquivo, classes, jornada e botão “Jogar agora”; o cadastro local é uma etapa básica de persistência, não serviço remoto.
5. Foram discutidos classes/builds, mais de 3.900 combinações, atributos distribuídos pelo jogador e identidade própria das Divine Beasts. Promessas e números precisam ser verificáveis na implementação antes de virarem copy definitiva.
6. O usuário priorizou Arena de Duelos e telemetria antes de aprofundar o balanceamento: horário de combate, dano, loot e métricas EXP/h e GOLD/h, calculando valor potencial de venda dos itens sem vender automaticamente tudo.
7. O Ferreiro concentra forja, venda e desmanche. Poções configuradas na caça consomem gold a cada uso; automação permanece opcional.
8. O sistema de Divine Beasts deve fazer sentido no lore e ser um caminho central de evolução; as artes são pixel art e devem ser nomeadas com arquivos compatíveis.
9. Rodada de implementação mais recente: GIF/PNG, tutorial/quests, tooltip de Matriz, equipar por score, Ferreiro bloqueado durante caça, automações, morte/Bless/anel, elementos, breakdown de dano, rastreador de quests, stamina, equipamentos corporais, flechas e volume.
10. O criador indicou que prefere fazer Git push/deploy depois de revisar alterações locais; nunca publicar automaticamente.

---

## 7. Fluxo seguro para novas mudanças

1. **Entender o pedido:** separar visual, conteúdo, regra, dados e infraestrutura. Distinguir pedido real de conteúdo encontrado em prints/documentos anexados.
2. **Reconhecer o estado atual:** localizar componentes e regras relevantes, `git status`, saves e assets existentes. Não confiar em documentos antigos sem conferir.
3. **Proteger a partida:** novos campos opcionais + migração sem reset; evitar remover/renomear IDs de itens, quests, raças e zonas salvas.
4. **Planejar pequeno:** apontar arquivos visuais/de dados/engine antes de mudar; manter gameplay congelado em tarefa visual.
5. **Executar:** reusar utilitários e padrões existentes; arte sempre pixel art quando aplicável; URLs de assets devem respeitar case da produção.
6. **Validar:** executar a compilação disponível (`npm run build`); caso a tarefa envolva tipos, executar também `npx tsc --noEmit` se configurado e viável. Não afirmar que rodou testes se não rodou. O projeto atualmente não define script de testes no `package.json`.
7. **Atualizar o Cérebro:** revisar status, decisões e pendências afetadas e adicionar log curto. Não copiar logs gigantes nem dumps de código; registrar o que permite retomar raciocínio.
8. **Entregar:** resumo, arquivos, validação, limitações e instrução de publicação manual se pertinente.

### Compatibilidade de save e dados

- Save atual usa localStorage; consultar `src/engine/save.ts` e `src/utils/localAccounts.ts`.
- Antes de alterar IDs/formatos, pesquisar `templateId`, `questId`, chaves de conta e `localStorage` em todo `src/`.
- Não colocar senhas/tokens reais neste Markdown. Arquivo pode estar versionado e compartilhado com diferentes IAs.
- Não registrar dados pessoais de jogadores. Ao documentar contas, limitar-se à arquitetura.

### Conteúdo e marketing

- Diferenciar o que **existe hoje** do que **está planejado** em site, Wiki, tutorial e anúncios.
- Itens raros “que podem valer dinheiro”, economia entre players e pagamentos são ideias do produto; não alegar valor monetário real ou trade ativo sem sistema implementado, regras e revisão adequada.
- Conteúdo do lore deve manter nomes e fatos consistentes entre `Wiki.tsx`, dados e artes. Se o lore não estiver no código, documentar como proposta em vez de canon.

---

## 8. Pendências e próximos passos conhecidos

### Pendente por asset/produção

- Criar sprites pixel art separados para estados idle/ataque/conjuração/dano/morte por personagens e, se necessário, monstros; integrar os eventos sem mexer no tempo ou dano do combate.
- Confirmar que as artes locais desejadas estão em `public/assets/` e com os nomes que o código procura. Não inferir que enviar arte ao Git/Vercel significa que o componente a referencia.

### Futuro de produto (não fazer sem priorização)

- Balancear Arena com registros de combate reais.
- Melhorar relatório de progresso offline para que valores exibidos correspondam à simulação efetivamente processada; revisar antes de tocar no comportamento atual.
- Avaliar roleta que consome gold sem criar vantagem desproporcional ou recompensa monetária.
- Backend/Firebase, contas remotas e sincronização; posteriormente avaliar marketplace/trade por correio/Discord e segurança server-side.
- Expandir conteúdo de lore, classes, builds, quests e Divine Beasts conforme roteiro do criador.
- Decidir se flechas devem ser consumíveis/afetar dano. Atualmente são munição de coleção/equipamento, não alteram a luta.

`IMPLEMENTACAO_PENDENTE.md` é o relatório detalhado da rodada de sistemas/imagens mais recente. Ele pode ser atualizado ou arquivado após a próxima revisão, mas este `CEREBRO_MYTHREON.md` deve permanecer como índice permanente de continuidade.

---

## 9. Registro de continuidade

### 2026-10-31 — criação do Cérebro do Projeto

- **Pedido:** criar um arquivo central dentro do projeto para que IAs diferentes entendam o jogo e continuem do ponto correto com menos repetição.
- **Criado:** `CEREBRO_MYTHREON.md`.
- **Registrado:** identidade, decisões persistentes do criador, arquitetura, mapa de arquivos, estado conhecido dos sistemas, histórico do escopo, pendências e instrução para futuras IAs manterem este documento.
- **Validação:** conferidos `package.json`, estrutura de `src/`, assets e documentos prévios (`MYTHREON_CONTEXTO_IA.md`, `Arquitetura_Mythreon.md`, `IMPLEMENTACAO_PENDENTE.md`, `ideiasclaudemythreon.md`). Os dois documentos antigos de contexto descrevem estados anteriores; este arquivo manda conferir o código atual.
- **Próxima atualização:** na próxima solicitação, conferir `git status` e código; revisar a tabela da seção 5 e acrescentar nova entrada aqui ao implementar algo.

### 2026-10-31 — índice neural sincronizado

- **Pedido:** fazer o Cérebro absorver alterações feitas na pasta e manter contexto compacto entre diferentes IAs; investigar compactação e criptografia.
- **Criado:** `scripts/mythreon-brain.mjs`, `.mythreon-brain/neurons.json` (índice legível gerado) e `.mythreon-brain/state.json` (estado local de hashes ignorado pelo Git); comandos `brain:sync`, `brain:watch`, `brain:seal`, `brain:open`; `npm run dev` inicia o observador junto ao Vite.
- **Decisão técnica:** cada arquivo vira nó com metadados compactos; dependências e tópicos formam arestas de contexto. O texto semântico permanece no Markdown porque o observador não deve inventar intenções nem resumir incorretamente mudanças de gameplay.
- **Criptografia:** cópia de arquivo compactada com Gzip e protegida por AES-256-GCM é opcional. A versão legível continua sendo a memória de trabalho das IAs. A chave fica no ambiente local e nunca no Git.
- **Validação:** `node --check scripts/mythreon-brain.mjs`, `npm run brain:sync` e `npm run build` passaram; índice catalogou 310 arquivos, 22 tópicos e 656 relações em aproximadamente 30 KB. O observador registrou uma criação e remoção de arquivo de prova em tempo real. `npm run dev -- --host 127.0.0.1` iniciou Vite e watcher, preservando o encaminhamento de argumentos. Gzip + AES-256-GCM foi selado, restaurado e comparado com sucesso; chave e artefatos temporários foram removidos.
- **Limite operacional:** o observador roda com `npm run dev` ou `npm run brain:watch`. A inicialização automática no login do Windows não foi configurada porque o acesso à pasta Inicialização não foi concedido.

### 2026-11-02 — progressão, pulseiras, Arena e Obsidian

- **Pedido:** concluir pendências da lista, substituir imagens ausentes de itens por emoji até que a arte exista, criar pulseiras com regeneração, reduzir avanço acelerado, melhorar tutorial e Arena e ligar o Cérebro ao Obsidian.
- **Implementado:** pulseiras T1–T5 no slot próprio; regeneração de HP/MP a cada tick; categoria reconhecida por loot, mochila, depósito, comparação, venda, desmanche e Wiki. A Pulseira do Primeiro Eco é recompensa lendária exclusiva do tutorial; saves que já tinham concluído `TUT_BACKPACK` recebem a peça uma vez no carregamento, e há fallback para o Depot quando a mochila está cheia.
- **Balanceamento inicial:** XP/gold de criaturas agora escalam com as estrelas pela fórmula `1 + (dificuldade - 1) × 0,35`, enquanto atributos de combate continuam escalando pelo desafio. A história do Bosque depende da conclusão do tutorial; o Espectro foi reforçado e exige nível 15, inclusive em alvos antigos salvos.
- **Arena:** escolha de plano Assalto/Guarda/Precisão agora afeta dano, risco e chance de crítico; a ordem das cartas selecionadas define a ordem da formação.
- **Imagens:** `ItemIcon` já mostra emoji quando não encontra PNG; o relatório de arte lista os 17 arquivos visuais faltantes e prompts individuais em `docs/ARTE_ITENS_PENDENTES.md`.
- **Obsidian:** `scripts/mythreon-brain.mjs` gera o vault `Mythreon Obsidian/` com nota inicial, mapa, notas linkadas por tópico e cópia deste Cérebro. O observador ignora essa pasta para evitar loop. `Ativação Cérebro.bat` inicia a observação por duplo clique.
- **Limites e continuidade:** a Arena ainda resolve os turnos automaticamente após a escolha tática; um duelo com ações manuais por turno é uma etapa posterior. Ajustes globais de mob devem ser refinados com amostras dos relatórios de hunt por zona, nível e build, depois desta primeira redução de recompensas. O Cérebro indexa alterações de arquivos, mas não substitui notas semânticas.
- **Próxima etapa:** comparar kill/time/death e XP/h dos relatórios para os cinco tiers, então ajustar monstros individualmente e evoluir a Arena para turno interativo.

### 2026-11-02 — Shop, premium e caminho das Beasts

Shop separada, treino diário por gold, bônus premium de caça +10%, vials exclusivos por família, 12 ataques elementais de Beast e crescimento por nível, companheiro no mapa e ícones maiores. Consulte docs/conhecimento/Shop-Premium-Beasts.md para fórmulas, arquivos, evidências e pendências. Estado parcial: contratação premium, Market, correio, quests cosméticas e equilíbrio completo por simulação ainda pendentes; não anunciar como disponíveis. Artes originais preservadas.

### 2026-11-02 — auditoria de balanceamento URAIA

Pedido: revisar drops, gold, dano, defesa, resistências, vantagens e dano por nível. Referência URAIA usada como estilo de análise, sem infraestrutura ou consciência técnica adicional. Implementadas fórmulas centrais em src/data/balance.ts, atributos base simétricos ATK/MATK, treino exclusivo por arma, mitigação com retornos decrescentes, crítico e sorte funcionais, limite de resistências 60%, raridade nova, recuperação reduzida, curva XP contínua e migração proporcional. Corrigidos HP/MP zero na recálculo e quantidades de venda inválidas.

Evidência: 3 rodadas de 1.368 encontros (antes/depois/preparado), 100.000 sorteios de raridade por rodada e asserções funcionais. Relatório e limites: docs/conhecimento/Balanceamento-Combate-Economia.md; executor scripts/balance-audit.cjs. Build de produção passou. Estado: balanceamento revisado e auditado por amostra, sem equivalência exaustiva de builds ou validação de campanha contínua. Próximo: testes contínuos de 30 min e extremos de vials/afixos/upgrades e todas as combinações de Matriz.

### 2026-11-02 — treino, maestria e propostas de diferenciais

Treino agora mede tempo efetivo, usa curva quadrática e concede maestria separada de pontos distribuídos. +1% por nível treinado no ataque/armadura correspondente até 30%; alma dá regen MP por marcos. Conquistas únicas aos 5 min, 30 min, 2 h e 10 h dão gold e Fragmentos, com fallback no depósito. Iniciar treino sem aguardar não dá progresso; jogo aberto, atraso de aba limitado a60 s, sem treino offline. Skills/XP antigos preservados; maestria não é inventada para saves legados.

Arquivos: engine/training.ts, stats.ts, store/gameStore.ts, types/index.ts, ui/TrainingProgress.tsx, Zone.tsx, scripts/balance-audit.cjs. Build e asserções de treino passaram. Pesquisa em fontes oficiais Melvor Idle, IdleOn e wiki Kittens fundamentou propostas, registradas em docs/conhecimento/Treino-e-Diferenciais-Mythreon.md. Proposta principal: Cicatrizes da Essência, estados reversíveis de regiões ligados à forma de caçar e a decisões narrativas. As 12 propostas adicionais ainda não foram implementadas; não anunciar como existentes.

### 2026-11-02 — Laboratório de Builds e primeiro executável Windows

Pedido: laboratório que oriente a preparação para cada mapa e versão executável Windows. Implementados engine/buildLab.ts, buildLab.worker.ts e ui/BuildLab.tsx, integrados ao App. Simula cópia isolada, 20 tentativas/alvo com seed/relógio controlados; informa bloqueios, métricas e planos de poções, itens próprios, treino, farm raro e nível; opcionalmente compara coleção e testa cinco vitórias seguidas. Preserva save/gold/itens reais e não apresenta resultados probabilísticos como requisitos exatos.

Windows: Electron 45.2.1 + electron-builder 26.18.0, desktop/main.cjs e electron-builder.json; protocolo local mythreon seguro, Node desligado no renderer e sandbox ligado. Gerado portátil x64 release/Mythreon-Online-0.1.0-Windows-x64.exe. Saves em perfil próprio, separados do site; versão de desenvolvimento não assinada. ASAR desativado após falha de integridade de manifesto; cópias diretas de dist verificadas por hash. O ambiente restrito não inicia Chromium corretamente; smoke test com conta normal do Windows passou com UI, logo, WebCrypto, isolamento e Worker (8 alvos/6 planos).

Validação: scripts/build-lab-check.cjs passou em não mutação, orçamento, bloqueios, RNG/relógio, repetibilidade e timeout; build passou. Typecheck global conserva erros antigos fora dos novos módulos. Cadeia de build tem advisories npm pendentes, sem correções major automáticas. Documentação e comandos em docs/conhecimento/Laboratorio-de-Builds-e-Windows.md. release e .obsidian ignorados pelo Git/observador; não indexar binários de saída. Próximos passos: playtest visual prolongado, migração web/desktop, identidade/assinatura do executável e revisão da cadeia de ferramentas antes de lançamento comercial.

Verificação final Windows: o próprio portátil foi aberto em teste oculto com conta normal; código 0, interface/asset/WebCrypto/isolamento e Worker (8 alvos/6 planos) confirmados. 187 arquivos dist e main verificados. Evidências em release/windows-smoke-test.json, verification.json e checksums.sha256; pasta release é saída ignorada, não memória autoral.

### 2026-11-02 — fonte de conhecimento no Obsidian e observador v2

Pedido: corrigir EBUSY da captura e estruturar Obsidian como base de conhecimento. Identificada execução antiga em memória lendo release/electron.exe; notas originais permaneciam no disco. Criados entrada Comece aqui, índice autoral, estado/pendências, operação e registro de problemas; notas existentes mantidas em docs/conhecimento. Cópias técnicas antigas preservadas em Mythreon Obsidian/Arquivo, sem cópia concorrente ativa deste Cérebro. Catálogo gerado aponta para originais; grafo padrão foca conhecimento e conexões técnicas usam somente relações observadas.

Código: brain-core.mjs centraliza exclusões, coleta tolerante a falhas, inventário de assets sem leitura, escrita por substituição e lock; mythreon-brain.mjs publica estado ok/parcial/erro, journal completo de caminhos, retry periódico; brain-service.mjs recarrega o observador e reinicia após falha. Ambos os bat iniciam o supervisor v2. Novas notas do Obsidian vão a docs/conhecimento; configurações anteriores preservadas em .mythreon-brain/backups. AGENTS.md e prompt de documentação v2 orientam futuras IAs a atualizar as fontes.

Validação: npm run brain:check passou em exclusões de binários/segredos, EBUSY com preservação do índice, assets sem abertura, escrita por substituição, notas preservadas, migração reversível, lock contra duplicatas, eventos e recarga real de processo. npm run brain:sync concluiu estado ok. Limite: conteúdo semântico ainda é escrito por IA/criador; o observador não transforma sozinho todas as conversas/código em conhecimento interpretado. Fechar janela antiga e reabrir ativação uma vez; reabrir gráfico no Obsidian para carregar filtros.


## Continuidade — 2026-11-02 — Jornada, lore e biomas

Nova fonte autoral: [[docs/conhecimento/Jornada-Lore-Biomas|Jornada, lore e biomas]]. Ler esta nota antes de alterar tutorial/economia/mapas. Novos personagens têm intro e 14 quests graduais, Matriz apenas depois dos lobos, tutorial pausa caça e treino ao concluir. Não reativar caça automática no cadastro. Nunca liberar travessia apenas por nível: contratos com NPC validam e consomem recursos atomicamente. Salvar acessos permanentes em unlockedZoneIds, preservar veteranos journeyVersion=0. Nova curva XP gradual com migração por fração. Lore centralizada em src/data/worldJourney.ts e compartilhada com Wiki/quests. Novos mapas opcionais Veyra e Kaelor usam gradientes/emojis enquanto faltam artes; prompts em docs/ARTE_BIOMAS_MYTHREON.md. Não apagar PNGs transparentes: AssetImage prioriza PNG apenas em players e GIF/GIFF nos demais. Falha de mob não pode alterar o estado visual do personagem. Testes: journey:check, typecheck, build-lab-check, brain:check e journey-ui-check em perfil separado. Sem reset de saves, push ou deploy.

Entrega Windows da Jornada: win-unpacked atualizado e testado (187 arquivos conferidos); portátil único continua anterior por falta de espaço em C:. Não informar que o portátil contém as novas quests. Ver release/journey-verification.json e nota Jornada-Lore-Biomas. Artes novas ainda são prompts/fallbacks, não imagens geradas.

## Continuidade — HP/MP e raridades — 2026-11-02

loadGame deve recalcular atributos derivados antes do combate. Nunca confiar em hpMax/mpMax antigos do cache nem concatenar bônus legados como strings. UI usa formatVital/vitalPercent; precisão do combate preservada. Regras detalhadas e evidências em docs/conhecimento/Balanceamento-Combate-Economia.md. Raridades são compartilhadas em src/ui/itemRarity.ts, ItemIcon e CSS, sem copiar mapas de brilho por tela. Comum neutro, verde sem aura, azul suave, roxo forte, dourado pulsante. Testes vitals-check.cjs e journey-ui-check.cjs ampliados.

## Continuidade — contas online e comunidade — 2026-11-02

Usuário escolheu preparar Supabase, pois ainda não tem projeto. Nova fonte: docs/conhecimento/Contas-Online-e-Social.md; ativação em docs/ATIVAR_MUNDO_ONLINE.md. Auth real/servidor/Postgres foram implementados, mas NÃO configurados/publicados no serviço hospedado. Testes locais usam Auth/Realtime simulados e PostgreSQL em memória. Não afirmar cadastro público ativo.

Motor isolado por createGameStore(runtime), servidor sem timers/localStorage. Cliente envia comandos, nunca Character/saldo editável. Recibos de idempotência, bloqueios ordenados, escrow, RLS e confirmação de revisão protegem transferências. Mesma conta até três personagens; 36 rankings; chat global/privado; VIP; correio; troca bilateral. Taxa 10 + ceil(2% gold) por envio/lado, nível5+iniciação para transferir, relíquia inicial vinculada. Servidor controla ticks e bônus de balloon; não aceitar DEBUG ou arena local como fonte de riqueza online.

Saves locais continuam intactos; Baixar backup disponível no modo local. Importação de veteranos não está implementada e exige aprovação/validação para proteger a economia. Expiração de troca é resolvida ao interagir, sem cron. SMTP real, projeto, Vercel e testes de carga/concorrência ainda pendentes. Não colocar DATABASE_URL/service_role em VITE_. Sem push/deploy e sem rebuild dos executáveis antigos nesta migração.

## Ativação do mundo online — 2026-11-02

Usuário autorizou ativar/publicar e informou não ter projeto Supabase nem SMTP. Site já recebeu commit 17958bf por ação do usuário; /api/world apresentou crash HTTP500 antes do handler. Nova arquitetura de empacotamento: server/http.ts → server/generated/online-runtime.cjs, api/world.js wrapper ESM explícito. npm run online:bundle e online:bundle-check; npm run build regenera o runtime. Teste real do entrypoint em scripts/online-runtime-check.mjs. Serviços reais continuam dependentes de conexão/criação pelo usuário; acompanhar estado confirmado, não afirmar ativação apenas por build/deploy.

Verificação final da correção de ativação: commit 9f4285b enviado para origin/main; Vercel agora retorna GET405 e POST503 em /api/world, ambos JSON, sem o crash FUNCTION_INVOCATION_FAILED. Site HTTP200. Portanto código publicado, serviços ainda NÃO ativados. Usuário confirmou que não criou projeto Supabase e não tem SMTP. Integrações Supabase/Vercel sugeridas, última verificação sem instalação/conexão. Precisa do acesso autorizado para criar/configurar projeto, banco e e-mails. Reconferir ferramentas/conexões quando o usuário retornar; não perpetuar um bloqueio antigo após conectar.

## Correção do Ferreiro — upgrade de flechas e validação de equipamentos — 2026-11-03

O Ferreiro exibia flechas na interface, mas o servidor online rejeitava o upgrade porque a lista de categorias permitidas não incluía `FLECHA`. A validação local e online foi unificada para aceitar somente `ARMA`, `ARMADURA`, `JOIA`, `PULSEIRA`, `ESCUDO` e `FLECHA`; poções, materiais, fragmentos e demais itens continuam fora do upgrade por design. Flechas T1–T5 agora possuem atributos de ataque/acerto, permanecem não empilháveis e podem ser vendidas e desmanchadas.

Arquivos: `src/data/items.ts`, `src/engine/forge.ts`, `src/ui/Shop.tsx`, `server/game.ts`. `npm run typecheck` passou após a correção. Antes de publicar, revisar o Ferreiro em conta online, testar uma flecha de cada tier e confirmar que os demais equipamentos continuam consumindo fragmentos/ouro e elevando os atributos. Não afirmar deploy até o usuário executar commit/push e a Vercel concluir a implantação.

Recuperação do tutorial: se `TUT_FORGE` estiver ativa e o personagem não tiver nenhum equipamento aprimorável na mochila, ao reabrir o Ferreiro é criada uma `ESPADA_T1` de prática, sem alterar gold, itens equipados ou regras de gameplay. Isso resolve saves em que o jogador desmontou tudo antes da etapa de forja. O runtime gerado também foi atualizado manualmente porque `npm run online:bundle` continua bloqueado pelo erro de permissão do OneDrive no esbuild; executar o bundle em ambiente com acesso normal antes do próximo deploy.

## Refúgio visual e seleção de mapas — 2026-11-03

A tela inicial de Explorar representa a cabana-base do aventureiro: interior mobiliado com lareira, mesa de mapas, armas, poções, cama e baús, em vez de um fundo abstrato. Asset gerado: `public/assets/backgrounds/cabana.png`. Os cards de caça agora usam a miniatura do tema de cada mapa, exibem a faixa `Nível mínimo–máximo` e mantêm o bloqueio por missão/nível. A navegação superior pode rolar horizontalmente em telas estreitas, sem exigir arrastar a página inteira. Arquivos: `src/ui/Zone.tsx`, `src/App.tsx`. Próximo passo visual: substituir gradientes/emoji restantes por artes específicas de cada bioma quando forem aprovadas.

Atualização: clicar no card do mapa agora abre uma ficha modal sobre a miniatura do bioma, com criaturas, atributos básicos, drops conhecidos, elementos, vantagens e desvantagens. A entrada na caça só ocorre pelo botão de confirmação dentro da ficha; mapas bloqueados continuam informativos, mas não podem ser iniciados.

## Balanceamento de afixos e correção de upgrades legados — 2026-11-03

Itens antigos de flecha podiam ter `stats: {}` porque foram criados antes da flecha receber atributos. O Ferreiro agora hidrata os atributos-base pelo template e reaplica os multiplicadores dos níveis já existentes antes de aplicar o próximo upgrade; isso corrige flechas +1/+2 sem resetar progresso. A mesma proteção vale para qualquer equipamento legado com estatística ausente.

As faixas percentuais de afixos foram centralizadas em `src/data/affixes.ts` e aplicadas por `src/engine/drops.ts`: comum 0,5–1,5%, incomum 1,2–2,5%, raro 2–4%, épico 3,5–6% e lendário 5,5–9% (tier acrescenta até 48% sobre a faixa). Dano crítico usa faixas próprias maiores: 5–10%, 8–15%, 12–22%, 18–30% e 25–40%. Afixos inteiros escalam separadamente por raridade para evitar que HP/armadura explodam; comuns passaram a ter um único afixo pequeno, incomuns um, raros dois, épicos três e lendários quatro. O runtime online gerado foi sincronizado manualmente enquanto o esbuild continua bloqueado pelo OneDrive. Revalidar por simulação antes de declarar equilíbrio final.

## Mythreon Shard, Mythreon Coin e economia rara — 2026-11-03

Toda criatura viva pode liberar uma pequena quantidade de Mythreon Shards ao morrer. A chance é baixa e cresce suavemente com a dificuldade, o nível mínimo do monstro e 50% adicional em chefes; criaturas de dificuldade 4–5 e chefes podem liberar duas unidades em vez de uma. O drop é registrado no combate como `🔷` e persistido no personagem, sem depender do inventário.

Refino atual: `100 Shards + 25.000 gold = 1 Mythreon Coin`. O preço alto funciona como sumidouro de gold e mantém a moeda rara; a interface oferece refino unitário e máximo possível. A Loja Especial aceita Coins para três ofertas iniciais: Sigilo do Primeiro Eco (8), Núcleo de Fragmento Épico (1) e Anel da Guarda Eterna (75). A compra exige espaço na mochila e grava o item normalmente.

Arquivos: `src/data/mythreonEconomy.ts`, `src/types/index.ts`, `src/engine/combat.ts`, `src/engine/save.ts`, `src/store/gameStore.ts`, `src/ui/Shop.tsx`, `src/ui/CombatLog.tsx`, `server/game.ts`, `server/generated/online-runtime.cjs`. O painel Mercado Negro foi criado como área reservada; anúncios globais entre personagens ainda exigem a próxima migração transacional (`world_market_listings`) e não devem ser anunciados como ativos até essa etapa.

Regras de segurança: o cliente só envia quantidade/ID; o servidor valida refino, oferta, saldo e itens. Não colocar chaves Supabase em VITE_. Testes executados após a implementação: `npm run typecheck` e `node --check server/generated/online-runtime.cjs`. Ainda falta commit/push e deploy pelo usuário.

## Refúgio narrativo e identidade do aventureiro — 2026-11-03

A tela pós-morte retorna ao Refúgio com o botão `🧘 Meditar e renascer no Refúgio`. Os controles antigos de Meditar/Mapas foram retirados da fileira superior da cabana; a entrada agora usa linguagem de descoberta: “Comece uma nova aventura”, “Conhecer áreas” e “Preparar evolução”. As cartas de mapa continuam sendo o ponto de entrada das caçadas.

A criação local de personagem passou a guardar `CharacterAppearance`: corpo, pele, cabelo, cor do cabelo e roupa inicial. O estado humano continua usando a linhagem humana existente no mapa; a aparência é persistida para receber sprites pixel-art compostos posteriormente. A criação online ainda mantém o fluxo anterior e deve receber o mesmo editor visual em uma etapa seguinte, com validação server-side dos valores permitidos.

## Trade seguro, auditoria e estatísticas — 2026-11-03

As trocas continuam usando escrow: itens e gold são retirados da origem antes da confirmação, ficam reservados na oferta e só são entregues depois que os dois lados confirmam a mesma revisão. O servidor trava os personagens e a troca dentro da transação do request, aplica idempotência por `request_id`, impede itens vinculados e devolve reservas em cancelamento/expiração.

Foi criada a migration `supabase/migrations/003_trade_audit.sql`. A tabela `world_trade_transactions` registra cada lado concluído com `trade_id`, vendedor, comprador, owners, gold recebido, taxa, snapshot dos itens, itens da contraparte, quantidade e horário. A view `world_trade_item_stats` calcula eventos de venda, unidades vendidas, preço médio, mínimo, máximo e última venda por `templateId`. A tabela é privada por RLS; apenas participantes autenticados consultam seu histórico, e a API do servidor é a única escritora.

`server/world.ts` grava duas linhas de auditoria por troca concluída e devolve `tradeHistory` e `tradeStats` no `social.read`. O banco publica mudanças de `world_trade_transactions` em Realtime após a migration 003. Executar as migrations em ordem antes de testar produção; sem a 003, o runtime antigo não deve receber trocas novas.

## Pets, atividades e Boss Diário — 2026-11-03

Implementada a primeira camada de vocação das Bestas Divinas: ovos T1–T5, eclosão, fusão de quatro cópias com Ração do Domador, encontros Elite e estado persistente de nutrição/humor. O ataque da Besta usa cadência-alvo de 5 segundos; fome e humor baixo reduzem o dano sem substituir Matriz ou Treino. Saves antigos recebem `divineBeastNeeds` e `divineBeastAttackTimerMs` por migração.

Arquivos desta rodada: `src/types/index.ts`, `src/engine/save.ts`, `src/store/gameStore.ts`, `src/data/items.ts`, `src/data/beastCombat.ts`, `src/engine/combat.ts`, `src/ui/DivineBeasts.tsx`, `server/game.ts`, `server/generated/online-runtime.cjs` e `docs/conhecimento/Pets-Atividades-Boss-Diario.md`.

Baú por tempo online, recompensa diária, cards, mineração, pesca e Boss cooperativo estão especificados como próximas camadas. O Boss Diário não deve ser anunciado como pronto enquanto não houver autoridade de servidor, transações idempotentes, RLS, rate limit e testes de concorrência; o cliente não pode decidir HP, dano ou loot.

## Direção de produto e arte — 2026-11-03

O novo ciclo foi dividido para preservar funcionamento: catálogo visual; Ferreiro avançado e economia Mythreon Coin; calendário diário e Jornal de Mythreon; pesca/mineração com progressão por habilidade; treino manual; rebalanceamento de monstros; Boss Diário cooperativo com servidor autoritativo. Nomes exatos, pastas, paletas e regras das pranchas estão em `docs/ARTE_MYTHREON_FASES_FUTURAS.md`.

Regras econômicas: elevar tier e reroll comum usam recursos do Ferreiro; sortear atributo específico custa Mythreon Coin e deve ser cerca de cinco vezes mais caro; cosméticos premium podem alterar brilho, aura e skin, mas nunca dano, HP, drop ou velocidade. O calendário de 30 dias pode conceder uma skin mensal; recompensas beta devem ser vinculadas à conta e auditáveis.

Primeira etapa da sequência profissional iniciada: Ferreiro agora possui elevação de Tier até T5 e sorteio de atributo específico usando Mythreon Coin + 100 Fragmentos Raros. O sorteio específico é deliberadamente caro e o tier aumenta os stats do item de forma controlada. Pranchas geradas foram salvas como `public/assets/items/prancha-mythreon-ovos-baus-ferreiro.png`, `public/assets/items/prancha-mythreon-pesca-mineracao.png` e `public/assets/ui/prancha-mythreon-efeitos-skins-jornal.png`.

Segunda etapa iniciada: calendário mensal com 30 marcações, Cupom de Resgate comprado por 1 Mythreon Coin, sequência diária, bônus semanal a cada 7 dias e recompensa cosmética aos 30 dias (`Capa do Primeiro Canto`). A interface está em `src/ui/DailyCalendar.tsx` e integrada ao Refúgio; a arte está em `public/assets/ui/prancha-calendario-sequencia-skin-mes-01.png`. O bônus de calendário não concede stats de combate.

Complemento visual salvo em `public/assets/ui/prancha-peixe-cicatriz-skin-addon.png`: `PEIXE_CICATRIZ.png`, `SKIN_PREMIUM_MES_01.png` e `ADDON_BOSS_LUMINESCENTE.png`, nesta ordem visual.

## Continuidade — Pack 48 — 04/11/2026

Corrigidos nocaute/vencedor, atalho de resolução, HP do desafiado e ligas do PvP; resgate de anúncios expirados, taxa limitada ao preço e compra duplicada de ferramentas. Fontes: server/world.ts, src/store/gameStore.ts, OnlinePvP.tsx, OnlineMarket.tsx, Professions.tsx e scripts/online-check.ts. Ver docs/conhecimento/Pack-48-Integridade-PvP-Mercado-2026-11-04.md. Não houve deploy. Auditoria do Pack 46 encontrou aplicação redundante da mesma resposta, portanto não considerar a latência resolvida sem testar fila otimista.

## Continuidade — Pack 49 — 04/11/2026



Boss Diário ganhou pendências por ciclo, resgate antigo por runId, fechamento de janelas vencidas, proteção de criação por cycle_key, recompensa apenas com dano, limite de overkill, preservação de bônus recente e entrega de loot sem duplicar stack parcial. Teste online local passou com três usuários serializados, incluindo rollback de resgate sem espaço. Não é teste concorrente real. Fonte autoral: docs/conhecimento/Pack-49-Boss-Ciclos-e-Recompensas-2026-11-04.md. Sem schema novo ou deploy. Continuar mapa cooperativo, ataques/dano do Boss, escala real e reconciliação otimista do cliente.

## Continuidade — Pack 50 — 04/11/2026

DailyBossArena.tsx e CSS próprio apresentam bioma, herói, Boss, aliados, cosméticos, HP e dano confirmado. API retorna whitelist pública de roster; online:check validou campos e fluxos anteriores. Prévia Electron oculta scripts/daily-boss-arena-check.cjs passou em PC e 390px, com capturas em node_modules/.cache/boss-arena. Componentes foram inspecionados visualmente. Não alegar real-time por golpe: remotos ainda são agregados por polling de dez segundos. Falta retaliação do Boss, regras defensivas, inscrição próxima e testes com múltiplas conexões. Fonte: docs/conhecimento/Pack-50-Arena-Visual-Boss-Cooperativo-2026-11-04.md. Sem deploy.

## Continuidade — Pack 51 — 04/11/2026

Boss recebeu retaliação server-side e Character.dailyBossBattle isolado de HP/MP/Bless/hunt. Funções puras em src/engine/dailyBossBattle.ts; snapshot ao entrar, nocaute com 30s, reinscrição sem cura, último golpe sem retaliação, escala por participantes e mitigação compartilhada. Estado e contribuição gravados na mesma transação; sem schema novo. Arena inclui vida privada, dano recebido e recuperação. Evidências e pendências em docs/conhecimento/Pack-51-Retaliacao-e-Vida-Cooperativa-2026-11-04.md. Não houve deploy.

## Continuidade — Pack 52 — 04/11/2026

Corrigido histórico do Mercado: referências agora incluem compras efetivas e trades comparáveis; moeda, raridade, tier e upgrade separados e preço por unidade ponderado. server/marketAnalytics.ts calcula salesHistory sem schema novo; UI antiga priceStats mantida na API para compatibilidade. Lotes configuráveis, taxa/líquido, gráfico e tabela diária adicionados. online:check verificou aritmética, integração, variantes, moedas, replay e exclusão de barter/múltiplos itens. Prévia scripts/market-ui-check.cjs passou PC/390px com líquido950 para lote1000. Fonte: docs/conhecimento/Pack-52-Mercado-Lotes-e-Precos-Reais-2026-11-04.md. Não houve deploy; medir carga e criar moderação continuam pendentes.

## Continuidade — Pack 53 — 04/11/2026

Mineração/Pesca T1–T5 completadas com cinco recursos novos, travessias validadas no domínio, pulso visual por segurar/soltar, teclado, cancelamento e recarga compartilhada. Dez receitas com margem de venda; Caldo agora usa COLHEITA_MELANCIA e alimenta o Pet (+40 nutrição/+10 humor). ItemIcon/emoji, Wiki/Jornal e prompts de arte atualizados. professions:check, online:check, typecheck, build e prévia Electron PC/390px passaram. Documento: docs/conhecimento/Pack-53-Profissoes-Tiers-e-Pulso-2026-11-04.md. Sem deploy. Não chamar de anti-macro seguro: precisão ainda vem do cliente. Próximos pontos: cenas de profissão, isca e destinos no Ferreiro, desafio validado no servidor, reconciliação online e biomas laterais.

## Continuidade — Pack 54 — 04/11/2026

Corrigidos calendário fixo de 30 dias, bônus por ISO que saía antes de mais sete presenças, contagem mensal via sequência anterior e skin perdida em bolsa cheia. Regras em src/data/dailyCalendar.ts e entrega clonada em src/engine/dailyCalendar.ts. Novos direitos Character.calendarUnlockedSkins preservam skin sem bolsa; marcador mensal antigo recupera direito. Guarda-roupa/equipCosmetic aceitam direitos e ItemIcon usa a arte mensal existente. Cupom1Coin preservado; gold diário agora tem teto8000. Mensal30 presenças do mês, fevereiro28/29. Semana por marco/início da sequência, com compatibilidade ISO e recuperação única de marco sem recibo. Wiki/Jornal/arte integrados. calendar:check, online:check, typecheck, build e prévia PC/390px passaram. Fonte: docs/conhecimento/Pack-54-Calendario-e-Conquistas-Permanentes-2026-11-04.md. Sem deploy/schema. Catálogo só novembro2026; beta/meses seguintes e sprite humana de skin ainda pendentes.

## Continuidade — Pack 55 — 04/11/2026

HeroArt compartilhado conecta sprite completa do Primeiro Canto à forma humana em Personagem/hunt/Boss; Matriz conserva linhagem. Addon usa PNG existente somente Boss/prévia; Nebulosa ausente recua para humano com cores. Guarda-roupa ganhou prévia, quatro espaços e remoção. Catálogo src/data/cosmetics.ts e novo LUMINESCENCIA_PET (oferta120Coins) resolvem o campo de aura antes inalcançável. Propriedade revalidada por src/engine/cosmeticOwnership.ts no save/motor/commit: escrow/venda do último cosmético físico desativa visual, conquista mensal permanente permanece. Corrigido hook condicional de Personagem. cosmetics:check, online:check, calendar:check, typecheck, build e prévias de cosméticos/Boss/calendário passaram. Captura de cosméticos usa paint nativo offscreen/software após capturePage falhar; não equivale a teste físico. Fonte: docs/conhecimento/Pack-55-Guarda-Roupa-Skins-e-Auras-2026-11-04.md. Sem deploy/schema. Pendentes arte completa Nebulosa, ícone auraPet, transparência Elarion, atlas/skins beta/mensais/Matriz e dispositivos físicos.

## Continuidade — Pack 56 — 04/11/2026

src/online/session.ts substitui flags globais por base/revisão + fila serial durável v2, 32 comandos por personagem. projection.ts refaz só ações determinísticas com instante fixo; sorteios/IDs novos aguardam servidor. confirmation.ts conecta recibos aos handlers de Fazenda/Pets/Matriz/Ferreiro/calendário/profissões. Isolamento de sessões, leituras antigas, resposta perdida/idempotência, diário legado/corrompido, armazenamento indisponível e falha de assinante verificados. Removido bloqueio visual global; navegação disponível durante recuperação. healFull online agora pede world.read e hooks da Fazenda corrigidos. online:session-check, regressões de calendário/cosméticos/profissões/jornada, typecheck/build e prévia HTTP/controlador/telas PC/390px passaram. Aviso bundle acima500kB continua. Fonte: docs/conhecimento/Pack-56-Fila-Online-e-Recuperacao-2026-11-04.md. Sem deploy/schema. Não afirmar que todos os lags foram resolvidos ou que saves foram adiados1h; faltam rede/carga/concorrência/dispositivos reais, polling e divisão do bundle.

## Continuidade — Pack 57 — 04/11/2026

Profissões online deixaram de aceitar score cliente: src/engine/professionChallenge.ts + server/game.ts guardam WorldState.professionChallenge no JSON existente. begin/finish/cancel, UUID, um desafio por personagem, início1,2s, pulso3s, graça750ms, grau no processamento server-side, consumo único e requisitos revalidados. mineResource/fishSpot diretos recusados online, preservados offline. Widget prepara/conta, cancela resposta tardia após soltura/desmontagem e mostra precisão confirmada. Wiki/Jornal e testes atualizados. professions:pulse-check, professions:check, online:session-check, online:check, typecheck, build e UI local/online PC390px passaram. Runtime gerado, sem schema/deploy. Fonte: docs/conhecimento/Pack-57-Pulso-Autoritativo-de-Coleta-2026-11-04.md. Não é anti-macro completo; jitter/locks podem mudar nota. Próximos: medir rede real, cenas, iscas, rotas laterais e usos dos recursos.

## Continuidade — Pack 58 — 04/11/2026

ProfessionScene.tsx/CSS integra humano/skin, biomas, ferramenta e artes EFEITO_PESCA_MORDIDA/EFEITO_MINERACAO_FAISCA existentes a fases do widget. Observar troca prévia sem mexer na hunt. Efeitos/movimento/reduced-motion reativos; seletor específico evita HeroArt fora da cena. FISHING_BAIT define ISCA_CICATRIZ opcional, consumida1 por pesca válida,+1 peixe após precisão, sem skillextra. BaitId é ligado ao pulso; domínio clona para consumir/entregar junto, revalida e preserva em falha. Alias de arte ISCA_RARA.png. Novos testes de isca, API/replay e UI PC390px passaram, com typecheck/build e regressões. Fonte: docs/conhecimento/Pack-58-Cenas-e-Iscas-de-Profissoes-2026-11-04.md. Sem schema/deploy. Humano continua em pé; falta pose sentada/atlas/cenário próprio. Próximos: destinos no Ferreiro, rotas, curva de skill, rede/carga real e outros sistemas do backlog.

## Continuidade — Pack 59 — 04/11/2026

src/engine/cardCollection.ts centraliza formação/bônus/score/evolução; stats, Gear, PvP, Personagem e Álbum consomem a mesma regra. EvolveCard(uid,materialUIDs,expectedLevel) exige2/4/8/16 cópias iguais Nv1 fora da formação; goldbase150/300/600/1200/2400×nível²; determinístico atéNv5. Clone/commit preservaUID,obtainedAt,espécie,loadout,HP atual. API idempotente e nível esperado impedem dupla compra. Álbum permite selecionar cópia, equipar/retirar, revisar custo, mostra bônus reais e sprites viaCardArt. Wiki/Jornal, leitura limitada de níveis e dropChance compartilhado. Personagem sem truncar frações; Arena hook inicial corrigido. cards:check, online:check/session, regressões, typecheck/build e UI PC390px passaram; capturas em.cache/online-flow. Fonte: docs/conhecimento/Pack-59-Cards-Evolucao-e-Bonus-Reais-2026-11-04.md. Sem schema/deploy. Pendentes Cards dos10 mobsnovos e referência sazonal do catálogo, histórico/volume, negociação e playtest de custos.

## Continuidade — Pack 60 — Cards de Veyra/Kaelor — 04/11/2026

O catálogo de Cards agora tem 48 espécies e valida cada template contra o mob de origem. Dez memórias novas cobrem Sapo-Miasma, Libélula-Lâmina, Cipó da Memória, Crocodilo de Silte, Matriarca do Lodo, Escaravelho Vítreo, Espectro Solar, Serpente de Miragem, Golem de Obsidiana e Sentinela do Zênite. Elas reutilizam CardArt, sprites PNG existentes, as chances por tier/boss e os bônus/evolução centralizados; não criar regra paralela de dano ou loot.

Compatibilidade sazonal: `seasonCardTemplateIds("2026-11")` exclui os dez IDs introduzidos após a abertura e mantém 38 no denominador. A partir de `2026-12`, o catálogo sazonal tem 48. `cards.season.read` calcula espécies únicas filtradas e preserva o `total_cards` já gravado no conflito; `cards.season.claim` usa o snapshot persistido. Isso evita que uma expansão no meio do mês rebaixe coleções antigas.

Arquivos autorais: `src/data/cards.ts`, `server/world.ts`, `src/ui/CardsGuide.tsx`, `src/data/mythreonJournal.ts`, `scripts/cards-check.ts`, `docs/conhecimento/Pack-60-Cards-Veyra-Kaelor-e-Temporada-2026-11-04.md`. Validações pendentes desta continuidade: rodar `cards:check`, `online:check`, typecheck, bundle/build, diff --check e brain:sync; gerar runtime antes de qualquer publicação. Sem migration, commit ou deploy.
