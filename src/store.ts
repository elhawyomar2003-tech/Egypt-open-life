import { create } from 'zustand';

interface Business {
  id: string;
  name: string;
  level: number;
  baseIncome: number;
  upgradeCost: number;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  date: string;
  read: boolean;
  missionId?: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  phone: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'mission' | 'info' | 'money' | 'message';
  date: string;
}

export interface VehicleStats {
  speed: number;
  handling: number;
  appearance: string;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  reward: { type: 'money' | 'reputation' | 'xp', amount: number };
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  type: 'outfit' | 'skin' | 'accessory';
  image: string;
}

export interface GameState {
  playerName: string;
  hasIDCard: boolean;
  idCard: {
    name: string;
    governorate: string;
    idNumber: string;
    issueDate: string;
  } | null;
  money: number;
  reputation: number;
  energy: number;
  health: number;
  level: number;
  xp: number;
  timeOfDay: number;
  weather: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  inventory: string[];
  ownedBusinesses: Business[];
  ownedVehicles: string[];
  ownedProperties: string[];
  vehicleStats: Record<string, VehicleStats>;
  currentVehicle: string | null;
  currentInterior: string | null;
  activeMission: { 
    id: string, 
    title: string, 
    reward: number, 
    district: string,
    type: 'main' | 'side' | 'delivery' | 'racing' | 'repair',
    objective: string,
    targetPos?: [number, number, number]
  } | null;
  completedMissions: string[];
  storyStep: number;
  currentDistrict: 'Old Neighborhood' | 'The Souq' | 'Industrial Zone' | 'Palm Heights';
  lastLogin: string;
  loginStreak: number;
  characterCustomization: { outfit: string, hairstyle: string };
  
  // Radio State
  isRadioOn: boolean;
  currentRadioStation: number;

  // Skills
  skills: {
    driving: number;
    repairing: number;
    trading: number;
    racing: number;
  };

  // Achievements
  achievements: Achievement[];

  // Daily Shop
  dailyShop: ShopItem[];
  lastShopRefresh: string;

  // Lucky Box
  luckyBoxes: number;

  // Challenges
  dailyChallenges: { id: string, description: string, progress: number, target: number, completed: boolean, reward: number }[];
  weeklyChallenges: { id: string, description: string, progress: number, target: number, completed: boolean, reward: number }[];
  lastChallengeRefresh: string;
  lastWeeklyChallengeRefresh: string;
  
  // Cloud Save
  username: string | null;
  isLoggedIn: boolean;
  
  // Smartphone Data
  messages: Message[];
  contacts: Contact[];
  notifications: Notification[];
  activeInteraction: { label: string, onInteract: () => void } | null;
  news: { id: string, title: string, content: string, date: string }[];
  
  // Actions
  setPlayerName: (name: string) => void;
  createIDCard: (name: string) => void;
  addMoney: (amount: number) => void;
  removeMoney: (amount: number) => void;
  addReputation: (amount: number) => void;
  addXP: (amount: number) => void;
  useEnergy: (amount: number) => void;
  refillEnergy: (amount?: number) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  advanceTime: (delta: number) => void;
  setWeather: (weather: 'sunny' | 'cloudy' | 'rainy' | 'stormy') => void;
  buyBusiness: (id: string, name: string, cost: number, baseIncome: number) => void;
  upgradeBusiness: (id: string) => void;
  collectPassiveIncome: () => void;
  buyVehicle: (id: string, cost: number, stats: VehicleStats) => void;
  upgradeVehicle: (id: string, stat: keyof VehicleStats, amount: number, cost: number) => void;
  buyProperty: (id: string, cost: number) => void;
  enterInterior: (id: string | null) => void;
  setMission: (mission: GameState['activeMission']) => void;
  completeMission: () => void;
  setDistrict: (district: 'Old Neighborhood' | 'The Souq' | 'Industrial Zone' | 'Palm Heights') => void;
  updateCustomization: (customization: Partial<GameState['characterCustomization']>) => void;
  checkDailyReward: () => void;
  advanceStory: () => void;
  
