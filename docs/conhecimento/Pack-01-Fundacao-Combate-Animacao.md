---
projeto: Mythreon Online
tipo: decisao
status: em-validacao
resumo: Fundação da caça, eventos confirmados e pranchas pixel art por variante.
---

# Pack 1 — Fundação de combate e animação

Este Pack 1 pertence à nova sequência de evolução e foi aplicado à caça em Explorar. Boss Mundial, PvP, Arena de Cards e profissões podem aproveitar o desenho depois da validação na caça. Abaixo ficam o estado da implementação e o desenho original.

## Implementação da caça e das pranchas

- `huntWaves.ts` concentra a seleção e a preparação do alvo para a entrada, a troca e a resolução. As pranchas seguem esquerda → direita, na ordem **W1, W2, W3A, W3B, BOSS**. W3A e W3B são dois encontros da terceira onda, e BOSS fecha a família. Um chefe de mapa tem ID e retrato próprios.
- `combat.ts` registra em `TickResult.huntBeat` o ciclo, a instância do encontro, a ficha visual e os impactos separados. A barra pode consumir apenas o HP restante do inimigo, mesmo que o golpe calculado seja maior. O formato fica ausente no avanço offline. O cliente online continua recebendo o resultado confirmado pelo servidor.
- `HuntVisuals.tsx` apresenta o dano em sequência, deduplica pelo personagem e ciclo e prioriza terminar um combo já em exibição. A saída, troca de alvo e aba oculta cancelam efeitos pendentes. A barra de magia usa o custo do motor. A barra, a tela de pets e a Wiki descrevem o intervalo de dois ciclos do pet, nominalmente 6 s. O indicador que chega ao fim sem nova confirmação aguarda o ciclo. Em telas estreitas, o cabeçalho rola com a página durante a caça.
- `monsterAtlases.ts` mapeia **38 pranchas de famílias e 7 retratos de chefes de mapa**, dos sete biomas. `MonsterSprite.tsx` carrega a prancha sob demanda e desenha a variante num canvas com fundo isolado. As pranchas JFIF originais seguem como fonte. A arte de base continua disponível enquanto carrega ou se a prancha faltar.
- `fenix.jfif` corresponde a `FALCAO`. Foi adotada `engia.jfif` para `ENGUIA_ELETRICA`. `gargula.jfif` traz arte rotulada Cria do Vazio e não foi atribuída à Gárgula. `party hunt.jfif` é uma cena de referência. Lobo mantém seus cinco PNGs existentes. Gárgula e Golem de Obsidiana usam arte de base até receberem suas cinco variantes identificadas.
- A primeira implementação anima as poses fornecidas com efeitos de repouso, investida, impacto e derrota. Avianos, espectrais e pesados têm movimentos distintos. Os efeitos de ataque são desenhados na cena; quadros ilustrados adicionais e revisão individual das bordas de todas as pranchas continuam como acabamento artístico.

## Evidências que motivaram o desenho

| Local | Comportamento observado | Consequência para a implementação |
|---|---|---|
| `combat.ts`, `gameStore.ts` e `server/game.ts` | O mesmo motor serve ao local e online. O servidor resolve ciclos de 3 s sob demanda. O combo também pode disparar um ciclo imediato. | Manter o ciclo e sua ordem. Separar a extração de eventos de qualquer ajuste futuro de cadência. |
| `Zone.tsx` | A interface cobra visualmente `manaCost + nível × 2`. O motor usa `manaCost + floor(nível × 0,5)`. | Calcular custo e situação da recarga na origem. A interface consome esses valores. |
| `beastCombat.ts` e `Zone.tsx` | O pet tem intervalo lógico de dois ciclos. O texto usa 5 s e o relógio visual começa quando a resposta chega. | Dois ciclos equivalem nominalmente a 6 s. Mostrar a próxima oportunidade calculada pelo motor. Fixar 5 s reais exigiria alterar a cadência. |
| `Zone.tsx` e `TickResult` | O ataque, a magia e o pet compartilham campos agregados. O efeito reage ao objeto recebido, usa vários temporizadores e tem um callback de impacto sem cancelamento. | Registrar a origem de cada efeito. Deduplicar por ID, cancelar efeitos pendentes e preservar o alvo derrotado até o impacto visual. |
| `combat.ts` e `Zone.tsx` | O motor contabiliza dano acima do HP restante e um log agregado pode chamar de físico um total com outras origens. A UI também deriva o HP máximo do inimigo separadamente. | Distinguir dano calculado e HP removido. Usar o HP máximo do resultado, inclusive para elites. |
| `huntWaves.ts` | A interface já mostra quatro ondas. O motor usa cinco encontros porque divide a terceira onda em W3A e W3B sequenciais. | Preservar as chaves e o progresso existente no piloto. Dois inimigos simultâneos são uma evolução própria. |
| `AssetImage.tsx` e `combatVisuals.ts` | O jogo já tem PNG, GIF/GIFF e fallback. O efeito da habilidade é resolvido em grande parte por emoji. | Reaproveitar as artes existentes e adicionar uma rota explícita para os novos efeitos quadro a quadro. |

