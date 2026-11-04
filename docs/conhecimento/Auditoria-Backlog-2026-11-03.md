# Auditoria de backlog — Mythreon Online

Atualizado em 03/11/2026 após a migração de Bestas Divinas para Pets e a correção da coexistência Matriz + Pet.

## Implementado e validado

- Conta online, Supabase, Google OAuth, personagens vinculados e persistência entre dispositivos.
- Tutorial guiado, Jornadas, Wiki/Arquivo, Matriz, síntese e Laboratório de Builds.
- Hunt idle, stamina online/offline, autoloot, bestiário, loot, XP, gold, registros e alerta de bolsa cheia.
- Treino, penalidade de morte, Bless, proteção contra perda e Ferreiro.
- Flechas T1–T5 equipáveis, com atributos somente quando há arco equipado.
- Pets originados de Ovos de Besta Divina, incubadora visual, raridade, alimentação, humor, nutrição e combinação de linhagem.
- Matriz e Pet simultâneos: ativar um Pet não remove mais a Matriz; os bônus são somados.
- Personalização de personagem: corpo, pele, cabelo, cor do cabelo, roupa e cor da roupa, com persistência online.
- Fazenda base, plantio, colheita, expansão e custos progressivos.
- Chats Mundial/Trade/Help, linkar item no chat, comunidade, ranking, correio e troca online básicos.
- Cérebro e Obsidian sincronizados automaticamente.

## P0 — precisa ser concluído antes de abrir ao público

1. Testar Matriz + Pet em caça local e online, incluindo recarregar a página e trocar de dispositivo.
2. Exibir o sprite do Pet ao lado do personagem durante a hunt; implementação local concluída no Pack 08, faltando playtest em celular e artes finais.
3. Criar feedback visual e sonoro do ataque do Pet, com fallback para dispositivos que não carregam animações; implementação local concluída no Pack 08, faltando validação em aparelhos reais.
4. Validar o combo manual sem latência percebida; resposta imediata implementada no Pack 09, faltando playtest local/online e no celular.
5. Validar a janela visual do combo e o reset por atraso; barra de ritmo e proteção contra tecla repetida implementadas no Pack 10.
6. Validar a incubação temporizada em diferentes dispositivos; duração, progresso visual e estado pronto concluídos no Pack 12.
7. Validar a personalização visual humana em diferentes dispositivos; sprite humano-v2, filtros e persistência concluídos no Pack 14.
8. Completar receitas de maior tier e medir a economia da Fazenda; irrigação, fertilidade, composto e skill de Irrigação/Fertilidade concluídos nos Packs 11 e 13.
9. Revisar todos os itens sem arte e substituir o fallback emoji por PNG/GIF final.
10. Fazer bateria de testes de duplicação de itens, gold, coins, ovos, pets e trocas concorrentes. **Pack 16: reserva idempotente por `requestId` aplicada no servidor; falta o teste manual em dois dispositivos e queda de rede real.**
11. Balancear dano, XP, gold, loot, ovos, Pets, Matriz e Bless usando métricas reais de 20 hunts por faixa de nível. **Pack 15: auditoria determinística inicial concluída; falta o playtest real segmentado antes de alterar números.**
12. Testar mobile: cabeçalho, combo, pop-ups, chat, Fazenda, Pets e arrastar/rolar sem bloqueios.
13. Validar cadastro por e-mail, recuperação de senha, confirmação SMTP e Google OAuth em produção.
14. Rodar `npm run typecheck`, `npm run build`, `npm run online:check`, `npm run journey:check` e `npm run brain:check` antes de cada deploy.

## P1 — melhorias importantes depois do núcleo estável