  // Radio Actions
  setRadioOn: (on: boolean) => void;
  setRadioStation: (station: number) => void;

  // Skill Actions
  improveSkill: (skill: keyof GameState['skills'], amount: number) => void;

  // Achievement Actions
  updateAchievementProgress: (id: string, progress: number) => void;
  checkAchievements: () => void;

  // Shop Actions
  refreshDailyShop: () => void;
  buyShopItem: (item: ShopItem) => void;

  // Lucky Box Actions
  openLuckyBox: () => void;
  addLuckyBox: () => void;
  triggerAd: (type: 'rewarded' | 'interstitial') => void;

  // Challenge Actions
  refreshChallenges: () => void;
  updateChallengeProgress: (id: string, progress: number) => void;
  
  // Cloud Save Actions
  login: (username: string) => void;
  logout: () => void;
  saveToCloud: () => void;
  loadFromCloud: () => void;

  // Smartphone Actions
  addMessage: (message: Omit<Message, 'id' | 'date' | 'read'>) => void;
  readMessage: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date'>) => void;
  clearNotifications: () => void;
  setActiveInteraction: (interaction: { label: string, onInteract: () => void } | null) => void;
  
  saveGame: () => void;
  loadGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  playerName: '',
  hasIDCard: false,
  idCard: null,
  money: 1000,
  reputation: 0,
  energy: 100,
  health: 100,
  level: 1,
  xp: 0,
  timeOfDay: 8,
  weather: 'sunny',
  inventory: [],
  ownedBusinesses: [],
  ownedVehicles: [],
  ownedProperties: [],
  vehicleStats: {},
  currentVehicle: null,
  currentInterior: null,
  activeMission: null,
  completedMissions: [],
  storyStep: 0,
  currentDistrict: 'Old Neighborhood',
  characterCustomization: { outfit: 'default', hairstyle: 'default' },
  
  isRadioOn: false,
  currentRadioStation: 0,

  skills: {
    driving: 0,
    repairing: 0,
    trading: 0,
    racing: 0
  },

  achievements: [
    { id: 'rich_1', title: 'Getting Started', description: 'Earn $5,000 total', progress: 0, target: 5000, completed: false, reward: { type: 'money', amount: 500 } },
    { id: 'mission_1', title: 'Neighborhood Hero', description: 'Complete 5 missions', progress: 0, target: 5, completed: false, reward: { type: 'reputation', amount: 100 } },
    { id: 'vehicle_1', title: 'Car Enthusiast', description: 'Own 3 vehicles', progress: 0, target: 3, completed: false, reward: { type: 'xp', amount: 1000 } },
    { id: 'business_1', title: 'Entrepreneur', description: 'Own 2 businesses', progress: 0, target: 2, completed: false, reward: { type: 'money', amount: 2000 } }
  ],

  dailyShop: [],
  lastShopRefresh: '',
  luckyBoxes: 0,
  dailyChallenges: [],
  weeklyChallenges: [],
  lastChallengeRefresh: '',
  lastWeeklyChallengeRefresh: '',
  
  username: null,
  isLoggedIn: false,
  lastLogin: new Date().toDateString(),
  loginStreak: 1,
  
  messages: [
    { id: '1', sender: 'Uncle Hassan', content: 'Welcome to the neighborhood! Come visit me at the Souq when you can.', date: new Date().toLocaleTimeString(), read: false }
  ],
  contacts: [
    { id: 'hassan', name: 'Uncle Hassan', role: 'Souq Merchant', avatar: '👳‍♂️', phone: '010-1234-5678' },
    { id: 'ali', name: 'Merchant Ali', role: 'Fruit Seller', avatar: '🍎', phone: '011-8765-4321' },
    { id: 'nadia', name: 'Engineer Nadia', role: 'Factory Lead', avatar: '👷‍♀️', phone: '012-5555-0000' },
    { id: 'laila', name: 'Madam Laila', role: 'Socialite', avatar: '💃', phone: '015-9999-1111' }
  ],
  notifications: [],
  activeInteraction: null,
  news: [
    { id: 'n1', title: 'Sharqia Festival', content: 'The annual Sharqia festival is starting next week! Prepare your best outfits.', date: '2026-03-07' },
    { id: 'n2', title: 'New Business Opportunities', content: 'Industrial zone is expanding. New factory spaces available for lease.', date: '2026-03-06' }
  ],

