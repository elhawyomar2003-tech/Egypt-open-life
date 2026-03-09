import React, { useState } from 'react';
import { useGameStore } from '../../store';
import { DollarSign, Zap, Star, Trophy, Clock, User, Settings, MapPin, Sun, Cloud, CloudRain, TrendingUp, Target, CheckCircle2, Smartphone as PhoneIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Minimap from './Minimap';
import Smartphone from './Smartphone';
import SettingsMenu from './SettingsMenu';

export default function HUD() {
  const { money, energy, health, reputation, level, xp, timeOfDay, activeMission, currentDistrict, weather, ownedBusinesses, completedMissions, storyStep, notifications, activeInteraction } = useGameStore();
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.floor((time % 1) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const xpProgress = (xp / (level * 1000)) * 100;
  const totalPassiveIncome = ownedBusinesses.reduce((acc, b) => acc + (b.baseIncome * b.level), 0);

  const WeatherIcon = () => {
    switch (weather) {
      case 'cloudy': return <Cloud size={16} className="text-gray-400" />;
      case 'rainy': return <CloudRain size={16} className="text-blue-400" />;
      default: return <Sun size={16} className="text-yellow-400" />;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col gap-2">
          {/* Level & XP */}
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl border-2 border-indigo-400 shadow-lg shadow-indigo-500/20">
              {level}
            </div>
            <div className="flex flex-col gap-1 w-48">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Level Progress</span>
                <span className="text-white text-xs font-bold">{Math.floor(xpProgress)}%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ type: 'spring', stiffness: 50 }}
                />
              </div>
            </div>
          </div>

          {/* District & Weather */}
          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10 shadow-lg">
              <MapPin size={14} className="text-indigo-400" />
              <span className="text-white/70 text-[10px] uppercase font-black tracking-widest">{currentDistrict}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10 shadow-lg">
              <WeatherIcon />
              <span className="text-white/70 text-[10px] uppercase font-black tracking-widest">{weather}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1">
              <StatItem icon={<DollarSign size={18} />} value={money.toLocaleString()} color="text-emerald-400" bgColor="bg-emerald-500/20" />
              {totalPassiveIncome > 0 && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 rounded-lg self-start">
                  <TrendingUp size={10} className="text-emerald-400" />
                  <span className="text-emerald-400 text-[10px] font-bold">+${totalPassiveIncome}/min</span>
                </div>
              )}
            </div>
            <StatItem icon={<Star size={18} />} value={reputation.toLocaleString()} color="text-amber-400" bgColor="bg-amber-500/20" />
          </div>
        </div>

        {/* Time & Energy */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-xl">
            <div className="flex flex-col items-end">
              <span className="text-white/50 text-[10px] uppercase font-bold tracking-widest">Neighborhood Time</span>
              <span className="text-white font-mono text-2xl font-bold tracking-tighter">{formatTime(timeOfDay)}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/80">
              <Clock size={24} />
            </div>
          </div>

          <div className="w-64 bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-xl">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-cyan-400 fill-cyan-400/20" />
                <span className="text-white/70 text-[10px] uppercase font-bold tracking-widest">Energy</span>
              </div>
              <span className="text-white text-xs font-bold">{Math.floor(energy)}%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-3">
              <motion.div 
                className={`h-full ${energy < 20 ? 'bg-red-500' : 'bg-cyan-500'} shadow-[0_0_10px_rgba(6,182,212,0.5)]`}
                animate={{ width: `${energy}%` }}
              />
            </div>

            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-red-500 rounded-sm flex items-center justify-center text-white text-[8px] font-bold">+</div>
                <span className="text-white/70 text-[10px] uppercase font-bold tracking-widest">Health</span>
              </div>
              <span className="text-white text-xs font-bold">{Math.floor(health)}%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${health < 30 ? 'bg-red-600' : 'bg-red-500'} shadow-[0_0_10px_rgba(239,68,68,0.5)]`}
                animate={{ width: `${health}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Mission & Minimap */}
      <div className="flex flex-col gap-4 mt-8 self-start pointer-events-auto">
        <AnimatePresence>
          {activeMission && (
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border-l-4 border-amber-500 shadow-xl max-w-xs cursor-pointer hover:bg-black/70 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-amber-500" />
                  <span className="text-amber-500 text-[10px] uppercase font-black tracking-widest">
                    {activeMission.type === 'main' ? 'Main Story' : 'Side Mission'}
                  </span>
                </div>
                <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">+${activeMission.reward}</div>
              </div>
              
              <h3 className="text-white font-bold text-sm leading-tight mb-2">{activeMission.title}</h3>
              
              <div className="flex items-start gap-2 bg-white/5 rounded-xl p-2 mb-2">
                <Target size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-white/80 text-[11px] leading-relaxed italic">
                  {activeMission.objective}
                </p>
              </div>

              <div className="flex items-center gap-1 text-white/40 text-[10px]">
                <MapPin size={10} />
                <span>Location: {activeMission.district}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Minimap />
      </div>

      {/* Story Progress Indicator */}
      <div className="mt-4 self-start bg-black/40 backdrop-blur-md rounded-xl px-3 py-2 border border-white/5 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Star size={12} className="text-amber-400" />
          <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Story Progress</span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((step) => (
            <div 
              key={step} 
              className={`w-2 h-2 rounded-full ${storyStep > step ? 'bg-amber-500' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="mt-auto flex justify-center gap-4 pointer-events-auto">
        <ControlButton icon={<User size={24} />} label="Character" />
        <ControlButton 
          icon={<PhoneIcon size={24} />} 
          label="Phone" 
          onClick={() => setIsPhoneOpen(true)}
          badge={notifications.length > 0 ? notifications.length : undefined}
        />
        <ControlButton 
          icon={<Settings size={24} />} 
          label="Settings" 
          onClick={() => setIsSettingsOpen(true)}
        />
        <ControlButton icon={<MapPin size={24} />} label="Map" />
      </div>

      {/* Smartphone Overlay */}
      <Smartphone isOpen={isPhoneOpen} onClose={() => setIsPhoneOpen(false)} />
      <SettingsMenu isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

function StatItem({ icon, value, color, bgColor }: { icon: React.ReactNode, value: string, color: string, bgColor: string }) {
  return (
    <div className={`flex items-center gap-2 ${bgColor} backdrop-blur-md rounded-xl px-3 py-2 border border-white/5 shadow-lg`}>
      <span className={color}>{icon}</span>
      <span className={`font-mono font-bold text-white`}>{value}</span>
    </div>
  );
}

function ControlButton({ icon, label, onClick, badge }: { icon: React.ReactNode, label: string, onClick?: () => void, badge?: number }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="flex flex-col items-center gap-1 group relative"
    >
      <div className="w-14 h-14 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white group-hover:border-white/30 transition-all shadow-xl">
        {icon}
        {badge !== undefined && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
            {badge}
          </div>
        )}
      </div>
      <span className="text-[10px] uppercase font-bold text-white/40 group-hover:text-white/70 tracking-widest">{label}</span>
    </motion.button>
  );
}
