// src/types/Item.ts

export interface Item {
  id: string;
  name: string;
  thumbnail: string;
  filename: string | string[];
  color: string;
  rarity: string;
  owner: string;
  type: string;
  count: number;
}

export type CrateLevel = 'level1' | 'level2' | 'level3'; 