- Mercado Negro completo com anúncios, filtros, preço médio, histórico, taxa, expiração e auditoria. **Pack 21: custódia, compra atômica, cancelamento, expiração, taxa, ledger e tela online. Pack 31: paginação, filtros server-side, ordenação e resumo de preços. Pack 35: hardening de RLS e índices dos fluxos online. Pack 42: histórico de vendas por item exibido junto ao anúncio, com média, faixa de preços e volume vendido. Pack 44: cobertura adicional de FKs em tabelas online para RLS e consultas de histórico.** Faltam moderação, histórico gráfico e teste concorrente real.
- PvP ranqueado real-time com regras sem poções, reconexão, anti-abuso e temporadas. **Pack 18: lobby, desafio, aceite, resolução autoritativa e rating online implementados. Pack 27: temporada UTC visível no lobby. Pack 29: fila server-side, pareamento por rating e histórico sazonal implementados. Pack 37: snapshots de temporada, tiers, recompensa única com gold/Shards/Coins e resgate server-side idempotente implementados; migration 015 aplicada no Supabase em 04/11/2026. Pack 39: ligas visuais e progresso até a próxima faixa implementados. Pack 40: combate por turnos server-side, HP, turno, cooldown, log de ações e encerramento autoritativo implementados; migration 016 aplicada no Supabase em 04/11/2026. Pack 41: retomada após recarregar, sincronização ao voltar à aba e indicadores online/offline implementados. Pack 45: políticas RLS com `auth.uid()` em plano de inicialização único implementadas; migration 019 aplicada no Supabase em 04/11/2026. Falta playtest concorrente real.**
- Boss Diário cooperativo manhã/tarde/noite, inscrição, escala de HP/dano, ranking de contribuição e recompensa. **Pack 17: fundação online e painel jogável. Pack 30: loot próprio, ovos condicionais e Mythreon Shards no resgate. Pack 34: histórico persistente por participante, loot auditável e proteção contra segundo resgate.** Migrations 007 e 013 aplicadas em produção; falta playtest com múltiplas contas e validação de contribuição em escala real.
- Mineração e Pesca com ferramentas T1–T5, skills, minigames manuais e drops próprios. **Packs 19 e 25: skills, pontos de coleta, cooldown, drops, precisão manual e rendimento por acerto implementados. Pack 26: ferramentas equipáveis T1–T5, kit inicial/migração e receitas de refino implementados. Pack 47: Armazém das Ferramentas com compra em gold, skill mínima e validação online.** Faltam ferramentas especiais e testes concorrentes.
- Baú por tempo online, recompensas diárias, calendário de 30 dias, skins mensais e cupons. **Packs 20 e 22: Calendário ganhou aba própria e o Baú do Refúgio acumula presença online com resgate server-side. Pack 27: marcos semanais/mensais persistentes, proteção contra duplicidade e indicação visual concluídos; falta ampliar o catálogo de skins por temporada.**
- Cards colecionáveis com atributos, álbum e progressão. **Pack 20: Álbum próprio, filtros, conclusão e modal de detalhes implementados. Pack 23: formação persistente de até 5 cartas, Gear Score e poder autoritativo do PvP online integrados. Pack 26: bônus agregados visíveis no álbum. Pack 32: bônus moderados da formação entram nos atributos da hunt e são recalculados ao equipar. Pack 33: painel de Personagem mostra a origem e o total de bônus dos Cards. Pack 43: snapshots mensais, faixas de coleção e recompensa idempotente em Gold, Shards e Coins implementados; migration 017 aplicada no Supabase em 04/11/2026.** Falta validação com playtest prolongado.
- Sistema completo de skins, addons cosméticos e aparência de Pet sem pay-to-win. **Pack 36: catálogo visual, aplicação na hunt/Personagem/Pet, indicação de loadout e validação online de propriedade. Faltam artes finais, validação em aparelhos reais e catálogo sazonal maior.**
- Jornal de Mythreon e changelog público automatizado a cada atualização. **Pack 38: seção Jornal no Arquivo, entradas tipadas, categorias, tags e eventos ativos implementados; falta automatizar a geração no release e publicar o resumo na landing page.**
- Sistema de efeitos, som, volume, animações e escolha de fallback de vídeo.
- Notificações e moderação para chat, trade, correio e links de itens.

### Pack 46 — reconciliação imediata do mundo online

- Ações otimistas do cliente agora aplicam imediatamente o snapshot autoritativo devolvido por `world.command`, sem aguardar o próximo polling.
- Isso evita o rollback visual ao equipar, plantar, forjar, trocar de mapa ou executar ações de inventário enquanto a confirmação online termina.
- O polling continua como recuperação de conexão e atualização de caça; o servidor segue sendo a fonte final de verdade.
- Falta validar em dois dispositivos com queda de rede real e medir a percepção de latência em celular.

## P2 — pode ficar por último