## 1. Máquina de estados da caça

Extrair primeiro as transições que envolvem começar, trocar alvo, vencer um encontro, carregar o próximo e parar. O motor e o servidor continuam responsáveis por HP, MP, stamina, recompensas e progressão. O estado persistido atual serve de origem na primeira extração. Um save antigo pode entrar sem metadados visuais e obtê-los ao iniciar ou avançar um encontro.

| Transição | Resultado exigido |
|---|---|
| Refúgio → caça | Usar os bloqueios atuais de vida, stamina, tutorial e travessia. Identificar a sessão e a instância do primeiro alvo. |
| Caça → próximo encontro | Fechar o resultado e o alvo da rodada antes de selecionar a próxima instância. Mesmo monstro em dois encontros recebe identidades distintas. |
| Caça → pausa por stamina | Mostrar motivo, manter o progresso permitido e impedir avanço enquanto a caça estiver parada. |
| Caça → derrota | Encerrar a caça, registrar a derrota e manter o relatório e as penalidades atuais. |
| Caça → saída ou troca de alvo | Invalidar a apresentação da sessão ou do alvo anterior. Preservar as regras de avanço online na ordem em que já acontecem. |

O estado da apresentação tem seu próprio ciclo curto, com espera, preparação, impacto e recuperação. A conclusão de um efeito visual jamais dispara a próxima simulação. O motor pode ser testado com relógio e aleatoriedade controlados nos pontos tocados pela refatoração. A persistência de seeds e o replay integral das batalhas podem ser avaliados depois de cobrir as dependências de RNG e tempo que já existem no loot, nas skills e na simulação offline.

## 2. Linha do tempo de combate

O motor emite o que ocorreu no ciclo. A camada visual transforma isso em poses, deslocamentos e sons. Separar três referências de tempo.

| Relógio | Papel |
|---|---|
| Ciclo da simulação | Ordenar resolução e calcular o próximo ciclo elegível de magia e pet, respeitando mana, suporte e as regras existentes. |
| Horário confirmado pelo servidor | Ancorar a estimativa do próximo ciclo online. Quando a estimativa vencer sem atualização, mostrar «Aguardando ciclo» ou «Sincronizando». |
| Relógio visual monotônico | Medir o tempo transcorrido da apresentação, cancelar a sequência ao sair e descartar efeitos atrasados ao voltar à aba. |

O motor fornece o custo de mana, a fase e a próxima oportunidade lógica de cada habilidade. O servidor fornece a referência de avanço quando necessário. O indicador de combo usa seu prazo confirmado, separado da magia e do pet. Quando o jogador completa a sequência, o cliente pode acusar o toque de imediato. Dano, medalha e impacto vêm da resolução confirmada. A proteção atual valida a ação no servidor, mas o cliente ainda envia o nível do combo. Uma etapa futura de desafio emitido pelo servidor deve ter critérios próprios de latência e abuso.

Ponto de partida para o piloto, ajustável no playtest: 100–150 ms de preparação, primeiro impacto em até 250 ms após receber o resultado, segundo impacto do combo 120–180 ms depois. São alvos de apresentação medidos da chegada da resposta, independentes do tempo de rede. Durante o teste, medir separadamente toque até confirmação e confirmação até primeiro impacto.

