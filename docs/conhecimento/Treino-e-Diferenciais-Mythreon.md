---
projeto: Mythreon Online
tipo: pesquisa
status: parcial
atualizado: 2026-11-02
resumo: Treino implementado e propostas de identidade própria fundamentadas em pesquisa de idle games.
---

# Disciplina e um mundo que se lembra

## Treino implementado

- Treino e hunt são exclusivos. Treino não dá XP de personagem, loot ou gold por tick. Gold das conquistas é recompensa única.
- Treino concede 15 XP a cada 3 segundos; buff diário concede +50% somente no intervalo em que estava ativo.
- Custo de nível de habilidade: 1500 + 150n + 15n², n = max(0, habilidade − 10). Primeiro nível a partir de 10: cinco minutos sem buff; os próximos ficam mais demorados.
- Cada nível conquistado praticando também gera um nível de maestria da disciplina, salvo separado dos atributos distribuídos. Saves antigos mantêm skills/XP, mas não recebem maestria por tempo que nunca foi medido.
- Maestria ofensiva: +1% por nível, máximo 30%, aplicada ao ATK com arma correspondente ou ao MATK para magia. Defesa aplica a maestria na armadura. Alma dá +1 regeneração de MP por cinco níveis de maestria, máximo +5/tick.
- Pontos distribuídos continuam dando atributos fixos; não concedem maestria.
- Conquistas globais por tempo efetivo: 5 min (100 gold + 2 Fragmentos Comuns); 30 min (250 + 5); 2 h (500 + 10); 10 h (1500 + 25). Pagamento automático uma vez; sem espaço suficiente na mochila, Fragmentos vão ao depósito.
- Treino funciona com jogo aberto. Atraso de aba processa no máximo 60 segundos; não existe simulação de treino offline. Iniciar/repetir no mesmo instante não concede ticks.
- Implementação: src/engine/training.ts, stats.ts, store/gameStore.ts, types/index.ts e ui/TrainingProgress.tsx/Zone.tsx.
- Evidências: build passou; executor scripts/balance-audit.cjs --check passou em ticks gratuitos, conquista única, cinco minutos exatos, ganho de maestria, separação de pontos e teto de 30%, além das verificações anteriores.
- Limite: reajuste da curva de habilidades não normaliza XP parcial antigo; esse XP permanece e é processado no próximo treino. A maestria é permanente e sem decaimento. Avaliar sessões longas antes de alterar o teto.

## Pesquisa: fatos e interpretação

Leitura de fontes oficiais em 2026-11-02; não houve playtest desses jogos nesta sessão.

- Melvor Idle apresenta habilidades de combate e não combate e árvores que desbloqueiam bônus permanentes: https://news.melvoridle.com/announcing-melvor-idle-into-the-abyss/
- IdleOn descreve uma equipe de personagens com progressão offline e sinergias entre profissões/classes: https://www.legendsofidleon.com/
- Kittens Game documenta economia de recursos e desafios com restrições: https://wiki.kittensgame.com/en/general-information/resources e https://wiki.kittensgame.com/en/game-tabs/challenges . A página de desafios não retornou corpo legível na abertura; pesquisa limitada aos resultados indexados.

Minha interpretação: decisões de alocação, sinergia e restrições escolhidas sustentam o interesse melhor que uma fila de bônus obrigatórios. Mythreon já tem coleção/builds; sua oportunidade é fazer essas escolhas mudarem situações e histórias. Não alegar que qualquer proposta abaixo é inédita em toda a indústria.

## Proposta principal — Cicatrizes da Essência

Estado: proposta, não implementada. Frase de produto: **O mundo se lembra de como você o atravessa.**

O jogador não apenas acumula kills. A região registra o tipo de interação e produz um estado próprio daquela campanha. Caçar repetidamente lobos pode abrir espaço para espinheiros; usar muito fogo pode revelar uma cicatriz de brasa; recuperar o equilíbrio desperta outro conjunto de encontros. Estados e consequências são visíveis e previsíveis.

Loop: escolher rota → observar sinais da região → caçar → revelar uma cicatriz → escolher explorar ou restaurar → preparar disciplina/build → enfrentar um Eco → registrar uma página do Arquivo. O jogador decide antes de deixar o idle rodando, e encontra consequências ao voltar.

