---
title: "Pack 03 — Feedback visual do ataque do Pet"
date: 2026-11-03
status: concluído
tags:
  - mythreon
  - pets
  - combate
  - feedback
---

# Objetivo

Dar ao jogador uma confirmação imediata de que o Pet atacou, sem alterar dano, cadência, mana, resistência ou qualquer regra de combate.

# Alterações

- `TickResult` agora separa `beastDamage`, `beastElement` e `beastName` do dano agregado.
- O motor de combate preenche esses campos somente quando o ataque auxiliar do Pet acontece.
- A hunt mostra o número do dano do Pet separado do dano principal.
- O sprite do Pet pulsa durante o ataque.
- Um impacto visual independente aparece entre o Pet e o alvo.
- O feedback respeita as preferências de animação, efeitos e modo compatível.
- Em modo reduzido/compatível, a interface continua mostrando o dano mesmo quando a animação é desativada.

# Compatibilidade

- O dano total e o registro de combate continuam usando os mesmos valores de antes.
- A Matriz e o Pet continuam atuando juntos.
- Nenhum asset novo é obrigatório; o efeito usa o sprite existente e um fallback visual textual.

# Arquivos

- `src/types/index.ts`
- `src/engine/combat.ts`
- `src/ui/Zone.tsx`

# Validação

- TypeScript: aprovado.
- Verificação online de autoridade, PostgreSQL, chat, VIP, correio e troca: aprovada.
- Jornada visual: deve ser repetida com permissão de escrita do OneDrive para gerar o artefato temporário.

# Próximo passo

1. Executar playtest com Pet ativo em desktop e celular.
2. Medir se o número do Pet fica legível em telas pequenas.
3. Depois fechar a incubação por tempo real e a Fazenda avançada.
