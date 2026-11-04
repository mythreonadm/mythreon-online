# Pack 12 — Incubadora com progresso visual

Data: 04/11/2026

## Implementado

- A incubadora atualiza o contador a cada segundo sem recarregar a página.
- O tempo restante agora aparece junto de uma barra de progresso.
- Quando o horário chega, o estado muda claramente para “Ovo pronto para eclodir”.
- A eclosão continua sendo confirmada pelo botão do ovo, evitando consumo acidental.
- O texto deixa explícito que o horário é persistido e continua avançando fora da tela.
- O estado pronto recebe destaque visual verde, enquanto a incubação usa o tema ciano.

## Regras preservadas

- Um único ovo ocupa a incubadora por vez.
- O tier do ovo continua definindo a duração e as chances de raridade.
- Nenhum ovo é consumido antes de iniciar a incubação ou confirmar a eclosão.

## Validação recomendada

Iniciar um ovo, sair da aba Pets, voltar após o término, confirmar o estado pronto e eclodir somente o ovo selecionado.
