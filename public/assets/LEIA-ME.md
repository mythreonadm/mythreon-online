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
