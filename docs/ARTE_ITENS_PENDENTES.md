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

## Pack 53 — recursos de Mineração e Pesca

Pasta exata: `C:\Users\dreey\OneDrive\Área de Trabalho\MYTHREON ONLINE\public\assets\items\`. Nomes abaixo respeitam os identificadores do código. Enquanto não houver arte, o jogo exibe o emoji. PNG transparente é o destino final; pode gerar sobre branco e recortar.

Use este prompt completo em cada arquivo, substituindo apenas DESCRIÇÃO pela descrição da tabela:

> Ícone individual de item de RPG de fantasia arcana Mythreon Online, pixel art profissional com volume em perspectiva 3/4, pixels nítidos e silhueta compreensível em 32×32, exportação PNG quadrada 256×256, objeto inteiro central ocupando 70% do quadro, margem vazia larga, luz superior esquerda, contorno escuro, paleta curta com acentos turquesa e dourado discretos, sem antialiasing, sem texto, sem letras, sem números, sem moldura, sem cenário, sem outros itens. Fundo branco puro uniforme para recorte. DESCRIÇÃO.

| Salvar como | DESCRIÇÃO |
|---|---|
| MINERIO_COBRE.png | Pequeno aglomerado de pedra cinzenta com três veios de cobre laranja avermelhado brilhante, facetas robustas, recurso de mineração T2 das montanhas de gelo e lava. |
| MINERIO_ECLIPSE.png | Aglomerado de minério negro violeta com núcleo luminoso em forma de eclipse, fissuras turquesa, poucas partículas douradas próximas do objeto; recurso T5 lendário do abismo, sem anel de interface. |
| TRUTA_GELO.png | Uma truta inteira curvada discretamente para cima, escamas prata azuladas, pequenas nadadeiras translúcidas de gelo e olho âmbar, peixe mágico T2, sem água ao redor. |
| PEIXE_CORAL.png | Um peixe inteiro de recife em perfil 3/4, escamas coral alaranjadas, nadadeiras turquesa e pequenas ramificações semelhantes a coral na barbatana dorsal, peixe mágico T3, sem água ou cenário. |
| PEIXE_ASTRAL.png | Um peixe inteiro do abismo astral, corpo azul noite e violeta com poucos pontos estelares, nadadeiras turquesa luminosas e ponta dourada na cauda, silhueta compacta legível, peixe lendário T5, sem nebulosa de fundo. |

As artes existentes MINERIO_FERRO.png, CRISTAL_ESSENCIA.png, MINERIO_OBSIDIANO.png, PEIXE_RIO.png, PEIXE_CICATRIZ.png e produtos de refino continuam usando os mesmos nomes. Este pack não gerou nem substituiu imagens.

## Pack 55 — guarda-roupa e aura do Pet

A arte mensal e o addon do Boss já foram conectados, sem precisar recortá-los novamente. Faltam estes dois arquivos:

### SKIN_MANTO_NEBULOSA.png — personagem humano completo

Pasta exata: `C:\Users\dreey\OneDrive\Área de Trabalho\MYTHREON ONLINE\public\assets\players\skins\`.

> Crie uma sprite de personagem humano completo para o RPG Mythreon Online, skin Manto da Nebulosa. Pixel art profissional com volume de pixel art 3D, contorno escuro limpo, pixels nítidos, sem antialiasing, iluminação superior esquerda. Aventureiro com capuz discreto, manto azul-noite e violeta com pequenos pontos estelares, fecho de cristal turquesa no peito e bordas douradas finas; botas e luvas de viagem, roupas sob o manto, sem arma cobrindo o corpo. Corpo inteiro, pose neutra de combate, vista frontal em três quartos sutilmente voltada à direita, pés alinhados próximos da base, proporção semelhante ao humano atual do jogo. Personagem amigável do jogador, não monstro. Silhueta legível em escala pequena. Composição quadrada 512×512, personagem central ocupando 75% da altura, margem vazia ao redor. Fundo branco puro uniforme para recorte posterior. Sem texto, letras, números, UI, chão, pedestal ou cenário. O resultado deve conter o personagem vestido inteiro, não apenas uma capa solta.

Destino final: PNG com transparência real. Enquanto faltar, o jogo mostra o humano de base com brilho da Nebulosa. GIF/GIFF são reconhecidos; a pasta players tenta PNG primeiro. Recarregue a página após adicionar o arquivo.

### LUMINESCENCIA_PET.png — ícone de aura, não sprite de animal

Pasta exata: `C:\Users\dreey\OneDrive\Área de Trabalho\MYTHREON ONLINE\public\assets\items\`.

> Ícone individual de item para o RPG Mythreon Online: Aura da Besta Divina. Pixel art profissional com volume em perspectiva 3/4, silhueta legível em 32×32, exportação PNG quadrada 256×256, pixels nítidos sem antialiasing, contorno escuro e luz superior esquerda. Um pequeno cristal de opala turquesa no formato de pegada de animal, rodeado por um aro dourado fino e três faíscas ciano discretas. Objeto central ocupando 70% do quadro, margem vazia larga, identidade arcana azul-noite/turquesa/dourado, sem animal, pessoa, texto, número, moldura ou cenário. Fundo branco puro para recorte.

A aura do Pet na caça já é desenhada por CSS; este arquivo é seu ícone na bolsa/loja/guarda-roupa. Use transparência real após o recorte. O emoji continua funcionando enquanto a arte faltar.
