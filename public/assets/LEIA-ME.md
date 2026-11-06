# Assets visuais do Mythreon

Todas as pastas visuais aceitam `.png`, `.gif` e `.giff`:

- `backgrounds/` — mapas e cenários;
- `branding/` — logos e marcas;
- `items/` — equipamentos, materiais, ovos e itens de interface;
- `monsters/` — criaturas e chefes;
- `pets/` — Bestas/Pets;
- `players/` e `players/skins/` — personagens e skins;
- `professions/` — cenas de mineração e pesca;
- `ui/` e `vfx/` — ícones e efeitos.

Quando existir mais de uma extensão com o mesmo nome-base, o carregador usa esta ordem:

1. `nome.gif` (animação);
2. `nome.giff` (alias aceito para GIF);
3. o arquivo original solicitado pelo componente;
4. `nome.png` (fallback estático);
5. emoji ou fallback visual do componente.

Exemplo: `mountain.gif` será usado automaticamente no lugar de `mountain.png`. Para
desativar animações em acessibilidade/economia de desempenho, o componente pode
solicitar explicitamente o modo estático.

Sprites em `players/` e `players/skins/` usam PNG transparente primeiro quando há
as duas versões. Os GIFs atuais dessas pastas possuem uma matte branca e seriam
renderizados como um quadrado branco sobre o mapa; quando um GIF transparente for
necessário, o componente pode solicitar explicitamente `preferAnimated`.

## Mochilas

As artes das mochilas ficam em `items/` com estes nomes canônicos:
`BACKPACK_NORMAL.png`, `BACKPACK_OLD.png`, `BACKPACK_COURO.png`,
`BACKPACK_REFORCADA.png`, `BACKPACK_EXPLORADOR.png` e `BACKPACK_ARCANA.png`.
Saves antigos que tenham apenas `OLD`, `COURO`, `REFORCADA`, `EXPLORADOR` ou
`ARCANA` também são resolvidos automaticamente. Enquanto a arte dedicada de
`BACKPACK_COURO` não for adicionada, o jogo usa `BACKPACK_NORMAL.png` como
fallback visual, sem voltar para emoji.
