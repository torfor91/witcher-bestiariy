export interface Creature {
  id: string;
  name: string;
  className: string; // e.g., Necrophage, Relict
  description: string;
  weaknesses: string[];
  imageUrl: string;
  threatLevel: number; // 1-5 skulls
}

export interface Legend {
  id: string;
  title: string;
  region: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export enum ViewState {
  BESTIARY = 'BESTIARY',
  LEGENDS = 'LEGENDS',
  CONTRACTS = 'CONTRACTS',
  CREATURE_DETAIL = 'CREATURE_DETAIL',
  GERALT = 'GERALT'
}