# Pack 51 — Retaliação e vida da batalha cooperativa

## Regras implementadas

O Boss reage a cada ataque aceito enquanto ainda tiver HP. O golpe final não recebe retaliação. A vida cooperativa é um snapshot do HP máximo ao entrar no ciclo, mínimo 120, guardada em Character.dailyBossBattle. O HP/MP da hunt, poções, Bless, penalidades de morte e estado de caça não são usados nem consumidos por esta mecânica.

O estado guarda runId, hp, hpMax, damageTaken, knockouts, recoveryUntil e lastDamage. Somente a API calcula esses campos. A entrada no mesmo ciclo não cura; entrar em outro cria uma vida nova. Leitura não cura nem avança combate.

Nocaute bloqueia ataques durante 30 segundos. Após o prazo, o próximo ataque retorna com a vida de batalha cheia e recebe a reação normal se o Boss sobreviver. A contribuição já registrada e o direito de recompensa permanecem. A recuperação não exige gold ou poção.

## Cálculo defensivo inicial

- ATK vem do monstro associado ao template persistido do Boss.
- Escala de retaliação: 1 + 4% por participante adicional, até dez adicionais (teto 1,40).
- Mitigação por armadura e defesa usa mitigatedDamage, com arm + def × 0,5.
- Resistência física ou mágica conforme o dano do monstro; se houver elemento, aplica resistência elemental a 35% do dano.
- Resistências seguem o teto global de 60%. O dano efetivo mínimo é 1 e o registro não ultrapassa o HP restante do jogador.
- Cooldown ofensivo continua 2,5s, validado pelo servidor antes de aplicar os efeitos.

Valores de recuperação/escala são a proposta inicial para playtest, não evidência de balanceamento de todas as builds.

## Persistência e apresentação

A vida é persistida na mesma transação que dano, contribuição e HP do Boss; o requestId evita reaplicar retaliação em replay. Não há schema novo. dailyBoss.read devolve combat apenas para o próprio personagem; o roster público continua sem vida privada, inventário ou owner.

Arena mostra vida cooperativa, dano recebido confirmado e estado de recuperação. O botão bloqueia durante nocaute e indica quando voltar. A hunt pode continuar com seu estado anterior; esta mecânica não executa tick nem pausa automaticamente a caçada.

## Evidências

online:check, typecheck, build e prévia Electron passaram nesta rodada. O build regenerou o runtime da API e manteve apenas o aviso conhecido de chunk principal acima de 500 kB.

online:check verifica: retaliação positiva, HP/MP/gold/Bless/caça preservados, replay sem novo dano, nocaute, reinscrição sem cura, bloqueio sem contribuição extra durante recuperação, retorno após prazo, último golpe sem reação, escala por grupo e teto de resistências.

A prévia Electron verifica vida de batalha, número de retaliação e estado Recuperando, além do cenário e layout de PC/390px do Pack 50. É fixture isolada, não uma sessão real de múltiplos jogadores.

Arquivos: src/engine/dailyBossBattle.ts, src/types/index.ts, server/world.ts, src/ui/DailyBoss.tsx, src/ui/DailyBossArena.tsx, src/ui/dailyBossArena.css e scripts de teste online/arena.

## Continuidade

Faltam escolha ativa de defesa/esquiva, telegrafia de ataques especiais, inscrição antecipada do próximo ciclo, carga com conexões independentes e balanceamento de vinte sessões por faixa/build. Ações remotas continuam por polling. Não houve migração de banco, commit, push ou deploy.
