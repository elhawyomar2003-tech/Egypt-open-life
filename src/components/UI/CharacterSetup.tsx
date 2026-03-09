import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../store';
import { User, MapPin, Calendar, CreditCard } from 'lucide-react';

const CharacterSetup: React.FC = () => {
  const [name, setName] = useState('');
  const [step, setStep] = useState(1);
  const createIDCard = useGameStore((state) => state.createIDCard);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 3) {
      setStep(2);
    }
  };

  const handleConfirm = () => {
    createIDCard(name);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-md w-full shadow-2xl"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2 font-sans tracking-tight">Welcome to Sharqia</h1>
              <p className="text-zinc-400">Please enter your name to issue your neighborhood ID card.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ahmed Mohamed"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={name.trim().length < 3}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform active:scale-95"
              >
                Generate ID Card
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center max-w-2xl w-full"
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-white mb-2">Your Official ID is Ready</h2>
              <p className="text-zinc-400">Welcome to the Sharqia Governorate community.</p>
            </div>

            {/* Egyptian ID Card Style */}
            <div className="relative w-full max-w-lg aspect-[1.6/1] bg-gradient-to-br from-zinc-100 to-zinc-300 rounded-2xl p-6 shadow-2xl overflow-hidden border-4 border-zinc-400">
              {/* Card Background Patterns */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '10px 10px' }}></div>
              
              {/* Header */}
              <div className="flex justify-between items-start mb-4 border-b border-zinc-400 pb-2">
                <div className="text-zinc-800">
                  <p className="text-[10px] font-bold uppercase leading-tight">Arab Republic of Egypt</p>
                  <p className="text-[10px] font-bold uppercase leading-tight">Ministry of Interior</p>
                  <p className="text-[10px] font-bold uppercase leading-tight">Civil Status Organization</p>
                </div>
                <div className="w-12 h-12 bg-zinc-400 rounded-full flex items-center justify-center">
                  <img src="https://picsum.photos/seed/egypt-eagle/100/100" alt="Eagle" className="w-8 h-8 opacity-50 grayscale" referrerPolicy="no-referrer" />
                </div>
              </div>

              {/* Body */}
              <div className="flex gap-6">
                {/* Photo Placeholder */}
                <div className="w-32 aspect-[3/4] bg-zinc-400 rounded border border-zinc-500 flex items-center justify-center overflow-hidden relative">
                  <User className="w-16 h-16 text-zinc-300" />
                  <div className="absolute bottom-0 left-0 right-0 bg-zinc-800/20 h-4"></div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-[8px] text-zinc-600 uppercase font-bold">Name</p>
                    <p className="text-lg font-bold text-zinc-900 leading-tight uppercase">{name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[8px] text-zinc-600 uppercase font-bold">Governorate</p>
                      <p className="text-xs font-bold text-zinc-800">الشرقية (Sharqia)</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-zinc-600 uppercase font-bold">Issue Date</p>
                      <p className="text-xs font-bold text-zinc-800">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[8px] text-zinc-600 uppercase font-bold">National ID Number</p>
                    <p className="text-sm font-mono font-bold text-zinc-800 tracking-widest">2 {Math.floor(Math.random() * 10000000000000).toString().padStart(13, '0')}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                <div className="w-24 h-6 bg-zinc-400/50 rounded flex items-center justify-center">
                  <div className="w-full h-px bg-zinc-500/50"></div>
                </div>
                <div className="text-[8px] font-bold text-zinc-500 uppercase">National Identity Card</div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="mt-12 px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xl transition-all transform hover:scale-105 active:scale-95"
            >
              Start Your Journey
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CharacterSetup;
