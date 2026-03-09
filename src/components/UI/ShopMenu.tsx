import React from 'react';
import { useGameStore } from '../../store';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, TrendingUp, CheckCircle2, Lock } from 'lucide-react';

interface ShopMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShopMenu({ isOpen, onClose }: ShopMenuProps) {
  const { money, buyBusiness, upgradeBusiness, ownedBusinesses } = useGameStore();

  const businesses = [
    { id: 'coffee_shop', name: 'Al-Baraka Coffee', cost: 500, baseIncome: 10, desc: 'A cozy spot for the neighborhood. Generates passive income.', icon: '☕' },
    { id: 'grocery_kiosk', name: 'Abu Omar Grocery', cost: 1200, baseIncome: 25, desc: 'Essential goods for everyone. High reputation boost.', icon: '🛒' },
    { id: 'workshop', name: 'The Master Workshop', cost: 3000, baseIncome: 75, desc: 'Repair bikes and cars. Unlocks advanced missions.', icon: '🔧' },
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
            className="relative w-full max-w-2xl bg-[#121212] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-indigo-500/10 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Neighborhood Real Estate</h2>
                  <p className="text-white/40 text-sm font-medium">Invest in businesses to grow your empire</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {businesses.map((biz) => {
                const ownedBiz = ownedBusinesses.find(b => b.id === biz.id);
                const isOwned = !!ownedBiz;
                const canAfford = money >= (isOwned ? ownedBiz.upgradeCost : biz.cost);

                return (
                  <motion.div 
                    key={biz.id}
                    whileHover={{ x: 5 }}
                    className={`group relative flex items-center gap-6 p-6 rounded-3xl border transition-all ${
                      isOwned 
                        ? 'bg-emerald-500/5 border-emerald-500/20' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="text-4xl w-16 h-16 flex items-center justify-center bg-white/5 rounded-2xl">
                      {biz.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-lg">{biz.name}</h3>
                        {isOwned && (
                          <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            <span className="text-emerald-400 text-[10px] font-bold uppercase">Lvl {ownedBiz.level}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-white/40 text-sm leading-tight max-w-xs">{biz.desc}</p>
                      {isOwned && (
                        <p className="text-emerald-400/60 text-[10px] font-bold uppercase mt-1">
                          Income: ${ownedBiz.baseIncome * ownedBiz.level}/min
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 text-emerald-400 font-mono font-bold">
                        <span>$</span>
                        <span className="text-xl">{(isOwned ? ownedBiz.upgradeCost : biz.cost).toLocaleString()}</span>
                      </div>
                      
                      <button
                        disabled={!canAfford}
                        onClick={() => isOwned ? upgradeBusiness(biz.id) : buyBusiness(biz.id, biz.name, biz.cost, biz.baseIncome)}
                        className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                          canAfford 
                            ? 'bg-white text-black hover:bg-indigo-500 hover:text-white' 
                            : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                      >
                        {isOwned ? 'Upgrade' : canAfford ? 'Purchase' : 'Locked'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/5 border-t border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-indigo-400" />
                <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Your Balance:</span>
                <span className="text-emerald-400 font-mono font-black">${money.toLocaleString()}</span>
              </div>
              <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest">Upgrade businesses to increase passive income</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
