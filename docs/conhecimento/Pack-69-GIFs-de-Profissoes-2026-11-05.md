# Pack 69 — GIFs de Mineração e Pesca

**Data:** 05/11/2026

## Arquivos de arte

Salvar os arquivos fornecidos pelo artista exatamente nestes caminhos:

- `public/assets/professions/MINERACAO_ATIVA.gif`
- `public/assets/professions/PESCA_ATIVA.gif`

Use `.gif` real, sem áudio, mantendo a mesma proporção da cena de profissão. A pasta contém `LEIA-ME.txt` com as instruções.

## Comportamento

`src/ui/ProfessionScene.tsx` escolhe o GIF quando a atividade está em `preparing`, `holding`, `confirming` ou `success` e as animações estão ativadas nas configurações. No estado `idle`, o cenário usa o PNG do bioma. O `AssetImage` retorna ao PNG se o GIF faltar, falhar ou se o jogador usar o modo de movimento reduzido.

## Checklist

1. Copiar os dois GIFs para os caminhos acima.
2. Abrir Ofícios → Mineração e clicar em um veio liberado.
3. Confirmar a troca para `MINERACAO_ATIVA.gif` durante o pulso.
4. Repetir em Pesca e confirmar `PESCA_ATIVA.gif`.
5. Desativar animações nas configurações e confirmar que o PNG continua sendo exibido.
6. Remover temporariamente um GIF e confirmar que o fallback do bioma funciona.