## 3. Registro de eventos e reconciliação

Adicionar ao resultado atual um lote visual opcional e versionado. Manter os campos agregados até que o registro e os relatórios possam ser comparados com o novo lote.

| Campo | Uso |
|---|---|
| `batchId`, `eventId`, ordem | Distinguir resposta repetida, golpes no mesmo ciclo e resultado antigo após reconectar. Proposta de identidade por sessão de caça, sequência de ciclo e índice do evento. |
| Instância e ficha visual de origem/alvo | Usar os IDs da arma, Matriz, pet e alvo resolvidos naquele instante. Preservar sprite, nome e instância do inimigo mesmo que o próximo já exista no estado confirmado. |
| Tipo e origem | Golpe básico, impacto 1/2 do combo, magia, pet, parcela elemental, contra-ataque, erro/esquiva, cura e derrota. Criticidade por impacto. |
| Elemento, dano calculado e HP removido | Guardar cálculo pós-mitigação e separar excesso de dano. Cura tem valor e destino próprios. |
| HP inicial/final e desfecho do alvo | Permitir animar a barra coerente com o alvo derrotado e trocar de sprite no momento correto. |

Hoje os golpes do jogador no mesmo ciclo entram numa soma antes de reduzir o HP do alvo. Se o dano exceder a vida do inimigo, a apresentação pode repartir o HP removido na ordem de exibição, limitando cada parcela ao saldo. Essa repartição serve à barra. O dano exibido e a contabilidade continuam distinguíveis. Um segundo impacto com HP efetivo zero ainda pode aparecer como parte do combo que o motor calculou. Ele permanece no mesmo alvo e nunca produz um segundo abate.

No online, consumir eventos do estado confirmado aceito pela sessão. Uma revisão nova pode trazer o mesmo lote, inclusive após retry de uma operação, e deve produzir uma única apresentação. No ingresso ou reconexão, iniciar a partir do último lote conhecido. Durante a sessão, conservar lotes recentes em janela curta somente se for necessário para entregar o combo confirmado junto com o avanço normal. Descartar golpes automáticos atrasados, sem descartar um combo novo recebido dentro da janela de apresentação. Em progresso offline, conservar o resumo atual e evitar enfileirar todos os golpes.

Nenhum evento visual aplica XP, ouro, loot ou dano. A persistência e a deduplicação econômica continuam no caminho autoritativo existente.

## 4. Catálogo de animações

