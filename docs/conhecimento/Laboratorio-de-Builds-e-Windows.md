---
projeto: Mythreon Online
tipo: referencia
status: implementado
atualizado: 2026-11-02
resumo: Laboratório isolado de combate e primeira distribuição Windows de desenvolvimento.
---

# Laboratório de Builds e Windows

## O que o laboratório responde

A aba Laboratório testa uma fotografia da build contra todos os inimigos do mapa escolhido, usando o mesmo `processTick` da hunt. Ela distingue bloqueios exatos de nível de resultados probabilísticos. Derrotar inimigos na amostra não significa concluir as quests da região.

São 20 tentativas por alvo, limite de 120 ticks (6 minutos) por duelo. As tentativas começam com HP/MP cheios, fase de cooldown zerada, stamina disponível e saldo de gold atual. O relógio virtual avança 3 s por tick, respeitando vencimento de buffs e recalculando atributos como o store faz na hunt. Depois, o alvo mais problemático (ou o boss quando a amostra já passa) é comparado com alternativas. Um teste adicional busca cinco vitórias consecutivas com os recursos da mesma tentativa, sem descanso artificial entre lutas.

Planos comparados:

- Configurar poções do tier em 65% HP e 40% MP, usando apenas o saldo real.
- Trocar por equipamentos de maior potência presentes na mochila; respeita as regras do motor de equipar e capacidade da bolsa.
- Projetar +5, +10 ou +20 níveis treinados na disciplina da arma, com maestria e tempo calculado pela curva de treino. A busca para ao encontrar 18/20 vitórias. Não concede habilidades de graça ao personagem real.
- Referência de farm: substituir peças inferiores por equipamento raro do tier do mapa, sem contar com afixos, e configurar poções. A multiplicação e o arredondamento usam a tabela real de raridade. É um conjunto hipotético, não loot já obtido.
- Projetar +5 níveis de personagem sem distribuir pontos adicionais ou melhorar equipamento.
- Opcionalmente comparar as seis primeiras Matrizes da coleção e até 12 Beasts já vinculadas, preservando a exclusividade dos caminhos.

A tela apresenta resultados, tempo, dano recebido, custo de poções, saldo líquido estimado, atributos de cada plano, afinidade/atributos do alvo, vantagens elementais e restrições de nível. O usuário pode salvar o relatório JSON e cancelar uma análise. Planos são comparados separadamente; a busca não cobre todas as combinações possíveis nem promete a menor build vencedora.

## Isolamento e limites

- A execução fica em Web Worker, sem acesso ao store, localStorage ou APIs de salvamento. Cada tentativa usa cópia profunda do personagem. Não equipa, consome nem recompensa recursos reais.
- Aleatoriedade e Date.now são substituídos somente dentro da execução síncrona no Worker e restaurados com finally. Não chamar as funções de simulação diretamente na thread da UI.
- Semente 73129. Repetibilidade pressupõe os mesmos dados, relógio inicial e estados de buffs.
- 18/20 é um critério operacional de preparação observado, não prova de probabilidade verdadeira de 90%. Mesmo 20/20 pode falhar na hunt real.
- Gold líquido desconta poções e inclui vendas automáticas configuradas, mas não inclui penalidade de morte, valor de aquisição de equipamento, venda potencial de loot ou recompensas de quests. Não anunciar lucro garantido.
- Cinco vitórias não equivalem a horas de farm: stamina, inventário, buffs e gold limitam sessões prolongadas.
- Se nenhuma alternativa atingir o critério, a tela informa que não encontrou plano suficiente. Não inventa requisitos exatos de dano/armadura nem garante que uma build inacessível já esteja pronta.

## Arquivos e verificações do laboratório

- `src/engine/buildLab.ts`: simulação, cenários, métricas e projeções.
- `src/engine/buildLab.worker.ts`: mensagens/progresso e execução isolada.
- `src/ui/BuildLab.tsx`, `src/App.tsx`: seleção de mapa, navegação, comparação e exportação.
- `scripts/build-lab-check.cjs`: teste reproduzível de não mutação, bloqueios, orçamento, treino, repetibilidade, restauração de relógio/RNG, limite de duração e teste de resistência; gera fixture descartável para Windows.

Comandos: `node scripts/build-lab-check.cjs` e `npm run build`. A integridade do pacote pode ser conferida com `node scripts/verify-windows.cjs`, que também gera release/checksums.sha256. Ambos passaram. A checagem global TypeScript ainda acusa erros legados em arquivos DeepSeek soltos, questEngine, Matrix, Wiki e usos de APIs ES2021/2022 com lib ES2020; não declarar typecheck global limpo.

## Windows: versão de desenvolvimento

Executável portátil x64: `release/Mythreon-Online-0.1.0-Windows-x64.exe`.
Também existe a distribuição em pasta: `release/win-unpacked/Mythreon Online.exe`. A pasta inteira é necessária se usar essa segunda opção; o portátil reúne a distribuição em um arquivo.

