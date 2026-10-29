# MYTHREON ONLINE - Documento de Contexto e Transferência de Projeto

## 1. Visão Geral do Projeto
**Mythreon Online** é um MMORPG Idle para navegador (Web) construído com React, TypeScript, Vite e Zustand. 
O jogo está em fase de prototipagem avançada (MVP). O motor lógico está 100% funcional. O usuário deseja agora focar na **evolução visual**, substituindo placeholders (emojis) por sprites reais, melhorando as animações de combate e adicionando assets gráficos.

## 2. Stack Técnica e Arquitetura
- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS (tema escuro, cores customizadas "arcane")
- **Gerenciamento de Estado:** Zustand
- **Persistência:** LocalStorage (funcional)
- **Estrutura de Pastas:**
  - `src/types/`: Interfaces do TypeScript.
  - `src/data/`: Dados estáticos (Zonas, Monstros, Itens, Componentes de Raça, Backpacks).
  - `src/engine/`: Lógica pura do jogo (Combate, Cálculo de Dano, Inventário, Drops, Save).
  - `src/store/`: Zustand store (`gameStore.ts`) centraliza o estado e as ações.
  - `src/ui/`: Componentes React (Arena de Combate, Matriz de Síntese, Inventário, Equipamento).
  - `src/utils/`: Funções auxiliares (Gerador de ID, Utilitários Visuais).

## 3. Sistemas do Jogo (O que já existe)

### 3.1 Loop de Combate (Idle)
- O combate roda a cada 3 segundos (`setInterval`).
- **Modo Debug Ativo:** Atualmente, o arquivo `src/engine/combat.ts` tem uma flag `const DEBUG_MODE = true`. Nesse modo, o jogador dá 9999 de dano, ganha 10x XP, e tem 100% de chance de drop. (Precisa ser desativado no futuro).
- O jogador foca em um alvo específico (selecionado via interface). O monstro toma dano, morre, dropa itens e o mesmo monstro "renasce" para manter o foco.

### 3.2 Síntese de Raças (Matriz)
- O jogador coleta 3 tipos de componentes: Ataque (A), Suporte (S) e Passiva (P).
- Ele combina esses 3 na aba "Matriz" para criar uma Raça (classe).
- Existem 33 raças nomeadas (hardcoded em `src/data/races.ts`) e raças híbridas procedurais.
- Equipar a raça altera os stats do jogador e define o elemento da magia de ataque.

### 3.3 Equipamento e Atributos
- 13 slots de equipamento (Capacete, Armadura, Luvas, Calças, Botas, Colar, 2 Anéis, Arma Principal, Off-hand, Munição, Backpack).
- O inventário tem limite de slots (50 no Normal Backpack).
- O sistema de stats lê as armas equipadas para definir o visual do jogador.

## 4. Estado Atual Visual e Animações (FOCO DA PRÓXIMA IA)
Atualmente, **NÃO HÁ IMAGENS/SPRITES**. Todo o visual é feito usando emojis do sistema e animações CSS.

### 4.1 A Arena de Combate (`src/ui/Zone.tsx`)
- A tela é dividida em dois lados:
  - **Esquerda (Jogador):** O personagem muda dependendo da arma equipada.
    - Guerreiro (Espada/Machado): 🤺
    - Arqueiro (Arco): 🧝‍♂️
    - Mago (Cajado/Varinha): 🧙‍♂️
  - **Direita (Monstro):** Usa um emoji ou uma imagem se o campo `sprite` estiver preenchido no `zones.ts`.
- **Animação de Ataque:** O jogador executa uma classe CSS (`animate-swing` para espada, `animate-shoot` para arco, `animate-cast` para magia).
- **Projétil:** Um emoji de magia (ex: 🔥, 🪨) voa do jogador até o monstro usando a keyframe `projectileFly`.
- **Recebendo Dano:** Quando a magia chega, o monstro treme (`animate-shake`) e um número de dano voa para cima (`damage-number`).

### 4.2 A Casa (`src/ui/Zone.tsx`)
- Quando o jogador não está caçando, ele vê uma tela de "Cabana" com um emoji grande de cama (🛏️) e botões para escolher qual zona caçar.

## 5. O que a Próxima IA Precisa Fazer (Instruções Diretas)

Prezado assistente, você está assumindo este projeto. O usuário deseja melhorar drasticamente o visual. Siga estas diretrizes:

1. **Substituir Emojis por Sprites/Imagens:**
   - O código já está preparado para usar imagens: `<img src={...} className="w-32 h-32 object-contain" style={{ imageRendering: "pixelated" }} />`.
   - Você deve orientar o usuário (ou gerar código para) trocar os emojis do jogador (🤺, 🧝‍♂️, 🧙‍♂️) e dos monstros por componentes `<img>` reais.
   - Recomende pacotes de sprites gratuitos (itch.io, OpenGameArt) no estilo Pixel Art.

2. **Animações de Sprite Sheet (Frames):**
   - Atualmente, a animação é apenas um CSS `transform` no emoji inteiro (ex: rodar 45 graus para simular corte).
   - Você precisa criar a lógica para rodar **Sprite Sheets** (imagens com vários quadros). Ex: uma imagem de 3 quadros do guerreiro cortando a espada.

3. **Melhorar a Cena de Combate:**
   - Adicionar cenários de fundo diferentes para cada zona (Bosque de Lyss, Pico de Dhor, etc.).
   - Criar animações de partículas ou efeitos visuais (VFX) para a magia bater no monstro, em vez de apenas o emoji voando.

4. **UI/UX:**
   - Os cards da Matriz e do Inventário já estão bonitos com Tailwind, mas podem ganhar ícones de verdade (SVG) em vez de emojis.

## 6. Código Crucial para Análise da Próxima IA

### `src/utils/combatVisuals.ts` (Define as animações atuais)
```typescript
export function getSpellEffect(ataqueId: string) {
  switch(ataqueId) {
    case "A1": return "🦷"; case "A2": return "🐝"; case "A3": return "🔥";
    case "A4": return "🐾"; case "A5": return "🐍"; case "A6": return "🗡️";
    case "A7": return "🌿"; case "A8": return "🦴"; case "A9": return "🪨";
    case "A10": return "🪶"; default: return "✨";
  }
}

export function getWeaponAnimation(weaponId?: string) {
  if (!weaponId) return "animate-swing";
  if (weaponId.includes("ARCO")) return "animate-shoot";
  if (weaponId.includes("CAJADO") || weaponId.includes("VARINHA")) return "animate-cast";
  return "animate-swing";
}