Primeira opção de autoria: Aseprite com exportação de spritesheets PNG transparentes e tags. Padronizar âncora de pés para entidades, ponto de saída para projéteis e centro de impacto para efeitos. O catálogo declara ID semântico, arquivo, quadros, duração por quadro, âncora, repetição e imagem estática correspondente. Começar com uma grade regular e validar o caminho com a capitalização exata. Ler metadados do exportador quando a arte exigir atlas recortado. [Spritesheets no Aseprite](https://www.aseprite.org/docs/sprite-sheet/) · [Automação de exportação](https://www.aseprite.org/docs/cli/).

| Piloto | Direção visual |
|---|---|
| `ATAQUE_BASICO_CORTE.png` | Arco de corte curto, dourado suave, com impacto seco e trajetória fácil de ler. |
| `MATRIZ_LOBO_MORDIDA_FERAL.png` | Dois arcos como presas, silhueta marcada e ataque reconhecível sem depender da cor. |
| `COMBO_ESSENCIA_IMPACTO.png` | Dois impactos com intervalo perceptível. O segundo usa um selo rúnico curto e a medalha mantém texto e cor. |
| `PET_ELARION_IMPACTO.png` | Lança de raiz saindo do pet em direção ao inimigo, com ramo angular e marca própria. |

Nomes propostos para `public/assets/vfx/`. Começar com 4 a 8 quadros por efeito e testar o tamanho na tela antes de produzir variantes. Uma arte ausente recebe efeito simples em CSS ou um quadro estático existente. Um script de checagem pode validar arquivo, dimensões e duração dos quadros usando o catálogo. Produzir as poses exclusivas dos personagens e os demais elementos depois que o piloto comprovar escala, âncoras e leitura em celular.

## 5. Componente único de animação

Usar um apresentador de combate pequeno dentro da cena React existente. Ele recebe lotes normalizados, posições visuais e preferências do jogador. Renderiza efeitos com spritesheets e CSS no piloto, reutiliza o caminho de áudio atual e posiciona os números nas âncoras do herói, alvo e pet. O som da magia pertence a um evento de magia, e o contra-ataque pertence ao herói. Manter o HUD e os controles em React.

Centralizar o agendamento de impacto e a limpeza ao trocar sessão ou alvo. Se o renderizador usar `requestAnimationFrame`, usar um único agendador ativo para a apresentação e verificar a idade dos efeitos ao retornar à aba. O navegador pode suspender esses callbacks em segundo plano. No modo compatível ou com movimento reduzido, conservar número, alvo e origem com marca estática e texto. O projeto pode medir PixiJS com essa mesma entrada caso uma cena futura com vários atores e partículas exceda o orçamento do DOM. [Relógio de renderização](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) · [Sprites no PixiJS](https://pixijs.com/8.x/guides/components/scene-objects/sprite).

## Ordem e critérios para aplicar

| Entrega | Mudança isolável | Critério de passagem |
|---|---|---|
| 1A — Baseline e transições | Medir e travar o comportamento atual. Extrair transições da caça e identificação da instância de alvo. | Save legado, tutorial concluído, troca de mapa, stamina no limite, vitória, morte e saída. Comparar XP, ouro, loot, penalidades e avanço das ondas com os cenários anteriores controlados. |
| 1B — Eventos e recargas | Instrumentar resolução e projetar metadados das recargas. Comparar com o caminho atual. | Ataque básico, magia sem mana, pet, crítico, erro e dois impactos de combo sem somas duplicadas. HP máximo de elite igual no resultado e na cena. |
| 1C — Recepção e apresentação | Introduzir consumidor deduplicado e apresentador, primeiro com a arte existente. | Retry, dois snapshots iguais, chegada em ordem invertida, troca de personagem, aba em segundo plano e resposta atrasada durante troca de onda. Cada golpe aparece uma vez, no alvo correto. |
| 1D — Catálogo e piloto visual | Ligar os quatro efeitos piloto, a apresentação acessível e o áudio por origem. | PC a 100% de zoom, celular físico com toque, modo reduzido, modo compatível, arte ausente e mute. Confirmar leitura da batalha sem travar os controles. |

Verificação sugerida na aplicação: `npm run typecheck`, `npm run online:check`, `npm run online:session-check`, `npm run journey:check`, comparação com `balance:check` e teste dirigido de combate/eventos. Antes de publicar, regenerar e validar o runtime online e testar com conexão normal e rede móvel. No piloto visual medir uma sessão de 10 minutos, incluir troca de aba e de alvo e verificar que efeitos e áudio não ficam acumulados. Registrar a latência separada do custo visual e comparar com a mesma sessão antes do Pack.

Na baseline anterior ao Pack, duas suítes ainda tinham expectativas antigas de cupom diário e aura de pet na mochila. Os testes foram atualizados para as regras já vigentes e voltaram a passar. As regras do calendário e da compra de cosméticos continuam definidas pelos módulos existentes.

## Verificação local

- `hunt:check` cobriu os cinco estágios do Falcão, separação dos impactos de combo, magia, pet e contra-ataque, limite de HP removido, recargas, avanço offline sem efeitos e pausa/saída da caça online. Também confirmou os arquivos das 45 fontes mapeadas.
- `journey:check`, `online:check` e `online:session-check` passaram.
- `electron scripts/journey-ui-check.cjs --hunt` confirmou as cinco variantes do Falcão no navegador, o retrato do Espectro, o cabeçalho fora do caminho a 390 px, os dois impactos do combo por toque sobre a mesma instância e o modo de movimento reduzido.
- A homologação em celular físico, rede móvel e produção permanece pendente. As 45 fontes foram conferidas no catálogo. A inspeção do recorte dentro do jogo foi amostral.

## Relações

- [[Balanceamento-Combate-Economia]]
- [[Pack-63-Profissoes-Bau-e-Caca-2026-11-05]]
- [[PvP-Arena-Movel-e-Caca-2026-11-05]]
- [[CEREBRO_MYTHREON]]

