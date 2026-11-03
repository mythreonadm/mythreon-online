# Artes de itens pendentes — Mythreon Online

Salve cada ícone em `public/assets/items/` com o nome exato indicado. O jogo usa o PNG se existir e mostra o emoji configurado no item quando a arte ainda não foi criada.

## Prompt-base

> Crie um ícone de item para RPG online em pixel art profissional, inspirado na identidade arcana sombria de Mythreon Online. Um único objeto central, silhueta legível em 32×32 pixels, acabamento de pixel nítido sem antialiasing, paleta curta, luz coerente vinda do alto à esquerda, contraste forte em fundo escuro, objeto inteiro dentro do quadro, fundo totalmente transparente, arquivo PNG quadrado 256×256 com pixel art preservada. Não inclua texto, letras, números, moldura de interface, sombra de cenário, personagem ou objetos adicionais. Faça o item parecer utilizável dentro do jogo, não um desenho realista.

## Itens sem PNG no projeto

### Munição

- `FLECHA_T1.png` — Flecha de Madeira. Prompt: uma flecha curta de madeira clara, haste simples, ponta de pedra lascada e penas verdes, ícone de munição inicial humilde.
- `FLECHA_T2.png` — Flecha de Pedra. Prompt: uma flecha robusta com ponta de granito cinza, haste de madeira escura e penas cinza, aparência de equipamento de montanha.
- `FLECHA_T3.png` — Flecha de Aço. Prompt: uma flecha precisa com ponta de aço azul-prateado, haste escura e penas azul-marinho, acabamento marítimo.
- `FLECHA_T4.png` — Flecha Estelar. Prompt: uma flecha de metal dourado antigo com ponta em forma de estrela, pequenas runas luminosas e penas brancas, relíquia das ruínas.
- `FLECHA_T5.png` — Flecha do Eclipse. Prompt: uma flecha abissal negra com ponta violeta, núcleo ciano brilhante e penas roxo-escuras, raridade máxima sem excesso de partículas.

### Pulseiras e braceletes

- `PULSEIRA_T1.png` — Bracelete de Broto. Prompt: pulseira trançada de fibras verdes, um broto luminoso pequeno no fecho, simples e natural.
- `PULSEIRA_T2.png` — Pulseira da Seiva. Prompt: pulseira de madeira polida e âmbar verde, gotas de seiva brilhantes em três encaixes.
- `PULSEIRA_T3.png` — Bracelete de Maré. Prompt: bracelete de prata azulada e concha escura, uma pérola turquesa central evocando regeneração da maré.
- `PULSEIRA_T4.png` — Manilha Estelar. Prompt: manilha arcana de bronze antigo com cristal azul e pequenas estrelas douradas gravadas.
- `PULSEIRA_T5.png` — Bracelete do Eclipse Sereno. Prompt: bracelete de metal azul profundo com ouro velho, cristal violeta escuro e um fino arco de luz ciano, aparência de item de Tier 5 refinado e equilibrado.
- `UNICO_SIGILO_INICIACAO.png` — Pulseira do Primeiro Eco. Prompt: versão única e ceremonial da pulseira de iniciação, aro de prata escura com uma chama ciano e dourada no centro, detalhe de louro e brilho discreto; deve ser visualmente diferente do bracelete comum T5 e transmitir recompensa de tutorial.

### Relíquias únicas

- `UNICO_ANEL_GUARDIA.png` — Anel da Guarda Eterna. Prompt: anel de ouro antigo com um pequeno escudo azul no aro e uma gema verde de proteção; silhueta circular nítida.
- `UNICO_BRASA_ETERNA.png` — Brasa Eterna (PULSEIRA). Prompt: pulseira/bracelete de metal negro com uma brasa vermelha e dourada presa no centro, chama pequena contida num cristal, silhueta claramente de pulso e não de anel.
- `UNICO_CORACAO_GRANITO.png` — Coração de Granito. Prompt: coração mineral cinza de granito com fissura verde brilhante, pesado e protetor.
- `UNICO_ESCAMA_LEVIATA.png` — Escama do Leviatã. Prompt: escama azul-petróleo iridescente com borda prateada e gotas de água, formato de escudo pequeno.
- `UNICO_OLHO_ASTERION.png` — Olho de Asterion. Prompt: elmo compacto com uma única gema ocular dourada e marcas de estrela, relíquia das ruínas.
- `UNICO_PRESA_DEVORADOR.png` — Presa do Devorador. Prompt: presa curva negra com veios vermelhos e violeta, amarrada a um punho de arma escuro.

## Consistência ao gerar

Use o prompt-base junto da descrição específica. Gere um arquivo individual por item. Mantenha a mesma escala aparente, perspectiva 3/4, contorno escuro e iluminação; cada objeto deve ocupar cerca de 70% do quadro para ficar consistente na mochila, no personagem, no Ferreiro e na Wiki.

## Artes de mapas e monstros das rotas laterais

Salve em `public/assets/monsters/`: `SAPO_MIASMA.png`, `LIBELULA_LAMINA.png`, `CIPO_MEMORIA.png`, `CROCODILO_SILTE.png`, `MATRIARCA_LODO.png`, `ESCARAVELHO_VITREO.png`, `ESPECTRO_SOLAR.png`, `SERPENTE_MIRAGEM.png`, `GOLEM_OBSIDIANA.png` e `SENTINELA_ZENITE.png`.

Use o prompt-base, trocando a descrição por: “sprite individual de [nome], corpo inteiro, pose de combate idle, fundo transparente, sem cenário”.

Fundos: `public/assets/backgrounds/swamp.png` (pântano luminoso de raízes, veneno e água turva) e `public/assets/backgrounds/desert.png` (deserto de vidro, ruínas solares e miragens). Para versões animadas, use o mesmo nome com `.gif`; o jogo prefere o GIF e recua para PNG.
