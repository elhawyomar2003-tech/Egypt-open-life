import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, DollarSign, Star, Zap } from 'lucide-react';
import { useGameStore } from '../../store';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Leaderboard({ isOpen, onClose }: LeaderboardProps) {
  const { money, reputation, level } = useGameStore();

  const categories = [
    { id: 'richest', name: 'Richest Players', icon: <DollarSign size={16} className="text-emerald-400" />, color: 'emerald' },
    { id: 'reputation', name: 'Most Respected', icon: <Star size={16} className="text-amber-400" />, color: 'amber' },
    { id: 'level', name: 'Highest Level', icon: <Trophy size={16} className="text-indigo-400" />, color: 'indigo' },
  ];

  const [activeCategory, setActiveCategory] = React.useState('richest');

  const mockData = [
    { name: 'Legend_Ahmed', value: 150000, rank: 1 },
    { name: 'Sultan_Omar', value: 120000, rank: 2 },
    { name: 'Queen_Sara', value: 95000, rank: 3 },
    { name: 'You', value: activeCategory === 'richest' ? money : activeCategory === 'reputation' ? reputation : level * 1000, rank: 4 },
    { name: 'Zaid_The_Fast', value: 45000, rank: 5 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-indigo-500/10 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <Trophy size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Global Hall of Fame</h2>
                  <p className="text-white/40 text-sm font-medium">See how you rank against the neighborhood legends</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category Switcher */}
            <div className="p-4 bg-white/5 flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all ${
                    activeCategory === cat.id 
                      ? `bg-${cat.color}-500/10 border-${cat.color}-500/40 text-${cat.color}-400` 
                      : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {cat.icon}
                  <span className="text-[10px] uppercase font-black tracking-widest">{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-8 space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
              {mockData.map((player) => (
                <motion.div 
                  key={player.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    player.name === 'You' 
                      ? 'bg-indigo-500/10 border-indigo-500/40' 
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                      player.rank === 1 ? 'bg-amber-500 text-black' : 
                      player.rank === 2 ? 'bg-slate-300 text-black' : 
                      player.rank === 3 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white/40'
                    }`}>
                      {player.rank}
                    </div>
                    <span className={`font-bold ${player.name === 'You' ? 'text-indigo-400' : 'text-white'}`}>{player.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono font-black">{player.value.toLocaleString()}</span>
                    {activeCategory === 'richest' && <DollarSign size={14} className="text-emerald-400" />}
                    {activeCategory === 'reputation' && <Star size={14} className="text-amber-400" />}
                    {activeCategory === 'level' && <Trophy size={14} className="text-indigo-400" />}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/5 border-t border-white/5 flex justify-center">
              <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest">Weekly rewards for top 3 players!</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
