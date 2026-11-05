---
projeto: Mythreon Online
tipo: entrega
status: implementado-localmente
data: 2026-11-05
resumo: Botão visível e destacado para abrir o ovo pronto na incubadora de Pets.
---

# Pack 64 — botão Abrir o Ovo

## Correção entregue

Quando o tempo do ovo termina, o cartão da incubadora agora mostra um botão grande, brilhante e animado com o texto **🥚 Abrir o Ovo**. O botão chama a mesma ação `hatchEgg` já usada pelo fluxo de incubação, respeitando a confirmação online, o sorteio de raridade e a criação do Pet.

O ovo incubado fica reservado no cartão superior. Assim, mesmo quando a lista de ovos disponíveis estiver vazia, o jogador entende que existe um ovo aguardando a abertura. Durante a incubação o botão não aparece; o cartão continua exibindo progresso e tempo restante.

## Arquivo autoral

- `src/ui/DivineBeasts.tsx` — ação e destaque visual da abertura; mensagem contextual para ovo reservado.

## Validação

- `npm run typecheck` passou.
- Não houve alteração de regra de raridade, tempo, inventário, drop ou balanceamento.
- Não houve commit, push, deploy ou alteração de schema.

Após publicar, validar: iniciar incubação, aguardar o término, clicar em **Abrir o Ovo**, confirmar a mensagem de Pet e verificar que o cartão volta ao estado sem incubadora.

[[docs/conhecimento/Pack-63-Profissoes-Bau-e-Caca-2026-11-05|Pack 63]] · [[docs/conhecimento/Registro de problemas|Registro de problemas]] · [[docs/conhecimento/00 - Fonte de conhecimento|Fonte de conhecimento]]
