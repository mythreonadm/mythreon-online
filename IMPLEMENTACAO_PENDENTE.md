# Mythreon Online — fechamento da rodada

As solicitações desta rodada foram implementadas nos arquivos do jogo. A aplicação passou pela compilação de produção em 31/10/2026. Este documento registra o que entrou, regras adotadas e o único passo de arte que continua dependente de arquivos de sprite específicos.

## Implementado

### Imagens e animações

- `src/ui/AssetImage.tsx` tenta GIF, Giff, arquivo informado e PNG como fallbacks. O componente foi aplicado aos locais visuais da interface (logo, personagens, monstros, Divine Beasts, Wiki e itens).
- Fundos de mapa preferem arquivo animado com mesmo nome-base e recorrem ao PNG quando não encontram animação.
- Seletores de poção mostram a arte da poção escolhida.
- Sprites existentes aceitam GIF/Giff, preservando fallback e dimensões pixeladas.
- A animação de ataque existente usa os eventos de combate e continua compatível com as artes atuais. Não foram criados spritesheets novos nesta rodada; para estados novos (magia, dano e morte) ainda é necessário produzir as imagens correspondentes.

### Tutorial e navegação de missões

- A iniciação da Matriz pede criação e equipamento da raça.
- O tutorial inclui configuração de poções e visita ao Ferreiro.
- `src/ui/QuestTracker.tsx` mostra missões aceitas, progresso, estado pronto para resgate e lista recolhível das concluídas; a preferência de minimizar fica salva localmente.
- Selecionar uma missão pronta abre a missão para resgate. Selecionar uma missão ativa navega à aba ou zona adequada e escolhe o inimigo/monstro associado quando há alvo definido.
- Mapas e criaturas envolvidos em objetivos da missão rastreada recebem destaque dourado.

### Matriz, equipamento e Ferreiro

- Componentes da Matriz mostram detalhes no hover/foco, incluindo linhagem, atributos e descrição da função.
- A Mochila oferece “Equipar maior potência”, com aviso de que score não mede sinergia da build.
- A aba Ferreiro fica bloqueada enquanto a caça está ativa.
- Venda e desmanche automáticos aceitam seleção de templates ou raridade; lendários continuam protegidos.
- Slots do Personagem seguem a organização corporal, mostram item e alternativas compatíveis da Mochila, e incluem munição.
- Flechas T1–T5 foram criadas, podem cair nas zonas correspondentes, acumulam até 999, equipam no slot de munição e estão listadas na Wiki. Não são consumidas pelo combate automático ainda.
- O controle de áudio inclui ajuste de volume e persiste a escolha no navegador.

### Morte, proteção e drops elementais

- Uma Bless é consumida ao morrer e protege os itens, mantendo a penalidade de 5% de XP. Sem Bless, a penalidade de XP é 15%; a perda de gold continua em 10%.
- Sem Bless e sem o Anel da Guarda Eterna, a mochila equipada e seu conteúdo são perdidos, com 10% de chance adicional de perder uma peça equipada elegível. O anel bloqueia as perdas de itens.
- A tela de morte descreve perdas e proteções. O anel pode aparecer no drop do Devorador.
- `src/data/elementalChart.ts` centraliza 12 afinidades e a matriz de relações: 1,25× em vantagem, 0,75× sob resistência e Base neutro. Resistências individuais são limitadas a 80%; imunidade não foi introduzida.
- Criaturas existentes receberam afinidades/resistências em zonas selecionadas. Ataques de raça e bônus elementais em armas aplicam a matriz; armas incomuns ou melhores têm chance crescente de receber elemento, persistido na instância do item.
- A Wiki contém a tabela de relações; os cards de monstros e a ficha de personagem exibem afinidades/resistências existentes.

### Combate, relatórios e stamina

- Registros da hunt guardam horário, dano causado/recebido por físico e elemento, XP, ouro, custo de poções, loot e valor de venda estimado.
- Tooltips de dano mostram valor e percentual por origem, além da vida recuperada por roubo de vida. Registros antigos sem dados de composição continuam sendo exibidos como sem detalhamento.
- Personagens novos e saves antigos recebem 120 minutos de stamina online e 480 offline sem perder progresso existente. A reserva usada diminui durante a simulação e a outra se recupera a 0,2 minuto por minuto de caça; a caça para ao esgotar a reserva ativa.
- As barras online/offline aparecem na tela de caça e no relatório de retorno.

## Validação executada

- `npm run build` — concluído com sucesso.
- `git diff --check` — sem erros de whitespace; o Git apenas informou conversão automática de finais de linha LF/CRLF em alguns arquivos.

## Arte ainda necessária para ampliar as animações

O código aceita e anima arquivos PNG/GIF/Giff existentes, mas não foram gerados spritesheets novos para estados de ataque, magia, dano ou morte. Para evoluir essa parte, criar sprites pixel art por linhagem/monstro e colocar em `public/assets/characters/` e `public/assets/monsters/`, usando nomes estáveis como `NOME_idle.gif`, `NOME_attack.gif`, `NOME_cast.gif`, `NOME_hurt.gif` e `NOME_death.gif`. A integração de cada estado deve respeitar `prefers-reduced-motion` e não alterar intervalos ou regras de combate.