  setPlayerName: (name) => set({ playerName: name }),
  createIDCard: (name) => {
    const idNumber = Math.floor(Math.random() * 10000000000000).toString().padStart(14, '2');
    const issueDate = new Date().toLocaleDateString('ar-EG');
    set({ 
      playerName: name,
      hasIDCard: true,
      idCard: {
        name,
        governorate: 'الشرقية (Sharqia)',
        idNumber,
        issueDate
      }
    });
    get().saveGame();
  },
  addMoney: (amount) => {
    set((state) => ({ money: state.money + amount }));
    get().saveGame();
  },
  removeMoney: (amount) => {
    set((state) => ({ money: Math.max(0, state.money - amount) }));
    get().saveGame();
  },
  addReputation: (amount) => {
    set((state) => ({ reputation: state.reputation + amount }));
    get().saveGame();
  },
  addXP: (amount) => set((state) => {
    const newXP = state.xp + amount;
    const nextLevelXP = state.level * 1000;
    let newState;
    if (newXP >= nextLevelXP) {
      newState = { level: state.level + 1, xp: newXP - nextLevelXP };
    } else {
      newState = { xp: newXP };
    }
    setTimeout(() => get().saveGame(), 0);
    return newState;
  }),
  useEnergy: (amount) => {
    set((state) => ({ energy: Math.max(0, state.energy - amount) }));
    get().saveGame();
  },
  refillEnergy: (amount = 100) => {
    set((state) => ({ energy: Math.min(100, state.energy + amount) }));
    get().saveGame();
  },
  takeDamage: (amount) => {
    set((state) => ({ health: Math.max(0, state.health - amount) }));
    get().saveGame();
  },
  heal: (amount) => {
    set((state) => ({ health: Math.min(100, state.health + amount) }));
    get().saveGame();
  },
  advanceTime: (delta) => {
    const state = get();
    const newTime = (state.timeOfDay + delta) % 24;
    
    if (Math.random() < 0.0005) {
      const weathers: ('sunny' | 'cloudy' | 'rainy' | 'stormy')[] = ['sunny', 'cloudy', 'rainy', 'stormy'];
      const currentIdx = weathers.indexOf(state.weather);
      const nextIdx = (currentIdx + (Math.random() > 0.5 ? 1 : -1) + weathers.length) % weathers.length;
      set({ weather: weathers[nextIdx] });
    }

    set({ timeOfDay: newTime });
  },
  setWeather: (weather) => set({ weather }),
  buyBusiness: (id, name, cost, baseIncome) => set((state) => {
    if (state.money >= cost && !state.ownedBusinesses.find(b => b.id === id)) {
      const newBusiness: Business = { id, name, level: 1, baseIncome, upgradeCost: cost * 1.5 };
      const newState = { 
        money: state.money - cost, 
        ownedBusinesses: [...state.ownedBusinesses, newBusiness],
        reputation: state.reputation + 50
      };
      setTimeout(() => get().saveGame(), 0);
      return newState;
    }
    return state;
  }),
  upgradeBusiness: (id) => set((state) => {
    const business = state.ownedBusinesses.find(b => b.id === id);
    if (business && state.money >= business.upgradeCost) {
      const updatedBusinesses = state.ownedBusinesses.map(b => 
        b.id === id ? { ...b, level: b.level + 1, upgradeCost: b.upgradeCost * 1.5 } : b
      );
      const newState = {
        money: state.money - business.upgradeCost,
        ownedBusinesses: updatedBusinesses,
        reputation: state.reputation + 25
      };
      setTimeout(() => get().saveGame(), 0);
      return newState;
    }
    return state;
  }),
  collectPassiveIncome: () => set((state) => {
    const totalIncome = state.ownedBusinesses.reduce((acc, b) => acc + (b.baseIncome * b.level), 0);
    if (totalIncome > 0) {
      const newState = { money: state.money + totalIncome };
      setTimeout(() => get().saveGame(), 0);
      return newState;
    }
    return state;
  }),
  buyVehicle: (id, cost, stats) => set((state) => {
    if (state.money >= cost && !state.ownedVehicles.includes(id)) {
      const newState = { 
        money: state.money - cost, 
        ownedVehicles: [...state.ownedVehicles, id],
        vehicleStats: { ...state.vehicleStats, [id]: stats },
        currentVehicle: id
      };
      setTimeout(() => get().saveGame(), 0);
      return newState;
    }
    return state;
  }),
  upgradeVehicle: (id, stat, amount, cost) => set((state) => {
    if (state.money >= cost && state.vehicleStats[id]) {
      const currentStats = state.vehicleStats[id];
      const newStats = { ...currentStats, [stat]: (currentStats[stat] as number) + amount };
      const newState = {
        money: state.money - cost,
        vehicleStats: { ...state.vehicleStats, [id]: newStats as VehicleStats }
      };
      setTimeout(() => get().saveGame(), 0);
      return newState;
    }
    return state;
  }),
  buyProperty: (id, cost) => set((state) => {
    if (state.money >= cost && !state.ownedProperties.includes(id)) {
      const newState = {
        money: state.money - cost,
        ownedProperties: [...state.ownedProperties, id]
      };
      setTimeout(() => get().saveGame(), 0);
      return newState;
    }
    return state;
  }),
  enterInterior: (id) => set({ currentInterior: id }),
  setMission: (mission) => set({ activeMission: mission }),
  completeMission: () => set((state) => {
    if (!state.activeMission) return state;
    const mission = state.activeMission;
    const isMain = mission.type === 'main';
    
    const newState = {
      money: state.money + mission.reward,
      reputation: state.reputation + (isMain ? 100 : 25),
      xp: state.xp + (isMain ? 500 : 100),
      completedMissions: [...state.completedMissions, mission.id],
      activeMission: null,
      storyStep: isMain ? state.storyStep + 1 : state.storyStep
    };
    setTimeout(() => get().saveGame(), 0);
    return newState;
  }),
  setDistrict: (district) => set({ currentDistrict: district }),
  updateCustomization: (customization) => set((state) => ({
    characterCustomization: { ...state.characterCustomization, ...customization }
  })),
  advanceStory: () => set((state) => ({ storyStep: state.storyStep + 1 })),
  
