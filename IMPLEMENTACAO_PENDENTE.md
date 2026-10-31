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
