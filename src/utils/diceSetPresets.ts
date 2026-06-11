import { DiceSet, DiceAnimationPreset, SoundEffect } from '@/types';
import { generateId } from './diceData';

export const ANIMATION_PRESETS: DiceAnimationPreset[] = [
  {
    id: 'preset-classic',
    name: '经典旋转',
    animationName: 'dice-3d-roll',
    duration: 1500,
    easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
    description: '标准3D旋转，720度全方位翻滚',
  },
  {
    id: 'preset-bounce',
    name: '弹跳',
    animationName: 'dice-bounce-roll',
    duration: 1200,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    description: '骰子先弹跳再落下的物理感动画',
  },
  {
    id: 'preset-spiral',
    name: '螺旋',
    animationName: 'dice-spiral-roll',
    duration: 1800,
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    description: '螺旋上升后落下的梦幻动画',
  },
  {
    id: 'preset-fast',
    name: '极速',
    animationName: 'dice-fast-roll',
    duration: 800,
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
    description: '快速干脆的旋转效果',
  },
  {
    id: 'preset-magic',
    name: '魔法',
    animationName: 'dice-magic-roll',
    duration: 2000,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    description: '带有闪光粒子感的魔法动画',
  },
];

export const SOUND_EFFECTS: SoundEffect[] = [
  {
    id: 'sound-classic',
    name: '经典骰子声',
    type: 'sine',
    frequencyStart: 800,
    frequencyEnd: 400,
    duration: 0.3,
    volume: 0.3,
    description: '清脆的骰子滚动声',
  },
  {
    id: 'sound-gentle',
    name: '柔和风铃',
    type: 'sine',
    frequencyStart: 1200,
    frequencyEnd: 600,
    duration: 0.5,
    volume: 0.2,
    description: '轻柔的风铃音',
  },
  {
    id: 'sound-magic',
    name: '魔法粒子',
    type: 'triangle',
    frequencyStart: 400,
    frequencyEnd: 1600,
    duration: 0.4,
    volume: 0.25,
    description: '渐强的魔法音效',
  },
  {
    id: 'sound-deep',
    name: '低沉共鸣',
    type: 'sine',
    frequencyStart: 200,
    frequencyEnd: 100,
    duration: 0.6,
    volume: 0.35,
    description: '浑厚的低音效果',
  },
  {
    id: 'sound-crisp',
    name: '清脆撞击',
    type: 'square',
    frequencyStart: 1000,
    frequencyEnd: 200,
    duration: 0.15,
    volume: 0.25,
    description: '清脆的撞击声',
  },
  {
    id: 'sound-silent',
    name: '静音',
    type: 'sine',
    frequencyStart: 0,
    frequencyEnd: 0,
    duration: 0,
    volume: 0,
    description: '不播放任何音效',
  },
];

const defaultPlanetStyle = {
  gradientFrom: '#f59e0b',
  gradientTo: '#ea580c',
  borderColor: '#fbbf24',
  glowColor: '#fbbf24',
  symbolColor: '#ffffff',
};

const defaultSignStyle = {
  gradientFrom: '#8b5cf6',
  gradientTo: '#7c3aed',
  borderColor: '#a78bfa',
  glowColor: '#a78bfa',
  symbolColor: '#ffffff',
};

const defaultHouseStyle = {
  gradientFrom: '#3b82f6',
  gradientTo: '#0891b2',
  borderColor: '#60a5fa',
  glowColor: '#60a5fa',
  symbolColor: '#ffffff',
};

const nebulaPlanetStyle = {
  gradientFrom: '#ec4899',
  gradientTo: '#be185d',
  borderColor: '#f472b6',
  glowColor: '#f472b6',
  symbolColor: '#ffffff',
};

const nebulaSignStyle = {
  gradientFrom: '#06b6d4',
  gradientTo: '#0e7490',
  borderColor: '#22d3ee',
  glowColor: '#22d3ee',
  symbolColor: '#ffffff',
};

const nebulaHouseStyle = {
  gradientFrom: '#10b981',
  gradientTo: '#047857',
  borderColor: '#34d399',
  glowColor: '#34d399',
  symbolColor: '#ffffff',
};

const auroraPlanetStyle = {
  gradientFrom: '#14b8a6',
  gradientTo: '#0d9488',
  borderColor: '#2dd4bf',
  glowColor: '#2dd4bf',
  symbolColor: '#fef3c7',
};

const auroraSignStyle = {
  gradientFrom: '#a855f7',
  gradientTo: '#9333ea',
  borderColor: '#c084fc',
  glowColor: '#c084fc',
  symbolColor: '#fef3c7',
};

const auroraHouseStyle = {
  gradientFrom: '#f97316',
  gradientTo: '#ea580c',
  borderColor: '#fb923c',
  glowColor: '#fb923c',
  symbolColor: '#fef3c7',
};

