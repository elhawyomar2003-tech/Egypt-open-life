import React from 'react';
import { useGameStore } from '../../store';
import { Zap, DollarSign, Star, Gift } from 'lucide-react';

export const TestMode = () => {
  const { addMoney, addXP, addLuckyBox, setMission } = useGameStore();

  return (
    <div className="fixed top-4 right-4 z-[1000] bg-black/80 p-4 rounded-xl border border-white/20 text-white flex flex-col gap-2">
      <h2 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Test Mode</h2>
      <button onClick={() => addMoney(1000)} className="flex items-center gap-2 text-xs hover:text-emerald-400"><DollarSign size={14} /> +$1000</button>
      <button onClick={() => addXP(500)} className="flex items-center gap-2 text-xs hover:text-indigo-400"><Star size={14} /> +500 XP</button>
      <button onClick={addLuckyBox} className="flex items-center gap-2 text-xs hover:text-amber-400"><Gift size={14} /> +Lucky Box</button>
      <button onClick={() => setMission({ id: 'test', title: 'Test Mission', reward: 100, district: 'Old Neighborhood', type: 'side', objective: 'Test objective' })} className="flex items-center gap-2 text-xs hover:text-red-400"><Zap size={14} /> Trigger Mission</button>
    </div>
  );
};
