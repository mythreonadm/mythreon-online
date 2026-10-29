# MYTHREON ONLINE - Documento de Arquitetura e Estado Atual

**Versão:** 1.2
**Stack:** React + TypeScript + Vite + Zustand + Tailwind CSS
**Status:** MVP Jogável, Loop de Combate Idle, Sistema de Inventário e Matriz de Raças.

---

## 1. Estrutura de Diretórios

```text
MYTHREON ONLINE/
├── public/
│   └── assets/
│       ├── players/       # Sprites/GIFs do jogador (arqueiro.gif, guerreiro.gif, mago.gif)
│       ├── monsters/      # Sprites dos monstros (lobo.png, golem.png)
│       ├── backgrounds/   # Fundos dos mapas (forest.png, mountain.png)
│       ├── vfx/           # Efeitos visuais de magias (fogo.png, gelo.png)
│       └── ui/            # Ícones de interface e itens
├── src/
│   ├── data/              # Dados estáticos (Zonas, Itens, Raças, Componentes)
│   ├── engine/            # Lógica pura (Combate, Stats, Inventário, Drops, Save)
│   ├── store/             # Estado global (Zustand)
│   ├── types/             # Interfaces e Tipos do TypeScript
│   ├── ui/                # Componentes React (Telas e Painéis)
│   ├── utils/             # Funções auxiliares (Gerador de ID, Visual de Combate)
│   ├── App.tsx            # Componente Raiz e Navegação de Abas
│   ├── index.css          # Tailwind, Estilos Base e Animações
│   └── main.tsx           # Entry point do React
├── index.html
├── tailwind.config.js
├── postcss.config.js
└── package.json