# Mythreon Online — checklist até o lançamento

Atualizado em 03/11/2026. Este arquivo é o plano operacional do lançamento e deve ser revisado no Cérebro/Obsidian após cada rodada.

## Estado atual

- [x] Conta online Supabase, personagens vinculados e progresso persistente.
- [x] Login por e-mail e Google OAuth configurado.
- [x] Vercel em produção e runtime online gerado.
- [x] Tutorial guiado com Wiki, poções, Matriz, equipamento, treino, Mochila, Depósito, Ferreiro, Shop e Laboratório.
- [x] Cinco caminhos principais de mapa e rotas laterais de Veyra e Kaelor.
- [x] Matriz com ataque, suporte, passiva, síntese, builds e mais de 3.900 combinações possíveis.
- [x] Divine Beasts, vínculo em combate, lore e imagens principais.
- [x] Hunt idle, stamina online/offline, drops, autoloot, bestiário e registros de combate.
- [x] Treino de skills, penalidade de morte, Bless, proteção de itens e Anel da Guarda Eterna.
- [x] Ferreiro: forjar, aprimorar, vender, desmanchar, fundir fragmentos e regras automáticas.
- [x] Flechas T1–T5 equipáveis; venda/desmanche e seleção em massa.
- [x] Arena, comunidade online, ranking, chat, amigos, correio e troca.
- [x] Feedback de combate: projétil, dano, combo, dois impactos, cooldown e efeitos de impacto.
- [x] Cérebro sincronizado com o vault `Mythreon Obsidian/`.

## Missões restantes até o lançamento

### P0 — fechar a versão pública

1. Criar e adicionar todas as artes pendentes listadas abaixo.
2. Publicar no GitHub e confirmar deploy Vercel sem erros.
3. Testar cadastro, login Google, criação de personagem, logout, login em outro dispositivo e recuperação de senha.
4. Testar uma sessão completa: tutorial → Matriz → hunt → drop → Ferreiro → boss de Lyss.
5. Testar a mesma sessão em dois navegadores e confirmar que não há duplicação de itens, gold ou personagens.
6. Fazer 20 encontros por faixa de nível (1–10, 11–25, 26–45, 46–70, 71–100) e registrar dano, tempo, XP, gold, mortes, poções e loot.
7. Ajustar balanceamento com os dados reais; não alterar regras durante a coleta.
8. Rodar `npm run typecheck`, `npm run build`, `npm run online:check`, `npm run journey:check` e `npm run brain:check`.
9. Fazer uma rodada de teste mobile e corrigir overflow, botões pequenos e tooltips fora da tela.
10. Congelar o conteúdo da versão 1.0 e criar tag de lançamento.

### P1 — polimento de lançamento

11. Revisar todos os textos da Wiki, tutorial e mensagens de erro.
12. Adicionar política de privacidade, termos, contato e aviso de economia virtual.
13. Definir limites anti-abuso: rate limit, tamanho de mensagens, proteção contra spam e auditoria de trocas.
14. Testar rollback de deploy e backup do banco Supabase.
15. Preparar página pública de lançamento com trailer, classes, Divine Beasts, Matriz e botão “Jogar agora”.
16. Empacotar a versão Windows e validar instalação, atualização e persistência local/online.

### P2 — depois do lançamento

17. Criar PvP de Arena com turnos interativos reais.
18. Criar Market Online, premium, efeitos cosméticos e correio avançado.
19. Adicionar novas regiões, monstros, Divine Beasts e capítulos de lore.
20. Adicionar eventos sazonais, conquistas de treino e rankings por temporada.

## Artes que ainda faltam

Salve todas em `C:\Users\dreey\OneDrive\Área de Trabalho\MYTHREON ONLINE\public\assets\` com os nomes exatos.

### Itens — `public/assets/items/`

- `FLECHA_T1.png` a `FLECHA_T5.png`: flechas de madeira, pedra, aço, estelar e eclipse.
- `PULSEIRA_T1.png` a `PULSEIRA_T5.png`: braceletes de broto, seiva, maré, estelar e eclipse sereno.
- `UNICO_SIGILO_INICIACAO.png`: pulseira cerimonial ciano/dourada do tutorial.
- `UNICO_ANEL_GUARDIA.png`: anel dourado com escudo azul e gema verde.
- `UNICO_BRASA_ETERNA.png`: pulseira/joia de brasa vermelha e dourada em aro negro.
- `UNICO_CORACAO_GRANITO.png`: coração de granito com fissura verde luminosa.
- `UNICO_ESCAMA_LEVIATA.png`: escama azul-petróleo com borda prateada.
- `UNICO_OLHO_ASTERION.png`: elmo compacto com gema ocular dourada.
- `UNICO_PRESA_DEVORADOR.png`: presa curva negra com veios vermelhos e violeta.

### Monstros de rotas laterais — `public/assets/monsters/`

- `SAPO_MIASMA.png`, `LIBELULA_LAMINA.png`, `CIPO_MEMORIA.png`, `CROCODILO_SILTE.png`, `MATRIARCA_LODO.png`.
- `ESCARAVELHO_VITREO.png`, `ESPECTRO_SOLAR.png`, `SERPENTE_MIRAGEM.png`, `GOLEM_OBSIDIANA.png`, `SENTINELA_ZENITE.png`.

### Fundos — `public/assets/backgrounds/`

- `swamp.png`: pântano luminoso, raízes, água turva, paleta verde/veneno.
- `desert.png`: deserto de vidro e ruínas solares, paleta dourada/laranja/violeta.
- Opcional: `swamp.gif` e `desert.gif` animados. O jogo tenta o GIF primeiro e usa PNG como fallback.

## Prompt universal para cada imagem

> Pixel art profissional para Mythreon Online, RPG idle de fantasia arcana sombria, composição 3/4, silhueta legível em tamanho pequeno, contorno escuro nítido, paleta curta, iluminação coerente do alto à esquerda, contraste forte, sem texto, sem letras, sem números, sem interface, sem marca d’água, fundo totalmente transparente para sprites e itens, arquivo PNG quadrado 256×256 com pixel art preservada e objeto ocupando aproximadamente 70% do quadro.

Para fundos, troque “fundo totalmente transparente” por “paisagem horizontal 16:9, sem personagens e sem interface, pronta para ser usada como fundo de batalha”.

## Regra de publicação das artes

1. Usar exatamente maiúsculas, sublinhados e extensão indicados.
2. Não substituir arquivos existentes sem manter backup.
3. Depois de copiar as imagens, executar `npm run build`.
4. Conferir Wiki, Mochila, Personagem, Ferreiro e tela de caça.
5. Fazer `git add`, `git commit`, `git push` e aguardar o Vercel marcar o deploy como **Ready**.