- Novos biomas, capítulos de lore, chefes e linhas de Pets.
- Trailer cinematográfico e vídeos promocionais.
- Versão Windows empacotada com atualizador.
- Economia premium completa, Market Online e efeitos exclusivos. **Pack 24: loadout visual de skins/luminescências/addons validado online. Pack 28: entitlement por conta, validade, webhook HMAC e idempotência implementados; checkout/provedor, cobrança recorrente e homologação financeira continuam pendentes.**
- Eventos sazonais, easter eggs e conquistas avançadas.
- Otimização adicional de code-splitting; o build atual passa, mas ainda alerta chunks grandes.

## Regra de prioridade

Não adicionar sistemas novos enquanto os itens P0 1–12 não estiverem testados. O ciclo atual é: **Matriz + Pet visível → Personalização com sprites → incubação temporizada → Fazenda completa → auditoria determinística → playtest real de 20 hunts → ajustes de balanceamento → testes de produção**.

### Pack 48 — integridade dos fluxos existentes

Correções de vitória por nocaute, classificação de ligas, HP do desafiado, bloqueio de resolução legada no combate por turnos, recuperação de anúncios expirados, taxa limitada ao preço e bloqueio de compra duplicada de ferramentas. Testes de domínio ampliados. Continuidade: [[docs/conhecimento/Pack-48-Integridade-PvP-Mercado-2026-11-04|evidências e limites]]. A melhora de latência do Pack 46 não está comprovada: a resposta já era aplicada por executeOnlineAction; investigar rebase da fila de ações otimistas.

### Pack 49 — Boss Diário: ciclos e entrega de recompensas

Resgate de ciclos anteriores, fechamento de ciclos vencidos, contribuição efetiva, proteção contra prêmio sem dano e entrega sem perda/duplicação de stack parcial implementados. Painel de pendências e cooldown visível. Testes de domínio com três usuários passaram em conexão serializada; falta concorrência real. [[docs/conhecimento/Pack-49-Boss-Ciclos-e-Recompensas-2026-11-04|Regras e limites do Pack 49]]. Seguem pendentes mapa cooperativo visual completo, ataques/dano do Boss e testes de carga.

### Pack 50 — arena visual cooperativa

A cena do Boss agora usa o fundo de seu bioma, herói/Matriz, cosméticos, Boss e aliados recentes. HP compartilhado e golpes próprios confirmados são visíveis; contribuições remotas são agregadas por polling. Prévia Electron em PC/390px, teste de roster público, typecheck e build passaram. [[docs/conhecimento/Pack-50-Arena-Visual-Boss-Cooperativo-2026-11-04|Evidências e limites]]. Continuam faltando retaliação/dano do Boss, próximo evento e testes de carga/produção.

### Pack 51 — retaliação e vida cooperativa

Mecânica de dano recebido do Boss, mitigação por defesa/resistências, vida privada separada da hunt e recuperação após nocaute implementadas. API impede cura por reinscrição e replay de dano. Arena mostra vida/retaliação/espera. [[docs/conhecimento/Pack-51-Retaliacao-e-Vida-Cooperativa-2026-11-04|Regras e evidências]]. Ainda faltam defesa ativa, inscrições futuras, carga e balanceamento real.

### Pack 52 — histórico real do Mercado e lotes

Histórico incorpora compras do Mercado e trades comparáveis, com média por unidade, moedas/variantes separadas e gráfico/tabela diária. Interface permite quantidades e prévia de taxa/líquido. Testes de aritmética, filtros de permuta/múltiplos itens e UI PC/390px passaram. [[docs/conhecimento/Pack-52-Mercado-Lotes-e-Precos-Reais-2026-11-04|Evidências e limites]]. Moderação, manipulação de preços e performance em volume real continuam pendentes.

### Pack 53 — progressão de profissões e pulso acessível

Cinco tiers/recursos, travessias, receitas, alimento de Pet e Wiki/Jornal implementados. Testes de domínio/online e UI emulada PC/390px passaram. [[docs/conhecimento/Pack-53-Profissoes-Tiers-e-Pulso-2026-11-04|Evidências]]. Permanecem cenas de rio/mineração, isca consumível, mais usos no Ferreiro, desafios autoritativos, biomas laterais e teste físico Android.

### Pack 54 — calendário real e direito permanente à skin