const midnightPlanetStyle = {
  gradientFrom: '#1e293b',
  gradientTo: '#0f172a',
  borderColor: '#475569',
  glowColor: '#64748b',
  symbolColor: '#f1f5f9',
};

const midnightSignStyle = {
  gradientFrom: '#312e81',
  gradientTo: '#1e1b4b',
  borderColor: '#6366f1',
  glowColor: '#818cf8',
  symbolColor: '#c7d2fe',
};

const midnightHouseStyle = {
  gradientFrom: '#4c1d95',
  gradientTo: '#2e1065',
  borderColor: '#7c3aed',
  glowColor: '#a78bfa',
  symbolColor: '#ddd6fe',
};

const goldPlanetStyle = {
  gradientFrom: '#fbbf24',
  gradientTo: '#d97706',
  borderColor: '#fde047',
  glowColor: '#facc15',
  symbolColor: '#78350f',
};

const goldSignStyle = {
  gradientFrom: '#f59e0b',
  gradientTo: '#b45309',
  borderColor: '#fcd34d',
  glowColor: '#eab308',
  symbolColor: '#713f12',
};

const goldHouseStyle = {
  gradientFrom: '#eab308',
  gradientTo: '#a16207',
  borderColor: '#fde68a',
  glowColor: '#f59e0b',
  symbolColor: '#78350f',
};

export const DEFAULT_DICE_SETS: DiceSet[] = [
  {
    id: 'set-classic',
    name: '经典占星',
    description: '原始的占星骰子配色，金紫蓝三色代表行星、星座、宫位',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: true,
    planetStyle: defaultPlanetStyle,
    signStyle: defaultSignStyle,
    houseStyle: defaultHouseStyle,
    animationPreset: ANIMATION_PRESETS[0],
    rollSound: SOUND_EFFECTS[0],
    stopSound: SOUND_EFFECTS[4],
    size: 'lg',
  },
  {
    id: 'set-nebula',
    name: '星云幻境',
    description: '粉青翠绿的梦幻配色，如星云般绚丽',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: false,
    planetStyle: nebulaPlanetStyle,
    signStyle: nebulaSignStyle,
    houseStyle: nebulaHouseStyle,
    animationPreset: ANIMATION_PRESETS[2],
    rollSound: SOUND_EFFECTS[2],
    stopSound: SOUND_EFFECTS[1],
    size: 'lg',
  },
  {
    id: 'set-aurora',
    name: '极光之夜',
    description: '翠紫橙的极光配色，灵感来自北极光',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: false,
    planetStyle: auroraPlanetStyle,
    signStyle: auroraSignStyle,
    houseStyle: auroraHouseStyle,
    animationPreset: ANIMATION_PRESETS[4],
    rollSound: SOUND_EFFECTS[1],
    stopSound: SOUND_EFFECTS[2],
    size: 'lg',
  },
  {
    id: 'set-midnight',
    name: '午夜幽蓝',
    description: '深蓝暗紫的深夜风格，静谧神秘',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: false,
    planetStyle: midnightPlanetStyle,
    signStyle: midnightSignStyle,
    houseStyle: midnightHouseStyle,
    animationPreset: ANIMATION_PRESETS[1],
    rollSound: SOUND_EFFECTS[3],
    stopSound: SOUND_EFFECTS[0],
    size: 'lg',
  },
  {
    id: 'set-gold',
    name: '黄金时代',
    description: '全金色的高贵风格，象征光明与财富',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: false,
    planetStyle: goldPlanetStyle,
    signStyle: goldSignStyle,
    houseStyle: goldHouseStyle,
    animationPreset: ANIMATION_PRESETS[0],
    rollSound: SOUND_EFFECTS[0],
    stopSound: SOUND_EFFECTS[4],
    size: 'lg',
  },
];

export function createDefaultDiceSet(): DiceSet {
  return {
    id: generateId(),
    name: '我的骰子套装',
    description: '创建属于你的专属骰子套装',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: false,
    planetStyle: { ...defaultPlanetStyle },
    signStyle: { ...defaultSignStyle },
    houseStyle: { ...defaultHouseStyle },
    animationPreset: ANIMATION_PRESETS[0],
    rollSound: SOUND_EFFECTS[0],
    stopSound: SOUND_EFFECTS[4],
    size: 'lg',
  };
}

export const COLOR_PALETTES = [
  { name: '暖色系', colors: ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e'] },
  { name: '冷色系', colors: ['#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899'] },
  { name: '大地色', colors: ['#78350f', '#92400e', '#713f12', '#365314', '#166534', '#14532d'] },
  { name: '金属色', colors: ['#fbbf24', '#f59e0b', '#d97706', '#9ca3af', '#6b7280', '#4b5563'] },
  { name: '梦幻色', colors: ['#fbcfe8', '#e9d5ff', '#c7d2fe', '#bae6fd', '#a7f3d0', '#fef9c3'] },
  { name: '深色调', colors: ['#1e293b', '#312e81', '#4c1d95', '#831843', '#7f1d1d', '#78350f'] },
];