  setRadioOn: (on) => set({ isRadioOn: on }),
  setRadioStation: (station) => set({ currentRadioStation: station }),

  improveSkill: (skill, amount) => set((state) => {
    const newLevel = state.skills[skill] + amount;
    const newState = { skills: { ...state.skills, [skill]: newLevel } };
    // Every 100 skill points, give a bonus
    if (Math.floor(newLevel / 100) > Math.floor(state.skills[skill] / 100)) {
      get().addNotification({ title: 'Skill Up!', message: `Your ${skill} skill is now level ${Math.floor(newLevel / 100)}`, type: 'info' });
    }
    return newState;
  }),

  updateAchievementProgress: (id, progress) => set((state) => {
    const updatedAchievements = state.achievements.map(a => {
      if (a.id === id && !a.completed) {
        const newProgress = Math.min(a.target, progress);
        const completed = newProgress >= a.target;
        if (completed) {
          if (a.reward.type === 'money') get().addMoney(a.reward.amount);
          if (a.reward.type === 'reputation') get().addReputation(a.reward.amount);
          if (a.reward.type === 'xp') get().addXP(a.reward.amount);
          get().addNotification({ title: 'Achievement Unlocked!', message: a.title, type: 'info' });
        }
        return { ...a, progress: newProgress, completed };
      }
      return a;
    });
    return { achievements: updatedAchievements };
  }),

