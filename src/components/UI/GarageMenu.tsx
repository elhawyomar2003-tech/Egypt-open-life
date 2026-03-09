import React from 'react';
import { useGameStore } from '../../store';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bike, Car, CheckCircle2, Lock, Zap, TrendingUp } from 'lucide-react';

interface GarageMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GarageMenu({ isOpen, onClose }: GarageMenuProps) {
  const { money, buyVehicle, ownedVehicles } = useGameStore();

  const vehicles = [
    { id: 'scooter', name: 'Neighborhood Scooter', cost: 300, desc: 'Fast enough for deliveries. Low maintenance.', icon: <Bike size={32} />, speed: 40, handling: 90 },
    { id: 'motorbike', name: 'Desert Hawk 250', cost: 1500, desc: 'A powerful bike for the streets. High speed.', icon: <Bike size={32} />, speed: 80, handling: 70 },
    { id: 'delivery_van', name: 'Swift Delivery Van', cost: 3500, desc: 'Perfect for large orders. Sturdy and reliable.', icon: <Car size={32} />, speed: 50, handling: 60 },
    { id: 'sport_bike', name: 'Neon Racer', cost: 8000, desc: 'The fastest bike in the neighborhood. Pure adrenaline.', icon: <Bike size={32} />, speed: 100, handling: 50 },
    { id: 'luxury_sedan', name: 'Palm Executive', cost: 15000, desc: 'The ultimate status symbol. Smooth and elegant.', icon: <Car size={32} />, speed: 75, handling: 85 },
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
            className="relative w-full max-w-4xl bg-[#0f172a] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-cyan-500/10 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Car size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Legendary Garage</h2>
                  <p className="text-white/40 text-sm font-medium">Upgrade your ride to rule the neighborhood</p>
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
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {vehicles.map((v) => {
                const isOwned = ownedVehicles.includes(v.id);
                const canAfford = money >= v.cost;

                return (
                  <motion.div 
                    key={v.id}
                    whileHover={{ y: -5 }}
                    className={`group relative flex flex-col p-6 rounded-3xl border transition-all ${
                      isOwned 
                        ? 'bg-cyan-500/5 border-cyan-500/20' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="mb-6 w-full aspect-video bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400">
                      {v.icon}
                    </div>
                    
                    <div className="flex-1 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-bold text-lg leading-tight">{v.name}</h3>
                        {isOwned && <CheckCircle2 size={16} className="text-cyan-400" />}
                      </div>
                      <p className="text-white/40 text-xs leading-relaxed mb-4">{v.desc}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Zap size={10} className="text-cyan-400" />
                          <span className="text-white/30 text-[8px] uppercase font-bold tracking-widest w-12">Speed</span>
                          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-400" style={{ width: `${v.speed}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp size={10} className="text-cyan-400" />
                          <span className="text-white/30 text-[8px] uppercase font-bold tracking-widest w-12">Handling</span>
                          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-400" style={{ width: `${v.handling}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest">Price</span>
                        <span className="text-emerald-400 font-mono font-bold">${v.cost.toLocaleString()}</span>
                      </div>
                      
                      <button
                        disabled={isOwned || !canAfford}
                        onClick={() => buyVehicle(v.id, v.cost, { speed: v.speed, handling: v.handling, color: '#333', appearance: 'Stock' })}
                        className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                          isOwned 
                            ? 'bg-cyan-500/20 text-cyan-400 cursor-default' 
                            : canAfford 
                              ? 'bg-white text-black hover:bg-cyan-500 hover:text-white' 
                              : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                      >
                        {isOwned ? 'In Garage' : canAfford ? 'Buy Now' : 'Locked'}
                      </button>
                    </div>

                    {!isOwned && !canAfford && (
                      <div className="absolute top-4 right-4">
                        <Lock size={14} className="text-white/20" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/5 border-t border-white/5 flex justify-center">
              <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest">Vehicles can be customized at the Workshop</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