## Atualização — 02/11/2026

- Criada a família de pulseiras T1–T5, slot único, bônus de HP/MP e regeneração aplicada por tick. Entrou nas rotinas de drop, mochila, comparação, venda, desmanche, depósito e Wiki.
- O tutorial entrega a Pulseira do Primeiro Eco, uma relíquia exclusiva. Saves que já concluíram o tutorial recebem a peça uma vez; mochila cheia envia a recompensa ao Depot.
- História do Bosque agora exige o tutorial concluído. O Espectro exige nível 15, tem combate reforçado e o motor rejeita alvo bloqueado mesmo em save antigo. XP e gold deixam de multiplicar linearmente pelas estrelas: `1 + (dificuldade - 1) × 0,35`.
- Arena recebeu três planos táticos com efeitos diferentes e preserva a ordem de seleção como ordem de entrada. O combate continua automático; falta uma fase interativa por turno para deixar de ser apenas uma simulação.
- Fallback de emoji já é aplicado por `ItemIcon`; a lista de artes e prompts está em `docs/ARTE_ITENS_PENDENTES.md`.
- O Cérebro agora sincroniza o vault `Mythreon Obsidian/`; abra essa pasta no Obsidian como vault. Use `Ativação Cérebro.bat` para manter observação contínua enquanto a janela estiver aberta.
- Pack 36 concluiu a aplicação visual online de skins, luminescências e addons cosméticos. O loadout é separado do combate, a hunt exibe a aura do Pet e o painel de Personagem lista os cosméticos ativos. A validação autoritativa rejeita cosmético não possuído; faltam apenas artes finais e playtest em aparelhos reais.
- Pack 37 concluiu snapshots de PvP por temporada, tiers, prévia e resgate único de recompensas em Gold, Mythreon Shards e Mythreon Coins. A migration `015_pvp_season_rewards.sql` foi aplicada no Supabase de produção em 04/11/2026. Falta validar duas contas em paralelo e reconexão.
- Pack 39 adicionou as ligas Bronze, Prata, Ouro, Platina e Mítico com progresso até a próxima faixa no lobby. A liga é apenas visual e usa o rating autoritativo.
- Pack 40 adicionou combate por turnos server-side, HP, turno, cooldown, log de ações e encerramento autoritativo. A migration `016_pvp_turn_combat.sql` foi aplicada no Supabase de produção em 04/11/2026. Faltam reconexão e playtest concorrente real.
- Pack 41 adicionou retomada automática após recarregar a Arena, sincronização ao voltar à aba, atualização ao recuperar a conexão e indicador visual Online/Offline. Falta apenas o playtest concorrente real com dois navegadores/dispositivos.
- Pack 42 adicionou inteligência de preço no Mercado Negro: cada anúncio mostra, quando houver histórico, vendas acumuladas, média, menor e maior preço na moeda escolhida. Os dados vêm de `world_trade_item_stats` e não alteram o preço anunciado.
- Pack 43 adicionou snapshots mensais da coleção de Cards, faixas Colecionador/Mestre/Completo e resgate idempotente de Gold, Mythreon Shards e Mythreon Coins. A migration `017_card_season_rewards.sql` foi aplicada e confirmada no Supabase em 04/11/2026. Falta validar o ciclo mensal com uma conta real.
- Pack 44 adicionou índices de cobertura para FKs de Cards, PvP, Mercado, Ledger, Correio, Amigos e Trade. A migration `018_online_fk_indexes.sql` foi aplicada e confirmada no Supabase em 04/11/2026. O advisor de performance continua exibindo apenas recomendações de otimização de políticas RLS e índices ainda não usados, sem falhas de segurança novas.
- Pack 45 substituiu as políticas RLS que reavaliavam `auth.uid()` por linha por chamadas `(select auth.uid())`, mantendo exatamente o mesmo escopo de acesso. A migration `019_rls_initplan_hardening.sql` foi aplicada e confirmada no Supabase em 04/11/2026.
- Pack 46 corrigiu a reconciliação online: após uma ação otimista, o snapshot autoritativo retornado por `world.command` é aplicado imediatamente no cliente. O polling permanece apenas como recuperação e atualização do mundo; falta validar em dois dispositivos e com queda de rede real.
- Pack 47 adicionou o Armazém das Ferramentas na tela de Mineração/Pesca. Picaretas e varas T2–T5 podem ser compradas por gold somente quando a skill mínima é atendida; a compra é validada pelo mesmo comando online e o item entra na mochila para equipar.
- Para o próximo balanceamento global, registrar ao menos 20 encontros por faixa de nível/build e medir tempo, dano recebido, mortes, XP, gold e consumo de poção; depois calibrar mob por mob sem aplicar o mesmo multiplicador a atributos e recompensas.