  checkAchievements: () => {
    const state = get();
    state.updateAchievementProgress('rich_1', state.money);
    state.updateAchievementProgress('mission_1', state.completedMissions.length);
    state.updateAchievementProgress('vehicle_1', state.ownedVehicles.length);
    state.updateAchievementProgress('business_1', state.ownedBusinesses.length);
  },

  refreshDailyShop: () => {
    const today = new Date().toDateString();
    if (get().lastShopRefresh !== today) {
      const items: ShopItem[] = [
        { id: 'outfit_galabeya_gold', name: 'Golden Galabeya', price: 5000, type: 'outfit', image: '✨' },
        { id: 'skin_neon_car', name: 'Neon Car Wrap', price: 3000, type: 'skin', image: '🌈' },
        { id: 'acc_sunglasses', name: 'Aviator Shades', price: 500, type: 'accessory', image: '🕶️' },
        { id: 'outfit_suit', name: 'Business Suit', price: 2000, type: 'outfit', image: '👔' }
      ];
      // Shuffle and pick 3
      const shuffled = items.sort(() => 0.5 - Math.random()).slice(0, 3);
      set({ dailyShop: shuffled, lastShopRefresh: today });
    }
  },

  buyShopItem: (item) => set((state) => {
    if (state.money >= item.price && !state.inventory.includes(item.id)) {
      get().addNotification({ title: 'Purchase Successful', message: `Bought ${item.name}`, type: 'money' });
      return {
        money: state.money - item.price,
        inventory: [...state.inventory, item.id]
      };
    }
    return state;
  }),

  addLuckyBox: () => set((state) => ({ luckyBoxes: state.luckyBoxes + 1 })),
  triggerAd: (type) => {
    console.log(`Ad triggered: ${type}`);
  },
  openLuckyBox: () => set((state) => {
    if (state.luckyBoxes > 0) {
      const rewards = [
        { type: 'money', amount: 500, label: '$500' },
        { type: 'energy', amount: 50, label: '50 Energy' },
        { type: 'item', id: 'skin_neon_car', label: 'Neon Car Wrap' }
      ];
      const reward = rewards[Math.floor(Math.random() * rewards.length)];
      if (reward.type === 'money') get().addMoney(reward.amount);
      if (reward.type === 'energy') get().refillEnergy(reward.amount);
      if (reward.type === 'item') set({ inventory: [...state.inventory, reward.id] });
      
      get().addNotification({ title: 'Lucky Box Opened!', message: `You got ${reward.label}`, type: 'info' });
      return { luckyBoxes: state.luckyBoxes - 1 };
    }
    return state;
  }),

  refreshChallenges: () => {
    const today = new Date().toDateString();
    if (get().lastChallengeRefresh !== today) {
      set({
        dailyChallenges: [
          { id: 'c1', description: 'Complete 3 missions', progress: 0, target: 3, completed: false, reward: 500 },
          { id: 'c2', description: 'Earn $1000', progress: 0, target: 1000, completed: false, reward: 300 }
        ],
        lastChallengeRefresh: today
      });
    }
    
    const week = Math.floor(new Date().getTime() / (7 * 24 * 60 * 60 * 1000));
    if (get().lastWeeklyChallengeRefresh !== week.toString()) {
      set({
        weeklyChallenges: [
          { id: 'w1', description: 'Complete 20 missions', progress: 0, target: 20, completed: false, reward: 5000 },
          { id: 'w2', description: 'Earn $10000', progress: 0, target: 10000, completed: false, reward: 3000 }
        ],
        lastWeeklyChallengeRefresh: week.toString()
      });
    }
  },

