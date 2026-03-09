import React, { useState, useEffect } from 'react';
import GameScene from './components/Game/Scene';
import HUD from './components/UI/HUD';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Trophy, Settings, User, Zap, DollarSign, Star } from 'lucide-react';
import { useGameStore } from './store';
import CustomizationMenu from './components/UI/CustomizationMenu';
import Leaderboard from './components/UI/Leaderboard';
import CharacterSetup from './components/UI/CharacterSetup';
import { TestMode } from './components/UI/TestMode';

import { useTranslation } from 'react-i18next';

export default function App() {
  const { t, i18n } = useTranslation();
  const [gameStarted, setGameStarted] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { hasIDCard, loadGame, setMission, activeInteraction } = useGameStore();

  // ... (rest of the component)
  
  // Inside the render:
  // <h1 className="text-7xl md:text-8xl font-black text-white text-center leading-[0.85] tracking-tighter uppercase italic">
  //   {t('gameTitle')}
  // </h1>

  // Load game on mount
  useEffect(() => {
    loadGame();
  }, [loadGame]);

  // Set initial mission on start
  useEffect(() => {
    if (gameStarted && hasIDCard) {
      setMission({
        id: 'welcome_mission',
        title: 'Start Your Journey',
        reward: 0,
        district: 'Old Neighborhood',
        type: 'side',
        objective: 'Talk to the Coffee Shop owner'
      });
    }
  }, [gameStarted, hasIDCard, setMission]);

  return (
    <div className="w-full h-screen bg-[#0a0a0a] overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <motion.div 
            key="start-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-8"
          >
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-2xl w-full">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-1 bg-indigo-500 rounded-full" />
                  <span className="text-indigo-400 text-sm font-black uppercase tracking-[0.3em]">Sharqia Life Simulator</span>
                  <div className="w-12 h-1 bg-indigo-500 rounded-full" />
                </div>
                <h1 className="text-7xl md:text-8xl font-black text-white text-center leading-[0.85] tracking-tighter uppercase italic">
                  Haret El <span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-indigo-600">Asatir</span>
                </h1>
                <p className="text-white/40 text-lg mt-6 text-center font-medium max-w-md tracking-tight">
                  Build your reputation in Sharqia, own properties, and become the ultimate legend of the neighborhood.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
                <MenuCard 
                  icon={<User className="text-indigo-400" />} 
                  title="Character" 
                  desc="Customize your look and skills" 
                  onClick={() => setShowCustomization(true)}
                />
                <MenuCard 
                  icon={<Trophy className="text-amber-400" />} 
                  title="Leaderboard" 
                  desc="See who's the richest legend" 
                  onClick={() => setShowLeaderboard(true)}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGameStarted(true)}
                className="group relative flex items-center gap-4 bg-white text-black px-12 py-6 rounded-3xl font-black text-2xl uppercase tracking-tighter transition-all hover:bg-indigo-50 shadow-2xl"
              >
                <Play className="fill-black group-hover:scale-110 transition-transform" size={32} />
                <span>Enter Neighborhood</span>
                <div className="absolute -inset-1 bg-indigo-500/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>

              <div className="mt-12 flex items-center gap-8 text-white/30 text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Zap size={14} />
                  <span>Sharqia Governorate</span>
                </div>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <div className="flex items-center gap-2">
                  <DollarSign size={14} />
                  <span>Save Progress</span>
                </div>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <div className="flex items-center gap-2">
                  <Star size={14} />
                  <span>Arabic Style</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : !hasIDCard ? (
          <CharacterSetup />
        ) : (
          <motion.div 
            key="game-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full"
          >
            <GameScene />
            <HUD />
            <TestMode />
            
            {/* Interaction Button */}
            <AnimatePresence>
              {activeInteraction && (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={activeInteraction.onInteract}
                  className="fixed bottom-20 right-1/2 translate-x-1/2 bg-indigo-600 text-white px-8 py-4 rounded-full font-black text-xl shadow-2xl border-4 border-white/20 z-[100]"
                >
                  {activeInteraction.label}
                </motion.button>
              )}
            </AnimatePresence>
            
            {/* Interaction Hint */}
            <div className="fixed bottom-32 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-2 opacity-60">
              <div className="flex gap-2">
                <KeyHint k="W" />
                <KeyHint k="A" />
                <KeyHint k="S" />
                <KeyHint k="D" />
              </div>
              <span className="text-white/40 text-[10px] uppercase font-black tracking-widest">Move Character</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Menus */}
      <CustomizationMenu isOpen={showCustomization} onClose={() => setShowCustomization(false)} />
      <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
    </div>
  );
}

function MenuCard({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick?: () => void }) {
  return (
    <motion.div 
      whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
      onClick={onClick}
      className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-5 cursor-pointer transition-colors"
    >
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl shadow-inner">
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="text-white font-bold text-lg tracking-tight">{title}</h3>
        <p className="text-white/40 text-sm leading-tight">{desc}</p>
      </div>
    </motion.div>
  );
}

function KeyHint({ k }: { k: string }) {
  return (
    <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white text-[10px] font-black">
      {k}
    </div>
  );
}

