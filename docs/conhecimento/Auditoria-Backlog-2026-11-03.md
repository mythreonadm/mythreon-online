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
2. Exibir o sprite do Pet ao lado do personagem durante a hunt; hoje o dano/bônus existe, mas a apresentação visual ainda precisa ser fechada.
3. Criar feedback visual e sonoro do ataque do Pet, com fallback para dispositivos que não carregam animações.
4. Tornar a incubação realmente baseada em tempo, caso o design final seja “chocar depois de X minutos”; atualmente o botão eclode imediatamente.
5. Renderizar as combinações de aparência no sprite humano real; os campos são salvos, mas ainda precisam de artes/variações finais.
6. Implementar irrigação, fertilidade, tempo de rega e receitas completas da Fazenda; o cultivo atual usa crescimento por timestamp.
7. Revisar todos os itens sem arte e substituir o fallback emoji por PNG/GIF final.
8. Fazer bateria de testes de duplicação de itens, gold, coins, ovos, pets e trocas concorrentes.
9. Balancear dano, XP, gold, loot, ovos, Pets, Matriz e Bless usando métricas reais de 20 hunts por faixa de nível.
10. Testar mobile: cabeçalho, combo, pop-ups, chat, Fazenda, Pets e arrastar/rolar sem bloqueios.
11. Validar cadastro por e-mail, recuperação de senha, confirmação SMTP e Google OAuth em produção.
12. Rodar `npm run typecheck`, `npm run build`, `npm run online:check`, `npm run journey:check` e `npm run brain:check` antes de cada deploy.

## P1 — melhorias importantes depois do núcleo estável

- Mercado Negro completo com anúncios, filtros, preço médio, histórico, taxa, expiração e auditoria.
- PvP ranqueado real-time com regras sem poções, reconexão, anti-abuso e temporadas.
- Boss Diário cooperativo manhã/tarde/noite, inscrição, escala de HP/dano, ranking de contribuição e recompensa.
- Mineração e Pesca com ferramentas T1–T5, skills, minigames manuais e drops próprios.
- Baú por tempo online, recompensas diárias, calendário de 30 dias, skins mensais e cupons.
- Cards colecionáveis com atributos, álbum e progressão.
- Sistema completo de skins, addons cosméticos e aparência de Pet sem pay-to-win.
- Jornal de Mythreon e changelog público automatizado a cada atualização.
- Sistema de efeitos, som, volume, animações e escolha de fallback de vídeo.
- Notificações e moderação para chat, trade, correio e links de itens.

## P2 — pode ficar por último

- Novos biomas, capítulos de lore, chefes e linhas de Pets.
- Trailer cinematográfico e vídeos promocionais.
- Versão Windows empacotada com atualizador.
- Economia premium completa, Market Online e efeitos exclusivos.
- Eventos sazonais, easter eggs e conquistas avançadas.
- Otimização adicional de code-splitting; o build atual passa, mas ainda alerta chunks grandes.

## Regra de prioridade

Não adicionar sistemas novos enquanto os itens P0 1–12 não estiverem testados. O próximo ciclo recomendado é: **Matriz + Pet visível → Personalização com sprites → incubação temporizada → Fazenda completa → balanceamento → testes de produção**.