  updateChallengeProgress: (id, progress) => set((state) => {
    const update = (challenges: any[]) => challenges.map(c => {
      if (c.id === id && !c.completed) {
        const newProgress = Math.min(c.target, progress);
        const completed = newProgress >= c.target;
        if (completed) {
          get().addMoney(c.reward);
          get().addNotification({ title: 'Challenge Completed!', message: `Reward: $${c.reward}`, type: 'money' });
        }
        return { ...c, progress: newProgress, completed };
      }
      return c;
    });
    return { 
      dailyChallenges: update(state.dailyChallenges),
      weeklyChallenges: update(state.weeklyChallenges)
    };
  }),
  
  login: (username) => set({ username, isLoggedIn: true }),
  logout: () => set({ username: null, isLoggedIn: false }),
  saveToCloud: () => {
    const state = get();
    // Mock cloud save
    localStorage.setItem(`haret_el_asatir_save_${state.username}`, JSON.stringify(state));
    alert("Game saved to cloud!");
  },
  loadFromCloud: () => {
    const state = get();
    const saved = localStorage.getItem(`haret_el_asatir_save_${state.username}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        set({ ...data });
        alert("Game loaded from cloud!");
      } catch (e) {
        console.error("Failed to load save game", e);
      }
    }
  },

  checkDailyReward: () => {
    const state = get();
    const today = new Date().toDateString();
    if (state.lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const streak = state.lastLogin === yesterday.toDateString() ? (state.loginStreak % 7) + 1 : 1;
      
      // 7-day cycle rewards
      const rewards = [100, 200, 300, 400, 500, 600, 2000]; // 7th day is special
      const reward = rewards[streak - 1];
      
      set({ 
        lastLogin: today, 
        loginStreak: streak,
        money: state.money + reward
      });
      get().saveGame();
      alert(`Daily Reward! Day ${streak} streak: +$${reward}`);
    }
  },
  
  addMessage: (msg) => set((state) => {
    const newMessage = { ...msg, id: Math.random().toString(36).substr(2, 9), date: new Date().toLocaleTimeString(), read: false };
    const newState = { messages: [newMessage, ...state.messages] };
    get().addNotification({ title: 'New Message', message: `From ${msg.sender}`, type: 'message' });
    setTimeout(() => get().saveGame(), 0);
    return newState;
  }),
  readMessage: (id) => set((state) => ({
    messages: state.messages.map(m => m.id === id ? { ...m, read: true } : m)
  })),
  addNotification: (notif) => set((state) => ({
    notifications: [{ ...notif, id: Math.random().toString(36).substr(2, 9), date: new Date().toLocaleTimeString() }, ...state.notifications]
  })),
  clearNotifications: () => set({ notifications: [] }),
  setActiveInteraction: (interaction) => set({ activeInteraction: interaction }),
  saveGame: () => {
    const state = get();
    const saveData = {
      playerName: state.playerName,
      hasIDCard: state.hasIDCard,
      idCard: state.idCard,
      money: state.money,
      reputation: state.reputation,
      energy: state.energy,
      health: state.health,
      level: state.level,
      xp: state.xp,
      ownedBusinesses: state.ownedBusinesses,
      ownedVehicles: state.ownedVehicles,
      ownedProperties: state.ownedProperties,
      vehicleStats: state.vehicleStats,
      completedMissions: state.completedMissions,
      storyStep: state.storyStep,
      characterCustomization: state.characterCustomization,
      messages: state.messages,
      notifications: state.notifications,
      lastLogin: state.lastLogin,
      loginStreak: state.loginStreak,
      skills: state.skills,
      achievements: state.achievements,
      inventory: state.inventory,
      luckyBoxes: state.luckyBoxes,
      dailyChallenges: state.dailyChallenges,
      weeklyChallenges: state.weeklyChallenges,
      username: state.username,
      isLoggedIn: state.isLoggedIn
    };
    localStorage.setItem('haret_el_asatir_save', JSON.stringify(saveData));
  },
  loadGame: () => {
    const saved = localStorage.getItem('haret_el_asatir_save');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        set({ ...data });
      } catch (e) {
        console.error("Failed to load save game", e);
      }
    }
  }
}));
