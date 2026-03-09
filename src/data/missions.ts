export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  district: 'Old Neighborhood' | 'The Souq' | 'Industrial Zone' | 'Palm Heights';
  type: 'main' | 'side';
  objective: string;
  targetPos: [number, number, number];
  unlockLevel: number;
  storyStep?: number;
}

export const MAIN_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'New Beginnings',
    description: 'Welcome to Haret El Asatir. Talk to the Coffee Shop Owner to get started.',
    reward: 200,
    district: 'Old Neighborhood',
    type: 'main',
    objective: 'Talk to the Coffee Shop Owner',
    targetPos: [10, 0, 10],
    unlockLevel: 1,
    storyStep: 0
  },
  {
    id: 'm2',
    title: 'The First Hustle',
    description: 'Deliver a package to the local bakery in the Old Neighborhood.',
    reward: 300,
    district: 'Old Neighborhood',
    type: 'main',
    objective: 'Deliver Package',
    targetPos: [-15, 0, 5],
    unlockLevel: 1,
    storyStep: 1
  },
  {
    id: 'm3',
    title: 'Market Expansion',
    description: 'The Souq is where the real money is. Visit the market and talk to the merchant.',
    reward: 500,
    district: 'The Souq',
    type: 'main',
    objective: 'Visit The Souq Merchant',
    targetPos: [20, 0, -20],
    unlockLevel: 2,
    storyStep: 2
  },
  {
    id: 'm4',
    title: 'Industrial Ambition',
    description: 'The Industrial Zone needs workers. Check out the factory.',
    reward: 1000,
    district: 'Industrial Zone',
    type: 'main',
    objective: 'Visit the Factory',
    targetPos: [-30, 0, -30],
    unlockLevel: 3,
    storyStep: 3
  },
  {
    id: 'm5',
    title: 'The Elite Circle',
    description: 'You are making a name for yourself. Visit Palm Heights.',
    reward: 2000,
    district: 'Palm Heights',
    type: 'main',
    objective: 'Visit Palm Heights Plaza',
    targetPos: [40, 0, 40],
    unlockLevel: 5,
    storyStep: 4
  }
];

export const SIDE_MISSIONS: Mission[] = [
  {
    id: 's1',
    title: 'Quick Delivery',
    description: 'Deliver some fresh bread to a neighbor.',
    reward: 50,
    district: 'Old Neighborhood',
    type: 'side',
    objective: 'Deliver Bread',
    targetPos: [5, 0, -15],
    unlockLevel: 1
  },
  {
    id: 's2',
    title: 'Street Repair',
    description: 'Fix a broken bench in the park.',
    reward: 75,
    district: 'Old Neighborhood',
    type: 'side',
    objective: 'Repair Bench',
    targetPos: [-10, 0, -10],
    unlockLevel: 1
  },
  {
    id: 's3',
    title: 'Souq Helper',
    description: 'Help a merchant organize their stall.',
    reward: 100,
    district: 'The Souq',
    type: 'side',
    objective: 'Organize Stall',
    targetPos: [25, 0, -15],
    unlockLevel: 2
  }
];
