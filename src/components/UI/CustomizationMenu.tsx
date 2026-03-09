import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Palette, CheckCircle2 } from 'lucide-react';
import { useGameStore } from '../../store';

interface CustomizationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomizationMenu({ isOpen, onClose }: CustomizationMenuProps) {
  const { characterCustomization, updateCustomization } = useGameStore();

  const outfits = [
    { id: 'default', name: 'Neighborhood Casual', color: 'bg-orange-500' },
    { id: 'street', name: 'Street Legend', color: 'bg-indigo-500' },
    { id: 'formal', name: 'Palm Heights Elite', color: 'bg-white' },
    { id: 'worker', name: 'Industrial Pro', color: 'bg-yellow-500' },
  ];

  const hairstyles = [
    { id: 'short', name: 'Classic Short' },
    { id: 'fade', name: 'Modern Fade' },
    { id: 'long', name: 'Long Flow' },
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
            className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-amber-500/10 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Style Studio</h2>
                  <p className="text-white/40 text-sm font-medium">Customize your character's look</p>
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
            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Outfits */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Palette size={16} className="text-amber-500" />
                  <h3 className="text-white font-bold uppercase text-xs tracking-widest">Outfits</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {outfits.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => updateCustomization({ outfit: o.id })}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        characterCustomization.outfit === o.id 
                          ? 'bg-amber-500/10 border-amber-500/40' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${o.color}`} />
                        <span className="text-white font-medium text-sm">{o.name}</span>
                      </div>
                      {characterCustomization.outfit === o.id && <CheckCircle2 size={16} className="text-amber-500" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hairstyles */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <User size={16} className="text-amber-500" />
                  <h3 className="text-white font-bold uppercase text-xs tracking-widest">Hairstyles</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {hairstyles.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => updateCustomization({ hairstyle: h.id })}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        characterCustomization.hairstyle === h.id 
                          ? 'bg-amber-500/10 border-amber-500/40' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-white font-medium text-sm">{h.name}</span>
                      {characterCustomization.hairstyle === h.id && <CheckCircle2 size={16} className="text-amber-500" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/5 border-t border-white/5 flex justify-center">
              <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest text-center">More customization options coming soon</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
