# Pack 18 — PvP ranqueado online

Data: 04/11/2026  
Escopo: fundação segura de duelos entre jogadores online, sem poções e sem tocar no inventário.

## Entregue

- Migração `supabase/migrations/008_pvp_ranked.sql` com convites, estado do duelo, vencedor, ratings antes/depois e RLS por participante.
- Rating inicial 1000, vitórias/derrotas e migração automática de personagens antigos.
- Operações `pvp.read`, `pvp.challenge`, `pvp.accept` e `pvp.resolve` em `server/world.ts`.
- Lista de jogadores online, convite, aceite e resolução numa nova seção `PvP Ranqueado Online` dentro da aba Duelo.
- Cálculo autoritativo no servidor usando nível, atributos, equipamentos, treino e rating; o cliente não escolhe o vencedor.
- Elo limitado por duelo (mínimo de 8, base de 24), sem gold, loot ou poções nesta primeira fatia.
- Teste automatizado de lobby, desafio, aceite e resolução em `scripts/online-check.ts`.

## Proteções

- Somente jogadores online e de contas diferentes podem ser desafiados.
- Convite expira em 10 minutos.
- Um personagem não pode participar de dois duelos ativos ao mesmo tempo.
- As operações passam pelo mesmo `requestId` idempotente do mundo online.
- A tabela não é exposta para leitura de terceiros; RLS restringe as linhas aos dois donos do duelo.

## Próxima fatia do PvP

1. Transformar a resolução em turnos de combate com reconexão e espectador.
2. Adicionar temporadas, ligas, recompensas cosméticas e histórico público.
3. Criar matchmaking por faixa de rating, em vez de apenas desafio direto.
4. Validar com duas contas reais e quedas de rede.
