---
title: "Pack 02 — Cativeiro, exemplares e personalização"
date: 2026-11-03
status: concluído
tags:
  - mythreon
  - pets
  - cativeiro
  - personalização
  - estado-do-jogo
---

# Objetivo

Transformar o cativeiro em um inventário real de exemplares, sem quebrar a regra de exibir o melhor exemplar de cada Besta Divina na encubadora, e tornar a personalização visual perceptível no personagem humano.

# Alterações entregues

## Cativeiro e exemplares

- Cada Besta Divina agora pode carregar um `instanceId` único.
- Ovos e fusões criam exemplares distintos.
- Drops de Besta também recebem identificadores próprios.
- Saves antigos recebem IDs determinísticos de legado durante a migração.
- O cativeiro exibe cada exemplar separado, com raridade e data de obtenção.
- A venda pode direcionar um exemplar específico.
- O melhor exemplar de cada linhagem continua protegido da venda pela interface.

## Personalização

- A tela de criação/edição agora mostra um preview do humano.
- Pele, cabelo e roupa são refletidos imediatamente por uma camada visual de aparência.
- A escolha continua usando o estado já existente de aparência; não há alteração nas regras de combate.

## Compatibilidade

- A matriz e a Besta Divina continuam equipadas simultaneamente.
- O Pack não altera economia, fórmulas de dano, drops ou regras de progressão.
- O formato continua dentro do estado JSONB já usado pelo personagem; não foi necessária nova tabela.

# Arquivos principais

- `src/types/index.ts`
- `src/store/gameStore.ts`
- `src/engine/save.ts`
- `src/engine/combat.ts`
- `server/game.ts`
- `src/ui/DivineBeasts.tsx`
- `src/ui/CharacterCustomization.tsx`
- `src/ui/Zone.tsx`
- `src/utils/appearance.ts`

# Contratos importantes

- `sellDivineBeast(id, instanceId?)`: quando o ID do exemplar é informado, somente aquele exemplar é removido.
- `DivineBeastInstance.instanceId`: identificador persistente do exemplar.
- `appearanceStyle(appearance)`: camada visual provisória para representar aparência até existirem atlas completos por combinação.

# Validação

- TypeScript: aprovado.
- Jornada/tutorial: aprovado.
- Fluxo online local com dois clientes: aprovado após aplicar as migrações necessárias no harness.
- Build de produção: deve ser executado no fechamento desta etapa.

# Próximos passos

1. Validar o fluxo de incubação e venda de dois exemplares iguais em produção.
2. Adicionar animações/efeitos sonoros específicos para cada Besta, mantendo fallback silencioso.
3. Ajustar o layout do cativeiro para telas pequenas.
4. Evoluir o preview para sprites/atlas de aparência por combinação, quando os assets finais estiverem disponíveis.
