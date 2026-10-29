import React, { useState } from "react";

interface Props {
  title: string;
  maxQty: number;
  onConfirm: (qty: number) => void;
  onCancel: () => void;
}

export function QuantityModal({ title, maxQty, onConfirm, onCancel }: Props) {
  const [qty, setQty] = useState<number>(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value) || 1;
    if (val < 1) val = 1;
    if (val > maxQty) val = maxQty;
    setQty(val);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in" onClick={onCancel}>
      <div className="bg-arcane-panel border-2 border-arcane-gold rounded-xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-white mb-4 text-center">{title}</h3>
        
        <div className="flex items-center gap-2 mb-6">
          <input 
            type="number" 
            value={qty} 
            onChange={handleChange}
            min={1} 
            max={maxQty}
            className="flex-1 bg-arcane-bg border border-arcane-border rounded-lg px-4 py-2 text-white text-lg font-bold text-center focus:outline-none focus:border-arcane-gold"
          />
          <button 
            onClick={() => setQty(maxQty)}
            className="bg-arcane-cyan hover:bg-cyan-400 text-black font-bold px-4 py-2 rounded-lg transition-colors"
          >
            MAX
          </button>
        </div>
        
        <div className="text-center text-xs text-gray-400 mb-6">Máximo disponível: {maxQty}</div>

        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition-colors">Cancelar</button>
          <button onClick={() => onConfirm(qty)} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg transition-colors">Confirmar</button>
        </div>
      </div>
    </div>
  );
}