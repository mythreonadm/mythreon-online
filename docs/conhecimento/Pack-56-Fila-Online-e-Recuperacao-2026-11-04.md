---
projeto: Mythreon Online
tipo: entrega
status: implementado-localmente
data: 2026-11-04
resumo: Fila durável por personagem e reconciliação da prévia sem apagar ações ainda pendentes.
---

# Pack 56 — fila online e recuperação

## Problema confirmado

O controlador substituía a tela inteira pelo recibo de uma ação anterior, apagando temporariamente ações posteriores. A persistência cobria apenas a requisição em voo. Flags globais também misturavam sessões antigas e novas. O Pack 46 removeu uma aplicação duplicada de estado, mas não resolveu esse problema; a correção descrita aqui é posterior.

## Comportamento entregue

- Cada personagem possui uma sessão com base confirmada, revisão e fila serial de até 32 comandos.
- A prévia é refeita sobre a base mais recente usando os comandos restantes. Confirmar o capacete preserva as botas pendentes; confirmar o primeiro plantio preserva o segundo.
- Apenas comandos explícitos, sem sorteio nem geração de IDs, têm projeção. Eclosão, síntese, forja e compras anunciam o resultado do servidor.
- O relógio injetável do store mantém o instante de criação de cada prévia ao reconciliar. O relógio normal do jogo permanece Date.now.
- Leituras iniciadas antes de uma ação ou recebidas durante a fila são descartadas. Recibos de revisões anteriores não substituem uma base mais nova.
- O diário local v2 guarda todos os comandos antes do envio, com personagem, requestId, argumentos, instante e marca de envio. Registros legados válidos são recuperados; registros malformados não são executados.
- Se a resposta se perder, a fila aguarda e repete o mesmo requestId. A idempotência do servidor existente continua obrigatória. Ações novas ficam suspensas durante a incerteza; navegação e consulta continuam disponíveis.
- Retomar uma sessão lê primeiro o servidor e não reaplica a prévia de um comando enviado que já pode estar incluído nessa leitura.
- Sair descarta callbacks antigos e preserva o diário para retorno. Uma resposta antiga não limpa o diário da sessão seguinte.
- Falha ao registrar uma ação impede seu envio; falha ao registrar a marca de envio segura a fila até o armazenamento voltar.
- Uma falha de apresentação após confirmação não rejeita a transação nem remove o próximo comando.
- A barra diferencia ações em confirmação, recuperação e estado salvo. Removido bloqueio visual global da tela.
- Cura online concluída pelo relógio solicita atualização autoritativa, evitando enviar o antigo método local healFull como comando inexistente.
- Corrigida a ordem dos hooks da Fazenda na transição de personagem vazio para carregado.

## Arquivos centrais

- src/online/session.ts: fila, revisões, diário e recuperação.
- src/online/projection.ts: snapshots e lista explícita de projeções.
- src/online/controller.ts: conexão, polling, identidade e adaptação dos comandos.
- src/online/confirmation.ts: aguardar resultado definitivo sem mudar o contrato local do store.
- src/store/gameStore.ts: relógio opcional injetável, padrão preservado.
- src/App.tsx e src/ui/OnlineCommunity.tsx: navegação e indicador de sincronização.
- Farm, DivineBeasts, Matrix, Shop, DailyCalendar, Professions e ProfessionPrecisionAction: resultados confirmados e proteções de interação relevantes.
- src/data/mythreonJournal.ts: anúncio voltado ao jogador.

## Evidências

- npm run online:session-check: motor real, equipamentos em fila, plantios, leitura antiga, rejeição, perda de resposta, requestId, reconexão, personagem diferente, diário legado/corrompido, armazenamento indisponível, IDs autoritativos e erro de assinante.
- scripts/online-flow-ui-check.cjs: Electron oculto/software, controlador e telas reais, HTTP controlado e motor executeGame. Dois plantios sem regressão, eclosão sem anunciar sorteio local, navegação durante recuperação e cupom cobrado uma vez. PC e 390px, sem overflow. Capturas em node_modules/.cache/online-flow.
- calendar:check, cosmetics:check, professions:check e journey:check passaram.
- Prévia de calendário e profissões passou após os novos handlers assíncronos.
- typecheck e build passaram. Runtime gerado pelo build, sem edição manual. Permanece aviso do pacote JavaScript principal acima de 500 kB.
- Revisão React: hooks antes de retornos condicionais, limpeza de timers, bloqueio de ações por refs onde necessário e aria-busy sem impedir a navegação.

## Limites e próxima sequência

Não houve publicação, migração de banco ou alteração de regras de dano/drop. Não houve homologação real em Supabase, múltiplas conexões, Android físico ou rede móvel. O teste HTTP usa infraestrutura controlada e não prova concorrência de produção.

A confirmação não foi adiada para uma hora: cada mutação continua validada e persistida pelo servidor. A melhora cobre perda de prévias e bloqueio global; não elimina latência real, custo do polling nem tamanho do bundle. Resultados aleatórios aguardam a rede por fidelidade.

O diário depende do armazenamento deste navegador/aplicativo; não é uma fila compartilhada entre dispositivos. Repetir a mesma transação só é seguro enquanto o backend preservar seus recibos idempotentes. A sessão atual usa a política existente do servidor.

Próximos slices: medir latência/carga real, verificar conta em dois dispositivos, revisar custo de polling e dividir o bundle sem quebrar o carregamento; depois retomar desafios autoritativos de profissão, apresentação das cenas e entregas restantes do backlog. Não declarar todos os sistemas prontos para lançamento.

[[docs/conhecimento/Contas-Online-e-Social|Contas online]] · [[docs/conhecimento/Auditoria-Backlog-2026-11-03|Backlog]] · [[CEREBRO_MYTHREON|Continuidade]]