Revisadas garantias do Pack27: dias reais/UTC, sequência por blocos de7, presenças únicas no mês, teto de gold, entrega semanal atômica e skin independente da bolsa. Artes existentes/guarda-roupa/Wiki/Jornal integrados e testes de domínio, online e UI PC/390px passaram. [[docs/conhecimento/Pack-54-Calendario-e-Conquistas-Permanentes-2026-11-04|Regras e limites]]. Não encerra skins de beta, catálogo futuro, histórico mensal, visual de skin completo ou homologação de produção.

### Pack 55 — guarda-roupa e cosméticos visíveis

HeroArt unificado, skin mensal completa humana, Matriz preservada, addon do Boss com arte, aura independente de Pet e remoção por espaço implementados. Escrow/venda invalida seleção física; direito mensal permanece. Testes de stats/Gear/propriedade, API e UI Personagem/hunt/Boss/calendário passaram. [[docs/conhecimento/Pack-55-Guarda-Roupa-Skins-e-Auras-2026-11-04|Evidências e limites]]. Restam artes Nebulosa/auraPet, transparência Elarion, skins de beta/temporadas/Matriz, atlas e testes físicos.

### Pack 56 — reconciliação com fila durável

Equipamentos/plantios pendentes preservados após recibos anteriores; diário por personagem, requestId estável, isolamento após logout, sorteios confirmados e navegação durante recuperação implementados. Teste real de controlador/telas/HTTP controlado passou PC/390px e verificou cobrança única de cupom após resposta perdida. [[docs/conhecimento/Pack-56-Fila-Online-e-Recuperacao-2026-11-04|Evidências e limites]]. Permanecem latência/carga real, dois dispositivos, custo de polling, divisão do bundle e demais pendências de gameplay. Não substitui validação concorrente em produção.

### Pack 57 — desafio de coleta autoritativo

Removida confiança na nota enviada pelo cliente: begin/finish/cancel com UUID por personagem, tempo do servidor, recarga/requisitos revalidados e uso único. Fluxo real de UI/HTTP/motor passou em PC/390px, incluindo resposta tardia e cancelamento por navegação. [[docs/conhecimento/Pack-57-Pulso-Autoritativo-de-Coleta-2026-11-04|Evidências e limites]]. Não é anti-macro completo. Permanecem latência/locks reais, cenas, consumo de isca, rotas laterais, usos de minério e curva de skill.

### Pack 58 — cenas e uso da isca

Profissões receberam duas cenas reutilizando biomas, humano/skin, ferramentas e artes de impacto, com estados reais e preferências de vídeo. Observar não altera o personagem. Isca opcional ligada ao pulso acrescenta1 peixe com consumo atômico, sem perda em rejeição e sem duplicação no replay. Testes de domínio/banco/UI PC390px passaram. [[docs/conhecimento/Pack-58-Cenas-e-Iscas-de-Profissoes-2026-11-04|Evidências]]. Ainda faltam pose sentada, cenários exclusivos, atlas, destinos de minério, rotas, curva e carga/rede/dispositivos reais.

### Pack 59 — evolução real de Cards

Níveis1–5 por gold/cópias livres, revisão/seleção e uso único implementados. UID, espécie, formação e HP atual preservados. Fonte única para bônus, pontuação e poder PvP; Álbum mostra parcela aplicada, Personagem mantém frações, sprites de monstros integrados e hook da arena corrigido. Testes de domínio/API/UI PC390px passaram. [[docs/conhecimento/Pack-59-Cards-Evolucao-e-Bonus-Reais-2026-11-04|Regras e evidências]]. Restam10 Cards dos biomas novos com catálogo sazonal estável, histórico/volume, efeitos do duelo de cartas local, negociação e balanceamento real.

### Pack 60 — catálogo de Cards dos biomas novos

Dez Cards foram ligados aos mobs de Pântano de Veyra e Deserto de Kaelor, com raridades, traços, atributos, sprites do bioma e origem validada. O álbum passa a 48 espécies. A temporada 2026-11 continua com 38 no denominador; a expansão entra em 2026-12 e o snapshot de `total_cards` fica preservado no conflito. `cards:check`, `online:check`, typecheck, bundle, build, UI Electron PC/390px e regressões de profissões/calendário/cosméticos/jornada passaram localmente. [[docs/conhecimento/Pack-60-Cards-Veyra-Kaelor-e-Temporada-2026-11-04|Regras e evidências]]. Permanecem playtest prolongado, histórico/paginação, negociação, efeitos especiais do duelo local, concorrência e homologação em produção.
