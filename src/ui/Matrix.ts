// (Mantenha os imports iguais, apenas garanta que o RaceModal está importado)
import { RaceModal } from "./RaceModal";

export function MatrixView() {
  // ... (mesma lógica inicial)

  return (
    <div className="space-y-6">
      {selectedRace && (
        <RaceModal 
          race={selectedRace} 
          equippedRace={character.activeRace} // <-- PASSANDO A RAÇA EQUIPADA AQUI
          isEquipped={character.raceId === selectedRace.id}
          onEquip={() => { equipRace(selectedRace); setSelectedRace(null); }}
          onClose={() => setSelectedRace(null)}
        />
      )}
      
      {/* ... (O resto do arquivo continua igual) */}
    </div>
  );
}