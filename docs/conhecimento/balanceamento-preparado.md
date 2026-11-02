# Auditoria balanceamento-preparado

Amostra determinística: 12 encontros por cenário. Matriz/Beast alternam 12 modelos; não é uma avaliação exaustiva de builds. Equipamento raro, poções pagas, orçamento inicial 100000 gold. Sem vials. Limite de 120 ticks por encontro.

- PASS: Armadura tem redução crescente limitada a 70%
- PASS: Recalcular não ressuscita nem recarrega mana zero
- PASS: XP necessário monotônico nos níveis 1–150
- PASS: Premium adiciona exatamente 10 pontos percentuais de bônus de XP
- PASS: As 12 Beasts usam seu ataque elemental e consomem MP

| Zona | Mob | Caminho | Nível | Vitórias % | Segundos médios | Dano recebido | Gold bruto | Poções | Gold líquido | XP |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Bosque de Lyss | Lobo-Feral | Humano | 1 | 100 | 4 | 0 | 9 | 0 | 9 | 15 |
| Bosque de Lyss | Lobo-Feral | Matriz | 1 | 100 | 3 | 0 | 8 | 0 | 8 | 15 |
| Bosque de Lyss | Lobo-Feral | Beast | 1 | 100 | 3 | 0 | 9 | 0 | 9 | 15 |
| Bosque de Lyss | Vespa-Cinza | Humano | 1 | 100 | 3 | 1 | 12 | 0 | 12 | 22 |
| Bosque de Lyss | Vespa-Cinza | Matriz | 1 | 100 | 3 | 0 | 13 | 0 | 13 | 22 |
| Bosque de Lyss | Vespa-Cinza | Beast | 1 | 100 | 3 | 0 | 13 | 0 | 13 | 22 |
| Bosque de Lyss | Espinheiro-Vivo | Humano | 3 | 100 | 4 | 1 | 16 | 0 | 16 | 25 |
| Bosque de Lyss | Espinheiro-Vivo | Matriz | 3 | 100 | 3 | 0 | 14 | 0 | 14 | 25 |
| Bosque de Lyss | Espinheiro-Vivo | Beast | 3 | 100 | 3 | 0 | 16 | 0 | 16 | 25 |
| Bosque de Lyss | Falcão-Ruivo | Humano | 5 | 100 | 3 | 0 | 21 | 0 | 21 | 35 |
| Bosque de Lyss | Falcão-Ruivo | Matriz | 5 | 100 | 3 | 0 | 20 | 0 | 20 | 35 |
| Bosque de Lyss | Falcão-Ruivo | Beast | 5 | 100 | 3 | 0 | 20 | 0 | 20 | 35 |
| Bosque de Lyss | Javali-Musgoso | Humano | 7 | 100 | 7 | 8 | 24 | 0 | 24 | 41 |
| Bosque de Lyss | Javali-Musgoso | Matriz | 7 | 100 | 5 | 3 | 23 | 0 | 23 | 42 |
| Bosque de Lyss | Javali-Musgoso | Beast | 7 | 100 | 6 | 7 | 23 | 0 | 23 | 41 |
| Bosque de Lyss | Fada Corrompida | Humano | 4 | 100 | 3 | 0 | 23 | 0 | 23 | 42 |
| Bosque de Lyss | Fada Corrompida | Matriz | 4 | 100 | 3 | 0 | 24 | 0 | 24 | 43 |
| Bosque de Lyss | Fada Corrompida | Beast | 4 | 100 | 3 | 1 | 23 | 0 | 23 | 42 |
| Bosque de Lyss | Aranha Gigante | Humano | 6 | 100 | 6 | 6 | 28 | 0 | 28 | 48 |
| Bosque de Lyss | Aranha Gigante | Matriz | 6 | 100 | 6 | 3 | 27 | 0 | 27 | 49 |
| Bosque de Lyss | Aranha Gigante | Beast | 6 | 100 | 4 | 2 | 27 | 0 | 27 | 48 |
| Bosque de Lyss | Espectro de Brasa | Humano | 15 | 100 | 25 | 242 | 131 | 0 | 131 | 128 |
| Bosque de Lyss | Espectro de Brasa | Matriz | 15 | 100 | 13 | 85 | 133 | 0 | 133 | 130 |
| Bosque de Lyss | Espectro de Brasa | Beast | 15 | 100 | 15 | 116 | 128 | 0 | 128 | 128 |
| Pico de Dhor | Golem-Rocha | Humano | 11 | 100 | 14 | 56 | 44 | 0 | 44 | 70 |
| Pico de Dhor | Golem-Rocha | Matriz | 11 | 100 | 9 | 32 | 44 | 0 | 44 | 71 |
| Pico de Dhor | Golem-Rocha | Beast | 11 | 100 | 9 | 29 | 40 | 0 | 40 | 70 |
| Pico de Dhor | Urso-Fenda | Humano | 13 | 100 | 7 | 13 | 51 | 0 | 51 | 72 |
| Pico de Dhor | Urso-Fenda | Matriz | 13 | 100 | 6 | 10 | 44 | 0 | 44 | 73 |
| Pico de Dhor | Urso-Fenda | Beast | 13 | 100 | 6 | 12 | 47 | 0 | 47 | 72 |
| Pico de Dhor | Bandido do Desfiladeiro | Humano | 16 | 100 | 9 | 51 | 84 | 0 | 84 | 98 |
| Pico de Dhor | Bandido do Desfiladeiro | Matriz | 16 | 100 | 8 | 38 | 85 | 0 | 85 | 99 |
| Pico de Dhor | Bandido do Desfiladeiro | Beast | 16 | 100 | 7 | 27 | 77 | 0 | 77 | 98 |
| Pico de Dhor | Elemental de Gelo | Humano | 19 | 100 | 13 | 109 | 79 | 0 | 79 | 136 |
| Pico de Dhor | Elemental de Gelo | Matriz | 19 | 100 | 9 | 57 | 75 | 0 | 75 | 138 |
| Pico de Dhor | Elemental de Gelo | Beast | 19 | 100 | 9 | 59 | 78 | 0 | 78 | 136 |
| Pico de Dhor | Yeti-do-Cume | Humano | 22 | 100 | 16 | 184 | 101 | 0 | 101 | 160 |
| Pico de Dhor | Yeti-do-Cume | Matriz | 22 | 100 | 9 | 72 | 101 | 0 | 101 | 162 |
| Pico de Dhor | Yeti-do-Cume | Beast | 22 | 100 | 9 | 73 | 105 | 0 | 105 | 160 |
| Pico de Dhor | Morcego de Magma | Humano | 15 | 100 | 7 | 37 | 58 | 0 | 58 | 105 |
| Pico de Dhor | Morcego de Magma | Matriz | 15 | 100 | 7 | 44 | 65 | 0 | 65 | 106 |
| Pico de Dhor | Morcego de Magma | Beast | 15 | 100 | 6 | 23 | 62 | 0 | 62 | 105 |
| Pico de Dhor | Centurião de Bronze | Humano | 20 | 100 | 22 | 156 | 106 | 0 | 106 | 144 |
| Pico de Dhor | Centurião de Bronze | Matriz | 20 | 100 | 10 | 63 | 105 | 0 | 105 | 146 |
| Pico de Dhor | Centurião de Bronze | Beast | 20 | 100 | 11 | 63 | 110 | 0 | 110 | 144 |
| Pico de Dhor | Colosso de Dhor | Humano | 24 | 100 | 55 | 1475 | 682 | 321 | 362 | 540 |
| Pico de Dhor | Colosso de Dhor | Matriz | 24 | 100 | 27 | 598 | 718 | 28 | 691 | 547 |
| Pico de Dhor | Colosso de Dhor | Beast | 24 | 100 | 28 | 659 | 729 | 37 | 692 | 540 |
| Mar de Azhar | Caranguejo-Colosso | Humano | 26 | 100 | 16 | 142 | 118 | 0 | 118 | 210 |
| Mar de Azhar | Caranguejo-Colosso | Matriz | 26 | 100 | 9 | 66 | 109 | 0 | 109 | 213 |
| Mar de Azhar | Caranguejo-Colosso | Beast | 26 | 100 | 9 | 53 | 118 | 0 | 118 | 210 |
| Mar de Azhar | Serpente-Névoa | Humano | 28 | 100 | 20 | 359 | 153 | 0 | 153 | 272 |
| Mar de Azhar | Serpente-Névoa | Matriz | 28 | 100 | 12 | 155 | 157 | 0 | 157 | 275 |
| Mar de Azhar | Serpente-Névoa | Beast | 28 | 100 | 11 | 160 | 147 | 0 | 147 | 272 |
| Mar de Azhar | Medusa-Trovão | Humano | 32 | 100 | 13 | 165 | 157 | 0 | 157 | 266 |
| Mar de Azhar | Medusa-Trovão | Matriz | 32 | 100 | 10 | 107 | 151 | 0 | 151 | 269 |
| Mar de Azhar | Medusa-Trovão | Beast | 32 | 100 | 9 | 97 | 144 | 0 | 144 | 266 |
| Mar de Azhar | Sereia-Cantora | Humano | 35 | 100 | 22 | 441 | 181 | 0 | 181 | 336 |
| Mar de Azhar | Sereia-Cantora | Matriz | 35 | 100 | 13 | 198 | 183 | 0 | 183 | 340 |
| Mar de Azhar | Sereia-Cantora | Beast | 35 | 100 | 12 | 203 | 194 | 0 | 194 | 336 |
| Mar de Azhar | Polvo-Abissal | Humano | 38 | 100 | 26 | 628 | 203 | 0 | 203 | 384 |
| Mar de Azhar | Polvo-Abissal | Matriz | 38 | 100 | 15 | 318 | 211 | 0 | 211 | 389 |
| Mar de Azhar | Polvo-Abissal | Beast | 38 | 100 | 16 | 325 | 214 | 0 | 214 | 384 |
| Mar de Azhar | Tritão Guerreiro | Humano | 40 | 100 | 22 | 513 | 219 | 0 | 219 | 400 |
| Mar de Azhar | Tritão Guerreiro | Matriz | 40 | 100 | 14 | 290 | 227 | 0 | 227 | 405 |
| Mar de Azhar | Tritão Guerreiro | Beast | 40 | 100 | 15 | 317 | 238 | 0 | 238 | 400 |
| Mar de Azhar | Enguia Elétrica | Humano | 42 | 100 | 15 | 367 | 266 | 0 | 266 | 448 |
| Mar de Azhar | Enguia Elétrica | Matriz | 42 | 100 | 10 | 226 | 254 | 0 | 254 | 454 |
| Mar de Azhar | Enguia Elétrica | Beast | 42 | 100 | 11 | 240 | 273 | 0 | 273 | 448 |
| Mar de Azhar | Leviatã de Azhar | Humano | 43 | 100 | 93 | 6062 | 3554 | 2000 | 1554 | 2160 |
| Mar de Azhar | Leviatã de Azhar | Matriz | 43 | 100 | 48 | 2896 | 3711 | 587 | 3124 | 2187 |
| Mar de Azhar | Leviatã de Azhar | Beast | 43 | 100 | 49 | 3213 | 3378 | 880 | 2498 | 2160 |
| Ruínas de Asterion | Hiena-Abissal | Humano | 46 | 100 | 23 | 678 | 331 | 0 | 331 | 560 |
| Ruínas de Asterion | Hiena-Abissal | Matriz | 46 | 100 | 16 | 428 | 314 | 0 | 314 | 567 |
| Ruínas de Asterion | Hiena-Abissal | Beast | 46 | 100 | 15 | 403 | 314 | 0 | 314 | 560 |
| Ruínas de Asterion | Sentinela de Pedra | Humano | 50 | 100 | 31 | 795 | 363 | 0 | 363 | 640 |
| Ruínas de Asterion | Sentinela de Pedra | Matriz | 50 | 100 | 18 | 439 | 343 | 0 | 343 | 648 |
| Ruínas de Asterion | Sentinela de Pedra | Beast | 50 | 100 | 18 | 448 | 377 | 0 | 377 | 640 |
| Ruínas de Asterion | Escorpião-Rúnico | Humano | 55 | 100 | 18 | 567 | 431 | 0 | 431 | 720 |
| Ruínas de Asterion | Escorpião-Rúnico | Matriz | 55 | 100 | 14 | 379 | 420 | 0 | 420 | 729 |
| Ruínas de Asterion | Escorpião-Rúnico | Beast | 55 | 100 | 15 | 468 | 422 | 0 | 422 | 720 |
| Ruínas de Asterion | Cultista do Eclipse | Humano | 60 | 100 | 22 | 1367 | 534 | 0 | 534 | 900 |
| Ruínas de Asterion | Cultista do Eclipse | Matriz | 60 | 100 | 17 | 926 | 511 | 0 | 511 | 911 |
| Ruínas de Asterion | Cultista do Eclipse | Beast | 60 | 100 | 17 | 937 | 545 | 0 | 545 | 900 |
| Ruínas de Asterion | Múmia Ancestral | Humano | 52 | 100 | 26 | 962 | 531 | 0 | 531 | 880 |
| Ruínas de Asterion | Múmia Ancestral | Matriz | 52 | 100 | 17 | 525 | 530 | 0 | 530 | 891 |
| Ruínas de Asterion | Múmia Ancestral | Beast | 52 | 100 | 17 | 557 | 565 | 0 | 565 | 880 |
| Ruínas de Asterion | Gárgula de Pedra | Humano | 58 | 100 | 42 | 2643 | 672 | 750 | -78 | 1080 |
| Ruínas de Asterion | Gárgula de Pedra | Matriz | 58 | 100 | 26 | 1277 | 706 | 0 | 706 | 1094 |
| Ruínas de Asterion | Gárgula de Pedra | Beast | 58 | 100 | 24 | 1403 | 611 | 0 | 611 | 1080 |
| Ruínas de Asterion | Guardião de Asterion | Humano | 66 | 100 | 86 | 9814 | 7387 | 3750 | 3637 | 5400 |
| Ruínas de Asterion | Guardião de Asterion | Matriz | 66 | 100 | 46 | 4582 | 7382 | 1200 | 6182 | 5467 |
| Ruínas de Asterion | Guardião de Asterion | Beast | 66 | 100 | 44 | 4509 | 6838 | 1275 | 5563 | 5400 |
| Cicatriz Profunda | Cria do Vazio | Humano | 71 | 100 | 26 | 1323 | 782 | 0 | 782 | 1280 |
| Cicatriz Profunda | Cria do Vazio | Matriz | 71 | 100 | 17 | 822 | 783 | 0 | 783 | 1296 |
| Cicatriz Profunda | Cria do Vazio | Beast | 71 | 100 | 17 | 809 | 799 | 0 | 799 | 1280 |
| Cicatriz Profunda | Verme-Abissal | Humano | 75 | 100 | 36 | 2932 | 999 | 433 | 566 | 1620 |
| Cicatriz Profunda | Verme-Abissal | Matriz | 75 | 100 | 23 | 1716 | 979 | 0 | 979 | 1640 |
| Cicatriz Profunda | Verme-Abissal | Beast | 75 | 100 | 23 | 1646 | 993 | 0 | 993 | 1620 |
| Cicatriz Profunda | Aberração Tentacular | Humano | 82 | 100 | 41 | 3779 | 1045 | 1733 | -688 | 1800 |
| Cicatriz Profunda | Aberração Tentacular | Matriz | 82 | 100 | 26 | 2329 | 1087 | 0 | 1087 | 1823 |
| Cicatriz Profunda | Aberração Tentacular | Beast | 82 | 100 | 25 | 2429 | 1090 | 0 | 1090 | 1800 |
| Cicatriz Profunda | Sombra Faminta | Humano | 88 | 100 | 32 | 3595 | 1145 | 1300 | -155 | 1980 |
| Cicatriz Profunda | Sombra Faminta | Matriz | 88 | 100 | 21 | 1914 | 1176 | 0 | 1176 | 2005 |
| Cicatriz Profunda | Sombra Faminta | Beast | 88 | 100 | 21 | 2247 | 1190 | 0 | 1190 | 1980 |
| Cicatriz Profunda | Ceifador de Almas | Humano | 80 | 100 | 46 | 6236 | 1361 | 2600 | -1239 | 2700 |
| Cicatriz Profunda | Ceifador de Almas | Matriz | 80 | 100 | 31 | 3310 | 1369 | 867 | 502 | 2734 |
| Cicatriz Profunda | Ceifador de Almas | Beast | 80 | 100 | 31 | 4156 | 1364 | 1517 | -153 | 2700 |
| Cicatriz Profunda | Olho do Vazio | Humano | 85 | 100 | 39 | 6013 | 1500 | 2817 | -1317 | 2880 |
| Cicatriz Profunda | Olho do Vazio | Matriz | 85 | 100 | 22 | 2805 | 1473 | 217 | 1256 | 2916 |
| Cicatriz Profunda | Olho do Vazio | Beast | 85 | 100 | 22 | 3122 | 1413 | 433 | 980 | 2880 |
| Cicatriz Profunda | Devorador da Cicatriz | Humano | 95 | 100 | 84 | 11249 | 15040 | 6283 | 8756 | 14400 |
| Cicatriz Profunda | Devorador da Cicatriz | Matriz | 95 | 100 | 51 | 5998 | 13260 | 1733 | 11526 | 14580 |
| Cicatriz Profunda | Devorador da Cicatriz | Beast | 95 | 100 | 50 | 6394 | 14983 | 2817 | 12166 | 14400 |