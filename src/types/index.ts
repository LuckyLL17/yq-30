export interface Planet {
  name: string;
  symbol: string;
  meaning: string;
}

export interface Sign {
  name: string;
  symbol: string;
  element: string;
  modality: string;
  meaning: string;
}

export interface House {
  number: number;
  name: string;
  meaning: string;
}

export interface DiceResult {
  planet: Planet;
  sign: Sign;
  house: House;
}

export interface DiceRecord {
  id: string;
  planet: string;
  sign: string;
  house: number;
  question: string;
  questionType: string;
  notes: string;
  timestamp: string;
}

export interface QuestionType {
  id: string;
  name: string;
  color: string;
}

export interface FrequencyStats {
  planet: Record<string, number>;
  sign: Record<string, number>;
  house: Record<number, number>;
}

export interface CombinationItem {
  count: number;
  percentage: number;
}

export interface PlanetSignCombination extends CombinationItem {
  planet: string;
  sign: string;
}

export interface PlanetHouseCombination extends CombinationItem {
  planet: string;
  house: number;
}

export interface SignHouseCombination extends CombinationItem {
  sign: string;
  house: number;
}

export interface TripleCombination extends CombinationItem {
  planet: string;
  sign: string;
  house: number;
}

export interface CombinationStats {
  planetSign: PlanetSignCombination[];
  planetHouse: PlanetHouseCombination[];
  signHouse: SignHouseCombination[];
  triple: TripleCombination[];
}

export interface TypeDistribution {
  [questionType: string]: {
    planet: Record<string, number>;
    sign: Record<string, number>;
    house: Record<number, number>;
    count: number;
  };
}

export interface ChartDataItem {
  name: string;
  value: number;
  percentage: string;
}

export interface DailyFortune {
  id: string;
  date: string;
  planet: string;
  sign: string;
  house: number;
  keyword: string;
  advice: string;
  luckyIndex: number;
  luckyColor: string;
  luckyNumber: number;
  timestamp: string;
}

export interface DailyCheckInStats {
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  lastCheckInDate: string | null;
}

export interface DiceVisualStyle {
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  glowColor: string;
  symbolColor: string;
}

export interface DiceAnimationPreset {
  id: string;
  name: string;
  animationName: string;
  duration: number;
  easing: string;
  description: string;
}

export interface SoundEffect {
  id: string;
  name: string;
  type: 'sine' | 'square' | 'sawtooth' | 'triangle';
  frequencyStart: number;
  frequencyEnd: number;
  duration: number;
  volume: number;
  description: string;
}

export interface DiceSet {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  planetStyle: DiceVisualStyle;
  signStyle: DiceVisualStyle;
  houseStyle: DiceVisualStyle;
  animationPreset: DiceAnimationPreset;
  rollSound: SoundEffect;
  stopSound: SoundEffect;
  size: 'sm' | 'md' | 'lg';
}
