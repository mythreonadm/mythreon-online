---
projeto: Mythreon Online
tipo: entrega
status: implementado-localmente
data: 2026-11-05
resumo: Caça contínua durante o tutorial, pulso de coleta resiliente à latência e contador de pets por linhagem.
---

# Pack 62 — continuidade da caça, pulso de coleta e coleção de pets

## Correções entregues

### Caça não deve expulsar o jogador do mapa

O ciclo automático não é mais interrompido quando uma missão de tutorial fica concluída durante um combate. Antes, `tick()` chamava `stopHunting()` assim que qualquer objetivo tutorial ativo alcançava sua meta; a interface então voltava ao Refúgio depois de um único abate.

Agora a caça continua no mesmo mapa até que o jogador clique em **Sair**, a stamina online se esgote ou ocorra morte. A missão pode ser aberta pelo rastreador sem interromper o combate. A mesma regra está no motor local e no runtime online compilado.

### Barra e erro de Pesca/Mineração

O pulso continua autoritativo no servidor, mas a apresentação foi ajustada para conexões lentas:

- a resposta atrasada do `beginProfessionChallenge` não é descartada apenas porque o instante estimado já passou;
- a barra de preparação aparece imediatamente enquanto o servidor responde;
- soltar o primeiro toque enquanto a preparação ainda está em trânsito não cancela silenciosamente o desafio;
- a barra dourada aparece depois da preparação e continua sendo pontuada somente pelo servidor;
- perder foco ou cancelar explicitamente ainda abandona o desafio sem consumir recurso;
- o servidor continua validando UUID, janela, ferramenta, skill, recarga, isca e espaço na bolsa.

Isso corrige o caso em que o jogador via apenas “erro” e nunca conseguia enxergar o marcador para soltar. O pulso não fica menos seguro: apenas a UI deixou de transformar latência em cancelamento invisível.

### Contagem da coleção de Pets

O cabeçalho de Pets agora conta **linhagens descobertas** com `Set(instance.id)`, em vez de contar cada exemplar. Cópias, raridades e exemplares no cativeiro não aumentam o denominador nem permitem números como `16/12`. A tela informa separadamente quantos exemplares existem no total.

## Arquivos autorais

- `src/store/gameStore.ts` — caça contínua após conclusão tutorial.
- `server/generated/online-runtime.cjs` — runtime online regenerado com a mesma regra.
- `src/ui/ProfessionPrecisionAction.tsx` — preparação visível e tolerante à latência.
- `src/ui/professionScene.css` — animação visual do estado de preparação.
- `src/ui/DivineBeasts.tsx` — contador de linhagens e exemplares.
- `scripts/journey-check.cjs` — regressão que garante que a caça continua.

## Validações executadas

- `npm run typecheck` passou.
- `npm run professions:check` passou.
- `npm run professions:pulse-check` passou.
- `npm run online:check` passou.
- `npm run journey:check` passou, incluindo a regressão da caça contínua.
- `npx electron scripts/professions-ui-check.cjs` passou em desktop e 390px.
- `npx electron scripts/online-flow-ui-check.cjs` passou no fluxo online integrado.
- `npm run online:bundle` regenerou os runtimes sem erro.

Não houve commit, push, deploy, alteração de schema ou escrita no banco de produção. A validação visual usa Electron local; ainda é necessário conferir a implantação atual e um celular físico depois do deploy.

[[docs/conhecimento/Pack-57-Pulso-Autoritativo-de-Coleta-2026-11-04|Pulso autoritativo de coleta]] · [[docs/conhecimento/Pack-56-Fila-Online-e-Recuperacao-2026-11-04|Fila online]] · [[docs/conhecimento/Registro de problemas|Registro de problemas]]