Abra o portátil com duplo clique. Não exige Node.js instalado no computador do jogador. O jogo e os assets vêm no pacote. Links externos ainda dependem de internet. Contas/saves são locais e separados do navegador; uma conta criada no site não é automaticamente encontrada pelo executável. O save padrão fica no perfil do aplicativo em `%APPDATA%/mythreon-online` e não ao lado do portátil. Não existe migração automática de save web, nuvem ou Market/correio online nesta entrega.

Construção local com Node/npm e dependências instaladas:

```text
npm install
node node_modules/electron/install.js
npm run desktop:portable
```

`npm run desktop:start` constrói e abre o aplicativo; `npm run desktop:package` gera a distribuição em pasta. O build web continua usando `npm run build`. `release/` e `.obsidian/` foram excluídos do Git/observador; binários não devem entrar na memória do Cérebro nem ser enviados ao repositório por engano.

## Arquitetura e diagnóstico Windows

Electron 45.2.1 e electron-builder 26.18.0. Protocolo local seguro `mythreon://game` resolve os caminhos absolutos de assets/Worker da versão Vite. Node integration fica desligado, context isolation e sandbox ligados, permissões negadas por padrão, navegação remota bloqueada na janela e apenas links HTTPS abrem externamente.

Arquivos: `desktop/main.cjs`, `electron-builder.json`, `package.json` e lockfile. Só dist, desktop, manifesto e dependências de execução entram no pacote; as pastas docs/ e experimental/, o Cérebro, código TS e caches de desenvolvimento não são incluídos. Recursos já existentes sob public/ continuam sendo copiados para dist e devem ser revisados antes de uma distribuição pública.

O primeiro pacote ASAR apresentou manifesto inválido ao ser extraído neste ambiente; a causa completa não foi estabelecida. ASAR foi desativado como medida de compatibilidade, e 187 arquivos de dist foram comparados por SHA-256 com a cópia em resources/app, todos iguais. Código local não deve ser tratado como protegido contra alteração. Para futura distribuição, investigar a falha de ASAR e repetir a verificação de integridade caso o formato volte a ser usado.

O usuário restrito das ferramentas falhou na checagem de leitura do Electron para AppContainer, mesmo depois de conceder leitura/execução a ALL APPLICATION PACKAGES somente na pasta do runtime empacotado. O teste com a conta normal do Windows passou, sem desligar sandbox. Não generalizar essa falha do ambiente como falha do jogo em computadores comuns.

Teste nativo oculto: abriu a interface, validou asset local e WebCrypto, confirmou ausência de process/require no renderer e executou o Worker do laboratório (8 inimigos, 6 planos). Perfil e fixture de teste em `node_modules/.cache/desktop-smoke/`, sem usar saves do jogador. O modo --smoke-test só roda essas verificações e encerra; não é o modo normal de jogar.

## Pendências para distribuição comercial

- Assinatura digital, identidade visual do ícone do executável, versionamento e estratégia de atualizações. O pacote atual não é assinado.
- Resolver os avisos da cadeia de ferramentas: npm audit apontou avisos moderados de dependências de build e aviso alto de Vite; não foi aplicado downgrade automático nem atualização major sem validar. Vite não é servido pelo executável de produção.
- Migração/exportação de saves entre navegador e Windows e testes de atualização do perfil.
- Mais playtests visuais, de áudio, sessões longas e diferentes máquinas; o smoke test não certifica todo o jogo.
- Backend autoritativo antes de venda de premium, economia compartilhada ou alegações de persistência online.

## Fontes técnicas consultadas

- Electron Security: https://www.electronjs.org/docs/latest/tutorial/security/ (2026-11-02).
- electron-builder, portable/NSIS: https://www.electron.build/docs/nsis/ (2026-11-02).
- Diagnóstico nativo de leitura: https://raw.githubusercontent.com/electron/electron/main/shell/browser/win/install_dir_access.cc (2026-11-02).

## Relações

- [[CEREBRO_MYTHREON]]
- [[Treino-e-Diferenciais-Mythreon]]
- [[Balanceamento-Combate-Economia]]

## Verificação final do portátil

O próprio release/Mythreon-Online-0.1.0-Windows-x64.exe foi executado com --smoke-test em perfil descartável e extração temporária, com a conta normal do Windows. Encerrou com código 0: interface renderizada, WebCrypto disponível, logo local carregado, renderer isolado e Worker com 8 alvos/6 planos. Evidências entregues em release/windows-smoke-test.json, release/verification.json e release/checksums.sha256. A checagem de integridade validou 187 arquivos dist e o main empacotado. Isso não substitui playtests prolongados nem assinatura digital.

## Revisão Jornada — 2026-11-02

O aplicativo em release/win-unpacked recebeu as novas quests e biomas; 187 arquivos iguais à build web atual e abertura/Worker testados. A compactação do portátil desta revisão foi impedida por falta de espaço em C:. O .exe portátil anterior permanece preservado e desatualizado quanto à Jornada. Abrir release/win-unpacked/Mythreon Online.exe para testar a versão atual; manter toda a pasta. Evidência em release/journey-verification.json. [[docs/conhecimento/Jornada-Lore-Biomas|Regras e detalhes desta revisão]].
