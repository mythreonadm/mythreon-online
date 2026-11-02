# Shop, premium e Divine Beasts

Estado: parcial; implementação local em 2026-11-02.

## Implementado
- Shop separada do Ferreiro. Vials comprados por gold; uma potência por família. Nova compra substitui a duração restante e remove outras potências da família. Saves antigos com mais de uma potência aplicam só a maior ativa.
- Disciplina diária: 250 gold, +50% XP de treino (15 → 22,5 por tick), 30 minutos corridos, uma compra/dia UTC, para free e premium. Não avança treino automaticamente nem recupera tempo offline.
- Premium: +10 pontos percentuais de bônus de XP de caça, somados aos demais bônus; vale também no combate offline. O booleano premium existente é lido, mas não existe compra/ativação paga nesta versão.
- Market, correio e cosméticos premium por quests: planejados, sem implementação online. Não anunciar como benefícios disponíveis e não cobrar por eles antes de backend, autenticação, autorização e pagamentos.
- Cada uma das 12 Beasts tem ataque elemental a cada 3 ticks, custo 8 + floor(nível/2) MP. Dano bruto = média de ATK e MATK × 2,4; desconta metade da armadura inimiga e aplica afinidade/resistência.
- Crescimento Beast: HP 60+6L; MP 30+3L; ATK/MATK 6+L; armadura 3+floor(0,6L); regen HP 1+floor(L/15), MP 2+floor(L/15). Soma especialidade original da Beast. Matriz e Beast continuam exclusivas.
- Beast aparece ao lado do humano na hunt; usa o PNG/GIF existente de public/assets/pets. Artes não foram reprocessadas nem receberam fundo branco. Para refazer, preserve os mesmos nomes dessa pasta; transparência é preferível na composição do mapa.
- Ícones ampliados em mochila, depósito, personagem e Ferreiro/Shop.

## Achados e pendências de balanceamento
A Beast anterior removia três habilidades da Matriz e entregava bônus fixos pequenos. Agora possui ataque e crescimento, mas equivalência entre todas as builds ainda não foi comprovada.
Matrizes nomeadas têm combinações muito diferentes de ataque, suporte e passiva; vials de ATK/armadura fixos favorecem especialmente níveis baixos. Não foi feita alteração indiscriminada de todas essas fórmulas.
Falta uma bateria reproduzível de simulação por níveis 15/25/45/70/100 com equipamento, distribuição e poções iguais: comparar DPS, dano recebido, sustentabilidade de MP, mortes, XP/h e gold líquido. Medir todos os ataques/suportes/passivas, pets, afixos e raridades. Meta inicial proposta: caminhos comparáveis dentro de 10–15% no agregado, preservando especialidades; é uma meta de projeto, não resultado validado.
Antes de venda real: persistência autoritativa, contas e premium no servidor, pagamentos e validação dos limites diários pelo servidor. O save local pode ser alterado pelo usuário.

## Validação
Build de produção passou após integrar a Shop e os ataques. Uma tentativa de testes automatizados via esbuild foi bloqueada por acesso a diretório durante resolução de módulos; não foi um teste aprovado. Validar gameplay visual e longo prazo ainda é necessário.

## Fontes
- src/ui/CommerceBenefits.tsx, src/ui/Shop.tsx, src/App.tsx
- src/data/beastCombat.ts, src/engine/combat.ts, src/engine/stats.ts
- src/store/gameStore.ts, src/ui/Zone.tsx, src/ui/DivineBeasts.tsx
- CEREBRO_MYTHREON.md
