---
projeto: Mythreon Online
tipo: entrega
status: implementado-localmente
data: 2026-11-04
resumo: Evolução real de Cards por cópias livres/gold e bônus compartilhados entre combate, Álbum e Personagem.
---

# Pack 59 — Cards: evolução e bônus reais

## Problemas confirmados

O Álbum mostrava a soma dos atributos brutos como se fosse o bônus recebido pelo herói. A hunt aplicava15% HP,20% ATK,15% DEF e0,2% SPD. Havia ainda uma mensagem prometendo evolução com cópias sem comando ou interface de evolução.

## Regra de evolução

- Níveis1–5; preservada a curva existente de+20% do valor inicial por nível:100/120/140/160/180%.
- Para evoluir do nível L, consome2^L cópias adicionais da mesma espécie, de nível1 e fora da formação:2/4/8/16.
- A carta principal mantém UID, obtainedAt e posição na formação, se equipada. Não remove a última espécie da coleção.
- Gold por evolução: base da raridade × L². Bases: Comum150; Incomum300; Raro600; Épico1200; Lendário2400.
- Do nível1 ao5 são30 cópias extras e30× a base em gold. Não usa Coins, sorteio ou chance de perda.
- O usuário escolhe a carta principal e as cópias consumidas, revisa o custo e confirma. Até64 materiais são mostrados por vez; a sugestão escolhe os mais antigos que estejam livres.
- Cópias equipadas, evoluídas, de outra espécie, UID repetido, UID não possuído, material insuficiente, nível máximo ou saldo insuficiente são recusados sem alterar o estado.
- O comando exige expectedLevel. Repetir a mesma intenção com outro requestId não compra outro nível por acidente.
- Consumo e gold acontecem no mesmo clone/commit; o recibo idempotente existente protege a repetição do mesmo requestId.
- Recalcular bônus ao evoluir não cura HP. Mantém equipamentos, Matriz, Pet, inventário e regras de hunt.

Estes custos são uma regra inicial de progressão, não prova de economia equilibrada em sessões prolongadas.

## Uma fonte para os bônus

src/engine/cardCollection.ts fornece equippedCards, cardHeroBonus, formationBonus, cardFormationScore, cardEvolutionQuote e evolveCard.

Combate, pontuação de Cards, poder PvP, Personagem e Álbum usam esses cálculos compartilhados. Formação efetiva considera no máximo5 UIDs válidos diferentes; saves com IDs repetidos/ausentes não multiplicam bônus. Várias cópias da mesma espécie continuam permitidas, desde que sejam instâncias diferentes. O comando valida propriedade e o limite de5.

getCardStats limita a leitura a níveis inteiros1–5. Valores inválidos não podem gerar poder sem limite. A leitura defensiva não apaga cartas do save.

Exemplo Lobo-Feral Nv1: HP100/ATK25/DEF10/SPD30 brutos viram+15HP/+5ATK/+1,5DEF/+6%SPD antes de multiplicadores/caps. Ao evoluir paraNv2: +18HP/+6ATK/+1,8DEF/+7,2%SPD. Personagem preserva as casas decimais na explicação.

O índice da formação é uma parcela de Gear Score. Não chamar esse componente isolado de diferença exata da pontuação completa. Traços e abilityDesc não ganham efeitos especiais de hunt/PvP por este pack; a interface distingue atributos aplicados da descrição da criatura.

## Interface e arquivos

- CardAlbum: busca, filtros, memórias não descobertas, formação editável, seleção de cópia por UID, custo/seleção de materiais, revisão, resultado confirmado e acesso por teclado.
- CardArt: reutiliza sprites dos monstros do bioma, com fallback emoji. Não foram geradas novas imagens.
- CardsGuide/Wiki: fórmulas, custos por raridade/nível, drops e funcionamento sazonal.
- Personagem: mesma origem de bônus, sem truncar DEF/HP/ATK fracionários.
- ArenaDuelos: hook de sincronização movido antes do retorno sem personagem, evitando ordem de hooks diferente no carregamento inicial.
- server/game.ts: evolveCard(uid, materialUids, expectedLevel), com limite de16 materiais e validação de argumentos. setCardLoadout continua validado.
- server/world.ts: pvpPower usa a pontuação compartilhada. Sem alteração de queries/schema.
- src/data/cards.ts: leitura de nível limitada e cardDropChance reutilizado pelo drop e Wiki, preservando chances anteriores.
- Jornal, package.json, scripts/cards-check.ts, scripts/online-check.ts e scripts/online-flow-ui-check.cjs atualizados. Runtime gerado pelo build.

Evolução não é projetada como resultado definitivo antes do recibo. O Álbum aguarda confirmedAction, bloqueia cliques repetidos e atualiza a mesma carta por UID. Troca de personagem invalida leituras sazonais e mensagens antigas.

## Evidências

- cards:check passou: toda carta atual tem criatura de origem; limites de drop por tier/boss; custos/níveis1–5; proteção de cópias; identidade/espécie/formação; ausência de cura; rollback; nível esperado; limite de formação; bônus e Gear.
- online:check passou no banco/API real do teste PGlite: evolução de carta equipada, recusa de material equipado, consumo de duas livres, cobrança única no replay, bloqueio da intenção antiga e preservação da contagem de espécie.
- online:session-check, cosmetics:check, professions:check, calendar:check e journey:check passaram.
- typecheck e build passaram. Permanece aviso do bundle principal acima500kB (~1,11MB).
- Teste integrado com telas/controlador/HTTP/motor reais passou em PC e390px: clique duplo envia uma evolução; estado antigo é mantido enquanto confirma; carta viraNv2; custo é600; protegida permanece; bônus15→18 e formação30→33HP; retirar/equipar e escolher cópia funcionam.
- Mesmo teste verifica+3,3DEF no Personagem e monta ArenaDuelos desde personagem vazio sem erro de hooks. Escape fecha o diálogo.
- Capturas cards-mobile.png e cards-desktop.png ficam em node_modules/.cache/online-flow. A captura aguarda imagem e pintura, evitando registrar frame anterior ao recibo.
- Revisão React: hooks antes dos retornos, limpeza de listeners, foco do diálogo, refs de bloqueio e respostas vinculadas ao personagem.

## Limites e próxima etapa

Sem commit/push/deploy, migração ou banco de produção. HTTP do teste usa motor real, mas Auth/Realtime e painel sazonal são fixtures. PGlite é serializado; não prova concorrência de conexões reais. Não houve Android físico, rede móvel ou teste de volume de coleção.

O catálogo continua com38 cartas dos biomas originais. Faltam os Cards dos dez mobs de Veyra/Kaelor, incluindo integração com a referência de catálogo das temporadas para não deslocar conquistas no meio do mês. Não adicionar esses templates silenciosamente sem tratar o denominador sazonal.

Faltam catálogo sazonal/cosméticos, histórico amplo de coleção, paginação para acúmulos grandes, negociação de cartas (não são itens do Market atual), conteúdo dos traços no duelo local e playtest dos custos. Não declarar todos os Cards ou o lançamento concluídos.

[[docs/conhecimento/Pack-32-Cards-Atributos-Hunt-2026-11-04|Pesos da hunt]] · [[docs/conhecimento/Pack-43-Cards-Recompensa-Sazonal-2026-11-04|Temporadas]] · [[docs/conhecimento/Auditoria-Backlog-2026-11-03|Backlog]]