MVP proposto: apenas Bosque, três estados (Equilibrado, Predação, Brasa), três contratos e uma escolha de encerramento. Um estado por região, trocável por uma missão curta; nada de alteração permanente irreversível. Cadência por progresso acumulado, sem exigir logins em horário marcado. Nenhuma perda de inventário causada por ausência.

Escolhas horizontais: Brasa aumenta a chance de material de fogo, mas reduz outro material; restauração favorece vínculos naturais. O orçamento esperado total de loot/gold permanece próximo. Não multiplicar todos os drops ou punir quem prefere repetir uma rota. Regras descobertas entram na Wiki; pistas iniciais evitam necessidade de guia externo.

Integração técnica proposta: registro limitado de ações por zona (não histórico ilimitado por kill), máquina de estados persistida no save, contratos em quests, eventos no combate e legenda na seleção de mapa. Primeiro local por personagem; mundo compartilhado exige backend futuro.

Riscos: rota ótima universal, jogador preso num estado indesejado, poluição visual e custo de conteúdo. Mitigações: reversibilidade, vantagens com contrapartidas, indicadores simples e um único bioma no MVP. Monetização sugerida: apresentações cosméticas dos estados e encadernações do Arquivo; regras e escolhas acessíveis ao free.

Critérios propostos: jogadores entendem a mudança sem suporte, escolhem mais de uma rota, não perdem rendimento de forma inesperada e têm motivo para testar outro caminho. Medir essas hipóteses em playtest; não são resultados atuais.

## Outras propostas para o mundo

| Ideia | Escolha nova para o jogador | Custo/risco | Prioridade proposta |
|---|---|---|---|
| Ecos de Combate | Reenfrentar desafios curtos inspirados na própria hunt com uma restrição escolhida; preparar build antes | Evitar repetir combate sem decisão ou duplicar loot farmável | 2, complemento da Cicatriz |
| Juramentos da Essência | Escolher um compromisso por expedição: sem poções, só humano, elemento específico; ganhar capítulo/título | Recompensa lateral para não obrigar challenge em toda hunt | 3 |
| Temperamento de Beast | Duas vocações reversíveis por Beast: ataque sustentado ou proteção/vínculo | Não transformar pet em bônus extra obrigatório; manter exclusividade com Matriz | 3 |
| Doutrinas de Treino | Após dominar disciplina, equipar uma única técnica: impacto, precisão ou controle | Número pequeno e escolhas com contrapartida; não somar tudo | 2 após testar maestria |
| Expedição com plano | Selecionar rota de 2–3 encontros e política de retirada, em vez de só alvo único | Pode gerar morte offline inesperada; prévia e retirada segura necessárias | 4 |
| Oficina de Protótipos | Gastar materiais comuns para testar temporariamente uma combinação de Matriz | Evitar fabricar item definitivo barato ou substituir farm | 2 |
| Bestiário de Comportamento | Descobrir padrões dos monstros e desbloquear formas alternativas de enfrentá-los | Não condicionar descoberta a milhares de kills cegas | 3 |
| Arquivo das Decisões | Páginas e títulos descrevem escolhas reais e conquistas do personagem | Texto baseado em modelos/lore consistente; sem IA paga por evento | 1, junto do MVP |
| Contratos de Guildas NPC | Escolher qual região ajudar; cada guilda oferece utilidade própria | Reputação reversível e sem exigência de entrar diariamente | 4 |
| Relíquias de Jornada | Item guarda marcas limitadas de feitos e permite escolher uma especialização | Não dar crescimento infinito ou vantagem apenas por antiguidade | 4 |
| Laboratório de Builds | Comparar duas configurações contra inimigo conhecido sem consumir recursos | Mostrar estimativas e limites; não simular falsamente toda hunt | 1, instrumento de balanceamento |
| Refúgio Vivo | Cabana evolui visualmente com treino, espécies e missões, sem cobrar manutenção | Conteúdo cosmético pode ser caro; usar marcos e poucos assets | 3 |

Não implementar todas juntas. Ordem recomendada: estabilizar treino → laboratório de builds → Cicatrizes do Bosque + páginas do Arquivo → Ecos/Juramentos. Cada etapa deve provar que acrescentou uma escolha compreensível antes da expansão.

## Decisão de escopo

Nesta sessão foi implementado treino/maestria/conquistas. Cicatrizes e demais ideias são propostas para o criador avaliar, não promessas do site nem mecânicas existentes.

## Relações

- [[CEREBRO_MYTHREON]]
- [[Balanceamento-Combate-Economia]]
- [[Shop-Premium-Beasts]]
