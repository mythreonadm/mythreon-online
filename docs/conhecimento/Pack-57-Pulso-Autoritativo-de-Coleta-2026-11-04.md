---
projeto: Mythreon Online
tipo: entrega
status: implementado-localmente
data: 2026-11-04
resumo: Pulso online de coleta criado e pontuado pelo servidor, com uso único e cancelamento.
---

# Pack 57 — pulso autoritativo de Mineração e Pesca

## Problema e decisão

O servidor validava acesso, ferramenta, recarga e inventário, mas aceitava a precisão 0.5/1/1.5 enviada pelo cliente. Um cliente alterado podia solicitar sempre o bônus perfeito. O protocolo online agora exige um desafio gerado e consumido no servidor. A nota não é parâmetro do pedido final.

## Protocolo

1. beginProfessionChallenge recebe somente profissão e ponto. Confere travessia, skill, categoria/profissão/tier da ferramenta e recarga. Recusa outro desafio ativo do mesmo personagem, mesmo de profissão diferente.
2. Cria UUID aleatório e alvo entre 40% e 75% da barra. Guarda tudo em WorldState.professionChallenge, no JSON existente do personagem, dentro da transação normal.
3. O início é programado 1.200ms depois da preparação. Duração do pulso: 3.000ms. Ouro mantém raio4,5% e prata11%. Expira 750ms depois do fim visual.
4. finishProfessionChallenge recebe só o UUID. Usa Date.now no servidor para pontuar; não aceita precisão nem horário do navegador. Janela de graça após o pulso concede no máximo bronze.
5. UUID correspondente é consumido na tentativa final, inclusive antecipada, expirada, com ferramenta inválida ou bolsa cheia. UUID incorreto não apaga o desafio legítimo.
6. Ferramenta, travessia, skill e recarga são conferidas novamente ao finalizar. Coleta existente mantém entrega atômica, quantidades e +1/+2 skill. Nenhum recurso parcial fica na bolsa ao rejeitar.
7. cancelProfessionChallenge remove apenas o UUID correspondente, sem prêmio/cobrança. Desafios abandonados expiram; um novo pode substituir o vencido.
8. Recibos da API e fila do Pack56 mantêm o mesmo requestId para recuperação. Outra requisição com o UUID de pulso já consumido não concede novamente.

mineResource/fishSpot diretos foram bloqueados no dispatcher online. Continuam disponíveis no domínio local para jogo offline. Cliente online antigo precisa recarregar/atualizar para usar o novo protocolo.

## Interface

Mouse, toque e Espaço/Enter continuam com segurar/soltar. Durante a preparação, o botão orienta manter pressionado. A contagem inicial antecede o marcador. A prévia estima o deslocamento por metade do tempo de ida/volta; isso serve à apresentação, nunca à pontuação.

Soltar antes da preparação terminar cancela o desafio assim que a resposta chega. Sair da página faz o mesmo. Não há liberação de recurso ao soltar antes da contagem, cancelar, perder foco ou expirar. A mensagem de resultado usa a precisão confirmada pelo servidor, com quantidade e skill.

Wiki e Jornal explicam o novo fluxo. O modo offline mantém o pulso imediato anterior. Não houve alteração em fórmulas de drops, dano, skills de combate, tiers ou receitas.

## Arquivos

- src/engine/professionChallenge.ts: contrato, acesso, preparação e resolução.
- server/game.ts: dispatcher, estado persistido, uso único e bloqueio dos comandos antigos.
- src/ui/ProfessionPrecisionAction.tsx: preparação assíncrona, contagem, cancelamento tardio e nota confirmada.
- src/ui/Professions.tsx: integração dos pontos ao protocolo, mantendo ações locais.
- src/ui/ProfessionsGuide.tsx e src/data/mythreonJournal.ts: comunicação ao jogador.
- scripts/profession-challenge-check.ts: cenários controlados de relógio/domínio.
- scripts/professions-check.ts: cinco tiers agora exercitados por preparação/finalização com relógio controlado.
- scripts/online-check.ts: protocolo no PostgreSQL/PGlite, acesso, replay e bloqueio de coleta direta.
- scripts/online-flow-ui-check.cjs: telas reais + controlador + HTTP + executeGame, mouse/teclado/toque emulados.
- package.json: professions:pulse-check. Runtime regenerado pelo build, nunca editado manualmente.

## Evidências e limites

professions:pulse-check passou: acesso negado, um pulso por personagem, UUID incorreto/outro personagem, parâmetro de score recusado, soltura antecipada, perfeito/bom, recarga, expiração, cancelamento, ferramenta removida, bolsa cheia e uso único.

professions:check e online:session-check passaram. online:check passou após atualizar os testes de coleta para o protocolo real. O teste de banco ajusta o horário do desafio por acesso privilegiado da fixture para não dormir; isso não é uma capacidade oferecida ao jogador.

Teste integrado de UI passou em PC e390px: preparação atrasada, coleta perfeita confirmada, soltura antes da resposta, cancelamento ao navegar e toque com nota bronze. O teste usa motor real e HTTP controlado; autenticação/Realtime são substitutos locais. Prévia offline de profissões também passou. Capturas ficam em node_modules/.cache/online-flow/profession-*.png.

typecheck e build passaram. Permanece o aviso conhecido de bundle principal acima500kB. Cérebro/Obsidian sincronizados ao fechar a entrega. Sem push, deploy, schema novo ou escrita em banco de produção.

Não é um sistema anti-macro completo: um programa ainda pode observar o desafio e temporizar o envio. O ganho é retirar confiança na nota/horário enviados pelo cliente e impedir finalização repetida. O servidor pontua no processamento do comando; latência, jitter e espera por locks podem mudar a nota em relação à prévia. Não alegar homologação em Android físico, rede móvel ou múltiplas conexões concorrentes.

## Próximos trabalhos

Medir distribuição de latência e notas em dispositivos reais antes de afinar janelas. Faltam cenas de rio/personagem e mina, consumo de iscas, rotas laterais, mais destinos de recursos na forja e curva de skill menos linear. O domínio online permanece autoritativo por ação; não adiar a persistência para uma hora.

[[docs/conhecimento/Pack-53-Profissoes-Tiers-e-Pulso-2026-11-04|Base de profissões]] · [[docs/conhecimento/Pack-56-Fila-Online-e-Recuperacao-2026-11-04|Fila online]] · [[docs/conhecimento/Auditoria-Backlog-2026-11-03|Backlog]]

## Atualização posterior — Pack 58

[[docs/conhecimento/Pack-58-Cenas-e-Iscas-de-Profissoes-2026-11-04|Cenas e iscas]] adiciona baitId opcional à preparação (terceiro argumento), vinculado ao pulso e revalidado na conclusão. Finalização continua aceitando somente o UUID. Isca só é consumida com a entrega válida, com+1 peixe. Cenas agora existem como base usando o humano em pé e fundos atuais; pose sentada/cenário exclusivo permanecem pendentes. Demais limites acima preservados.
