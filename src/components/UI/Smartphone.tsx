import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, MessageSquare, Map as MapIcon, Briefcase, Globe, 
  Car, X, ChevronLeft, Send, Check, Bell, Info, 
  DollarSign, Star, Trophy, Calendar, Newspaper, User
} from 'lucide-react';
import { useGameStore, Message, Contact, Notification, VehicleStats } from '../../store';

interface SmartphoneProps {
  isOpen: boolean;
  onClose: () => void;
}

type AppId = 'home' | 'contacts' | 'messages' | 'missions' | 'map' | 'business' | 'internet' | 'dealership' | 'achievements' | 'shop' | 'skills' | 'luckybox' | 'challenges';

export default function Smartphone({ isOpen, onClose }: SmartphoneProps) {
  const [activeApp, setActiveApp] = useState<AppId>('home');
  const { 
    money, reputation, level, messages, contacts, notifications, 
    news, ownedBusinesses, activeMission, completedMissions,
    ownedVehicles, vehicleStats, buyVehicle, upgradeVehicle,
    addMoney, readMessage, clearNotifications,
    achievements, dailyShop, buyShopItem, skills,
    luckyBoxes, openLuckyBox, dailyChallenges, weeklyChallenges, updateChallengeProgress,
    loginStreak
  } = useGameStore();

  const renderApp = () => {
    switch (activeApp) {
      case 'contacts': return <ContactsApp contacts={contacts} />;
      case 'messages': return <MessagesApp messages={messages} onRead={readMessage} />;
      case 'missions': return <MissionsApp activeMission={activeMission} completedCount={completedMissions.length} />;
      case 'map': return <MapApp />;
      case 'business': return <BusinessApp businesses={ownedBusinesses} />;
      case 'internet': return <InternetApp news={news} />;
      case 'dealership': return <DealershipApp ownedVehicles={ownedVehicles} vehicleStats={vehicleStats} money={money} onBuy={buyVehicle} onUpgrade={upgradeVehicle} />;
      case 'achievements': return <AchievementsApp achievements={achievements} />;
      case 'shop': return <ShopApp shopItems={dailyShop} money={money} onBuy={buyShopItem} />;
      case 'skills': return <SkillsApp skills={skills} />;
      case 'luckybox': return <LuckyBoxApp boxes={luckyBoxes} onOpen={openLuckyBox} />;
      case 'challenges': return <ChallengesApp daily={dailyChallenges} weekly={weeklyChallenges} onUpdate={updateChallengeProgress} streak={loginStreak} />;
      default: return <HomeMenu onOpenApp={setActiveApp} notificationsCount={notifications.length} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ y: 500, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 500, opacity: 0, scale: 0.8 }}
            className="relative w-[320px] h-[640px] bg-[#1a1a1a] rounded-[3rem] border-[8px] border-[#333] shadow-2xl pointer-events-auto overflow-hidden flex flex-col"
          >
            {/* Status Bar */}
            <div className="h-10 flex justify-between items-center px-8 pt-4 pb-2">
              <span className="text-white/70 text-[10px] font-bold">12:45</span>
              <div className="flex gap-1.5 items-center">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-5 h-2.5 rounded-sm border border-white/40 flex items-center px-0.5">
                  <div className="w-full h-full bg-emerald-500 rounded-sm" />
                </div>
              </div>
            </div>

            {/* App Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {activeApp !== 'home' && (
                <div className="px-4 py-2 flex items-center gap-2 border-b border-white/5">
                  <button 
                    onClick={() => setActiveApp('home')}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  <span className="text-white font-bold text-sm capitalize">{activeApp}</span>
                </div>
              )}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {renderApp()}
              </div>
            </div>

            {/* Home Button */}
            <div className="h-14 flex items-center justify-center">
              <button 
                onClick={() => activeApp === 'home' ? onClose() : setActiveApp('home')}
                className="w-12 h-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function HomeMenu({ onOpenApp, notificationsCount }: { onOpenApp: (id: AppId) => void, notificationsCount: number }) {
  const apps: { id: AppId, icon: React.ReactNode, label: string, color: string, badge?: number }[] = [
    { id: 'contacts', icon: <Phone size={24} />, label: 'Phone', color: 'bg-emerald-500', badge: 0 },
    { id: 'messages', icon: <MessageSquare size={24} />, label: 'Messages', color: 'bg-indigo-500', badge: notificationsCount },
    { id: 'missions', icon: <Trophy size={24} />, label: 'Missions', color: 'bg-amber-500' },
    { id: 'map', icon: <MapIcon size={24} />, label: 'Map', color: 'bg-rose-500' },
    { id: 'business', icon: <Briefcase size={24} />, label: 'Business', color: 'bg-cyan-500' },
    { id: 'internet', icon: <Globe size={24} />, label: 'Internet', color: 'bg-blue-500' },
    { id: 'dealership', icon: <Car size={24} />, label: 'Vehicles', color: 'bg-orange-500' },
    { id: 'achievements', icon: <Trophy size={24} />, label: 'Awards', color: 'bg-yellow-500' },
    { id: 'shop', icon: <Calendar size={24} />, label: 'Daily Shop', color: 'bg-pink-500' },
    { id: 'skills', icon: <User size={24} />, label: 'Skills', color: 'bg-purple-500' },
    { id: 'luckybox', icon: <Star size={24} />, label: 'Lucky Box', color: 'bg-red-500' },
    { id: 'challenges', icon: <Info size={24} />, label: 'Challenges', color: 'bg-teal-500' },
  ];

  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      {apps.map((app) => (
        <button
          key={app.id}
          onClick={() => onOpenApp(app.id)}
          className="flex flex-col items-center gap-2 group"
        >
          <div className={`relative w-14 h-14 ${app.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
            {app.icon}
            {app.badge ? (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center text-[10px] font-bold">
                {app.badge}
              </div>
            ) : null}
          </div>
          <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">{app.label}</span>
        </button>
      ))}
    </div>
  );
}

function ContactsApp({ contacts }: { contacts: Contact[] }) {
  return (
    <div className="p-4 flex flex-col gap-2">
      {contacts.map(contact => (
        <div key={contact.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
            {contact.avatar}
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm">{contact.name}</span>
            <span className="text-white/40 text-[10px]">{contact.role}</span>
          </div>
          <button className="ml-auto p-2 bg-emerald-500/20 text-emerald-400 rounded-full">
            <Phone size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

function MessagesApp({ messages, onRead }: { messages: Message[], onRead: (id: string) => void }) {
  return (
    <div className="p-4 flex flex-col gap-2">
      {messages.map(msg => (
        <div 
          key={msg.id} 
          onClick={() => onRead(msg.id)}
          className={`flex flex-col gap-1 p-4 rounded-2xl transition-colors cursor-pointer ${msg.read ? 'bg-white/5' : 'bg-indigo-500/20 border border-indigo-500/30'}`}
        >
          <div className="flex justify-between items-center">
            <span className="text-white font-bold text-xs">{msg.sender}</span>
            <span className="text-white/30 text-[10px]">{msg.date}</span>
          </div>
          <p className="text-white/60 text-[11px] leading-relaxed line-clamp-2">{msg.content}</p>
          {!msg.read && <div className="w-2 h-2 bg-indigo-500 rounded-full self-end" />}
        </div>
      ))}
    </div>
  );
}

function MissionsApp({ activeMission, completedCount }: { activeMission: any, completedCount: number }) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="bg-white/5 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Active Mission</span>
          <Trophy size={14} className="text-amber-500" />
        </div>
        {activeMission ? (
          <div className="flex flex-col gap-2">
            <h3 className="text-white font-bold text-sm">{activeMission.title}</h3>
            <p className="text-white/60 text-[11px] italic">"{activeMission.objective}"</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-emerald-400 text-[10px] font-bold">+${activeMission.reward}</span>
              <span className="text-indigo-400 text-[10px] font-bold">{activeMission.district}</span>
            </div>
          </div>
        ) : (
          <p className="text-white/30 text-[11px] text-center py-4">No active missions. Call contacts to find work!</p>
        )}
      </div>

      <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Completed</span>
          <span className="text-white font-bold text-xl">{completedCount}</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Check size={24} />
        </div>
      </div>
    </div>
  );
}

function MapApp() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="aspect-square bg-[#222] rounded-3xl relative overflow-hidden border border-white/10">
        {/* Placeholder for Map Visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
        </div>
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
          <span className="text-white text-[10px] font-bold uppercase tracking-widest">Old Neighborhood</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <MapLegendItem icon={<Car size={12} />} label="Garage" color="text-orange-400" />
        <MapLegendItem icon={<DollarSign size={12} />} label="Shop" color="text-emerald-400" />
        <MapLegendItem icon={<Trophy size={12} />} label="Mission" color="text-amber-400" />
        <MapLegendItem icon={<User size={12} />} label="You" color="text-blue-400" />
      </div>
    </div>
  );
}

function MapLegendItem({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl">
      <span className={color}>{icon}</span>
      <span className="text-white/60 text-[10px] font-bold">{label}</span>
    </div>
  );
}

function BusinessApp({ businesses }: { businesses: any[] }) {
  const totalIncome = businesses.reduce((acc, b) => acc + (b.baseIncome * b.level), 0);
  
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-4 text-white shadow-lg">
        <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Total Passive Income</span>
        <div className="text-2xl font-black mt-1">${totalIncome}/min</div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest px-2">Your Assets</span>
        {businesses.length > 0 ? (
          businesses.map(b => (
            <div key={b.id} className="bg-white/5 rounded-2xl p-4 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">{b.name}</span>
                <span className="text-white/40 text-[10px]">Level {b.level} • ${b.baseIncome * b.level}/min</span>
              </div>
              <div className="text-emerald-400 font-bold text-xs">+${b.baseIncome * b.level}</div>
            </div>
          ))
        ) : (
          <p className="text-white/30 text-[11px] text-center py-4">No businesses owned yet.</p>
        )}
      </div>
    </div>
  );
}

function InternetApp({ news }: { news: any[] }) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 bg-blue-500/20 p-3 rounded-2xl border border-blue-500/30">
        <Globe size={18} className="text-blue-400" />
        <span className="text-blue-400 text-xs font-bold">Sharqia Web Browser</span>
      </div>

      <div className="flex flex-col gap-4">
        {news.map(item => (
          <div key={item.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            <div className="h-24 bg-white/10 relative">
              <Newspaper size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10" />
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold text-xs">{item.title}</span>
                <span className="text-white/30 text-[10px]">{item.date}</span>
              </div>
              <p className="text-white/60 text-[11px] leading-relaxed">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DealershipApp({ ownedVehicles, vehicleStats, money, onBuy, onUpgrade }: { 
  ownedVehicles: string[], 
  vehicleStats: Record<string, VehicleStats>, 
  money: number,
  onBuy: (id: string, cost: number, stats: VehicleStats) => void,
  onUpgrade: (id: string, stat: keyof VehicleStats, amount: number, cost: number) => void
}) {
  const availableVehicles = [
    { id: 'scooter_1', name: 'Z-Scooter', type: 'motorbike', cost: 500, stats: { speed: 40, handling: 80, appearance: 'blue', color: '#3b82f6' } },
    { id: 'sedan_1', name: 'City Sedan', type: 'car', cost: 2500, stats: { speed: 60, handling: 60, appearance: 'silver', color: '#94a3b8' } },
    { id: 'truck_1', name: 'Delivery Van', type: 'delivery', cost: 5000, stats: { speed: 50, handling: 40, appearance: 'white', color: '#ffffff' } },
    { id: 'sport_1', name: 'Desert Eagle', type: 'car', cost: 15000, stats: { speed: 90, handling: 70, appearance: 'red', color: '#ef4444' } },
  ];

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {availableVehicles.map(v => {
          const isOwned = ownedVehicles.includes(v.id);
          const stats = isOwned ? vehicleStats[v.id] : v.stats;
          
          return (
            <div key={v.id} className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">{v.name}</span>
                  <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{v.type}</span>
                </div>
                {!isOwned ? (
                  <button 
                    onClick={() => onBuy(v.id, v.cost, v.stats)}
                    disabled={money < v.cost}
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${money >= v.cost ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/30'}`}
                  >
                    Buy ${v.cost}
                  </button>
                ) : (
                  <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-bold uppercase tracking-widest">Owned</div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <StatBar label="Speed" value={stats.speed} max={100} color="bg-orange-500" />
                <StatBar label="Handling" value={stats.handling} max={100} color="bg-blue-500" />
              </div>

              {isOwned && (
                <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => onUpgrade(v.id, 'speed', 5, 500)}
                    disabled={money < 500 || stats.speed >= 100}
                    className="py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold text-white transition-colors disabled:opacity-30"
                  >
                    Tune Engine ($500)
                  </button>
                  <button 
                    onClick={() => onUpgrade(v.id, 'handling', 5, 300)}
                    disabled={money < 300 || stats.handling >= 100}
                    className="py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold text-white transition-colors disabled:opacity-30"
                  >
                    Upgrade Tires ($300)
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatBar({ label, value, max, color }: { label: string, value: number, max: number, color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-white/40">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}

function AchievementsApp({ achievements }: { achievements: any[] }) {
  return (
    <div className="p-4 flex flex-col gap-3">
      {achievements.map(a => (
        <div key={a.id} className={`p-4 rounded-2xl border ${a.completed ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/5'}`}>
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col">
              <span className={`font-bold text-sm ${a.completed ? 'text-amber-400' : 'text-white'}`}>{a.title}</span>
              <span className="text-white/40 text-[10px]">{a.description}</span>
            </div>
            {a.completed && <Trophy size={16} className="text-amber-500" />}
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between text-[8px] font-bold text-white/30 uppercase">
              <span>Progress</span>
              <span>{a.progress} / {a.target}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${a.completed ? 'bg-amber-500' : 'bg-indigo-500'}`}
                style={{ width: `${(a.progress / a.target) * 100}%` }}
              />
            </div>
          </div>
          <div className="mt-2 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
            Reward: +{a.reward.amount} {a.reward.type}
          </div>
        </div>
      ))}
    </div>
  );
}

function ShopApp({ shopItems, money, onBuy }: { shopItems: any[], money: number, onBuy: (item: any) => void }) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="bg-gradient-to-br from-pink-600 to-rose-700 rounded-2xl p-4 text-white shadow-lg">
        <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Your Balance</span>
        <div className="text-2xl font-black mt-1">${money}</div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest px-2">Daily Offers</span>
        {shopItems.map(item => (
          <div key={item.id} className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
              {item.image}
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-white font-bold text-sm">{item.name}</span>
              <span className="text-white/40 text-[10px] uppercase">{item.type}</span>
            </div>
            <button 
              onClick={() => onBuy(item)}
              disabled={money < item.price}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${money >= item.price ? 'bg-pink-500 text-white' : 'bg-white/10 text-white/30'}`}
            >
              ${item.price}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsApp({ skills }: { skills: any }) {
  return (
    <div className="p-4 flex flex-col gap-6">
      <SkillItem label="Driving" value={skills.driving} icon={<Car size={16} />} color="bg-blue-500" />
      <SkillItem label="Repairing" value={skills.repairing} icon={<Briefcase size={16} />} color="bg-orange-500" />
      <SkillItem label="Trading" value={skills.trading} icon={<DollarSign size={16} />} color="bg-emerald-500" />
      <SkillItem label="Racing" value={skills.racing} icon={<Trophy size={16} />} color="bg-rose-500" />
    </div>
  );
}

function SkillItem({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) {
  const level = Math.floor(value / 100);
  const progress = value % 100;
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${color}/20 flex items-center justify-center text-white`}>
          {icon}
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-end">
            <span className="text-white font-bold text-sm">{label}</span>
            <span className="text-white/40 text-[10px] font-bold">LVL {level}</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mt-1">
            <div 
              className={`h-full ${color} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LuckyBoxApp({ boxes, onOpen }: { boxes: number, onOpen: () => void }) {
  return (
    <div className="p-4 flex flex-col items-center gap-6">
      <div className="text-center">
        <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Available Boxes</span>
        <div className="text-4xl font-black text-white mt-2">{boxes}</div>
      </div>
      <button 
        onClick={onOpen}
        disabled={boxes === 0}
        className="w-32 h-32 bg-red-500 rounded-3xl flex items-center justify-center text-4xl shadow-lg hover:scale-105 transition-transform disabled:opacity-30"
      >
        🎁
      </button>
      <p className="text-white/40 text-[10px] text-center">Open a box to get random rewards!</p>
    </div>
  );
}

function ChallengesApp({ daily, weekly, onUpdate, streak }: { daily: any[], weekly: any[], onUpdate: (id: string, progress: number) => void, streak: number }) {
  return (
    <div className="p-4 flex flex-col gap-6">
      {/* Daily Login Streak */}
      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
        <h3 className="text-white font-bold text-xs mb-3 uppercase tracking-widest">Login Streak</h3>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map(day => (
            <div key={day} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${day <= streak ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/30'}`}>
              {day === 7 ? '🎁' : day}
            </div>
          ))}
        </div>
      </div>

      {/* Daily Challenges */}
      <div>
        <h3 className="text-white font-bold text-xs mb-3 uppercase tracking-widest">Daily Challenges</h3>
        <div className="flex flex-col gap-3">
          {daily.map(c => (
            <ChallengeItem key={c.id} challenge={c} onUpdate={onUpdate} />
          ))}
        </div>
      </div>

      {/* Weekly Challenges */}
      <div>
        <h3 className="text-white font-bold text-xs mb-3 uppercase tracking-widest">Weekly Challenges</h3>
        <div className="flex flex-col gap-3">
          {weekly.map(c => (
            <ChallengeItem key={c.id} challenge={c} onUpdate={onUpdate} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChallengeItem({ challenge: c, onUpdate }: { challenge: any, onUpdate: (id: string, progress: number) => void }) {
  return (
    <div className={`p-4 rounded-2xl border ${c.completed ? 'bg-teal-500/10 border-teal-500/30' : 'bg-white/5 border-white/5'}`}>
      <div className="flex justify-between items-start mb-2">
        <span className={`font-bold text-sm ${c.completed ? 'text-teal-400' : 'text-white'}`}>{c.description}</span>
        {c.completed && <Check size={16} className="text-teal-500" />}
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-2">
        <div 
          className={`h-full transition-all duration-500 ${c.completed ? 'bg-teal-500' : 'bg-blue-500'}`}
          style={{ width: `${Math.min(100, (c.progress / c.target) * 100)}%` }}
        />
      </div>
      <div className="mt-2 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
        Reward: ${c.reward}
      </div>
    </div>
  );
}
