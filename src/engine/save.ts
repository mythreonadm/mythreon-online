// Em createNewCharacter, adicione no objeto de retorno:
    activeVials: {},
    cards: [],
    depot: [],        // NOVO
    depotMax: 300,    // NOVO
  };
}

// Em loadGame, dentro do bloco "if (data.character) {", adicione:
      if (!data.character.depot) data.character.depot = [];
      if (data.character.depotMax === undefined) data.character.depotMax = 300;