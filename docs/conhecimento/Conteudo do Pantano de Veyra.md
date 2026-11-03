---
projeto: Mythreon Online
tipo: conteúdo de jogo
status: implementado-parcial
atualizado: 2026-11-03
---

# Conteúdo do Pântano de Veyra

Veyra é a rota onde a água da montanha alimenta memórias vivas. A resina da Ruptura transforma raízes, venenos e silte em criaturas que guardam lembranças de Lyss.

## Progressão dos mobs

| Mob | Componente | Suporte | Material | Equipamentos |
|---|---|---|---|---|
| Sapo-Miasma | A16 Glândula de Miasma | S14 Núcleo de Miasma | RESINA_MIASMA | CAPUZ_MIASMA_T3 |
| Libélula-Lâmina | A17 Asa de Libélula-Lâmina | S15 Núcleo de Lâmina | ASA_LAMINA | LUVAS_LAMINA_T3, ARCO_LIBELULA_T3 |
| Cipó da Memória | A18 Nó de Memória | S16 Núcleo de Memória | NO_MEMORIA | MANTO_MEMORIA_T3, COLAR_RAIZ_MEMORIA_T3 |
| Crocodilo de Silte | A19 Dente de Silte | S17 Núcleo de Silte | DENTE_SILTE | BOTAS_SILTE_T3, ESCUDO_CARAPACA_VEYRA_T3 |
| Matriarca do Lodo | A20 Coroa da Matriarca | S18 Núcleo da Matriarca | COROA_LODO | PULSEIRA_VEYRA_T3, MANTO_MEMORIA_T3 |

As duas passivas regionais são P13 Passiva do Pântano e P14 Passiva da Resina. Elas entram na síntese normalmente e ampliam o espaço combinatório sem criar uma classe obrigatória.

## Artes

As pranchas estão em `imagens/pantano/`. Recortar cada ícone e exportar em PNG transparente para `public/assets/items/`, mantendo exatamente o ID do template. Até o recorte, o jogo usa o emoji definido no template como fallback.

## Pendências

- Recortar e exportar os 18 ícones individuais das pranchas.
- Adicionar esses materiais e equipamentos à Wiki visual com lore e valores de venda.
- Testar taxas de drop em uma sessão de 30 minutos e ajustar sem aumentar simultaneamente pressão, XP e gold.
