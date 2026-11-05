# Pack 67 — Cenários visuais das áreas

**Data:** 05/11/2026  
**Escopo:** identidade visual para as áreas internas do Mythreon Online.

## Objetivo

Cada área recebeu uma cena própria em pixel-art 3D com iluminação cinematográfica, profundidade e espaço negativo para os controles. A imagem é decorativa: não substitui o estado, os botões ou a lógica do jogo.

## Artes adicionadas

| Área | Arquivo | Uso |
| --- | --- | --- |
| Fazenda | `public/assets/backgrounds/farm.png` | Cabana rural, canteiros, estufa, espantalho e cristal da Essência |
| Ofícios | `public/assets/backgrounds/professions.png` | Guilda com túnel de mineração, córrego e bancada de pesca |
| Ferreiro/Loja | `public/assets/backgrounds/forge.png` | Forja, bigorna, forno, armas e cristais |
| Duelo | `public/assets/backgrounds/duel.png` | Arena rúnica com plataformas opostas e sigilos de cartas |
| Cards | `public/assets/backgrounds/cards.png` | Arquivo de memórias, biblioteca e cartas de criaturas |

As artes foram geradas com o mesmo briefing visual: pixel-art 3D, fantasia de alto contraste, paleta azul-petróleo/ciano/ouro e centro escurecido para leitura de títulos e controles.

## Componente compartilhado

`src/ui/AreaBackdrop.tsx` centraliza:

- imagem com `AssetImage` e fallback já existente;
- camada de contraste para acessibilidade;
- kicker, título e descrição da área;
- ações e indicadores no lado direito;
- layout responsivo sem alterar a lógica da tela.

## Telas integradas

- `src/ui/Farm.tsx`
- `src/ui/Professions.tsx`
- `src/ui/Shop.tsx` (Loja Mythreon e Ferreiro)
- `src/ui/ArenaDuelos.tsx`
- `src/ui/CardAlbum.tsx`

## Checklist manual

1. Abrir Fazenda e verificar leitura dos canteiros sobre a cena.
2. Abrir Ofícios e iniciar um pulso de mineração e um de pesca.
3. Abrir Ferreiro e Loja Mythreon; confirmar que abas, saldo e botões continuam clicáveis.
4. Abrir Duelo e Cards em largura de celular e desktop.
5. Desabilitar temporariamente uma imagem para confirmar o fallback de `AssetImage`.

## Próximas extensões visuais

Aplicar o mesmo componente, quando houver arte final, às telas de Bestas/Pets, Calendário, Boss Diário, Mercado Negro e Laboratório de Builds. O padrão deve ser mantido para que novas áreas pareçam partes do mesmo mundo.
