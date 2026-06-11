import { Planet, Sign, House, QuestionType, DiceResult } from '@/types';

export const PLANETS: Planet[] = [
  { name: '太阳', symbol: '☉', meaning: '自我、生命力、创造力' },
  { name: '月亮', symbol: '☽', meaning: '情感、直觉、内心世界' },
  { name: '水星', symbol: '☿', meaning: '思维、沟通、学习' },
  { name: '金星', symbol: '♀', meaning: '爱情、美、价值观' },
  { name: '火星', symbol: '♂', meaning: '行动、欲望、竞争力' },
  { name: '木星', symbol: '♃', meaning: '扩张、幸运、智慧' },
  { name: '土星', symbol: '♄', meaning: '责任、限制、成熟' },
  { name: '天王星', symbol: '♅', meaning: '变革、创新、独特性' },
  { name: '海王星', symbol: '♆', meaning: '梦想、灵感、灵性' },
  { name: '冥王星', symbol: '♇', meaning: '转化、死亡与重生、权力' },
  { name: '北交点', symbol: '☊', meaning: '灵魂方向、成长路径' },
  { name: '南交点', symbol: '☋', meaning: '过去世、惯性模式' },
];

export const SIGNS: Sign[] = [
  { name: '白羊座', symbol: '♈', element: '火', modality: '开创', meaning: '主动、勇敢、开创' },
  { name: '金牛座', symbol: '♉', element: '土', modality: '固定', meaning: '稳定、物质、感官' },
  { name: '双子座', symbol: '♊', element: '风', modality: '变动', meaning: '沟通、灵活、好奇' },
  { name: '巨蟹座', symbol: '♋', element: '水', modality: '开创', meaning: '情感、保护、家庭' },
  { name: '狮子座', symbol: '♌', element: '火', modality: '固定', meaning: '自信、创造、领导' },
  { name: '处女座', symbol: '♍', element: '土', modality: '变动', meaning: '分析、服务、完美' },
  { name: '天秤座', symbol: '♎', element: '风', modality: '开创', meaning: '平衡、和谐、关系' },
  { name: '天蝎座', symbol: '♏', element: '水', modality: '固定', meaning: '深度、转化、权力' },
  { name: '射手座', symbol: '♐', element: '火', modality: '变动', meaning: '探索、自由、哲学' },
  { name: '摩羯座', symbol: '♑', element: '土', modality: '开创', meaning: '责任、成就、结构' },
  { name: '水瓶座', symbol: '♒', element: '风', modality: '固定', meaning: '创新、人道、独立' },
  { name: '双鱼座', symbol: '♓', element: '水', modality: '变动', meaning: '灵性、梦想、奉献' },
];

export const HOUSES: House[] = [
  { number: 1, name: '第一宫', meaning: '自我、外表、第一印象' },
  { number: 2, name: '第二宫', meaning: '金钱、物质、价值观' },
  { number: 3, name: '第三宫', meaning: '沟通、学习、短途旅行' },
  { number: 4, name: '第四宫', meaning: '家庭、根源、内心安全感' },
  { number: 5, name: '第五宫', meaning: '创造、娱乐、恋爱' },
  { number: 6, name: '第六宫', meaning: '健康、工作、日常事务' },
  { number: 7, name: '第七宫', meaning: '伴侣、合作、重要他人' },
  { number: 8, name: '第八宫', meaning: '转化、共享资源、性' },
  { number: 9, name: '第九宫', meaning: '高等教育、哲学、长途旅行' },
  { number: 10, name: '第十宫', meaning: '事业、社会地位、成就' },
  { number: 11, name: '第十一宫', meaning: '朋友、团体、理想' },
  { number: 12, name: '第十二宫', meaning: '潜意识、灵性、隐藏的事' },
];

export const DEFAULT_QUESTION_TYPES: QuestionType[] = [
  { id: '1', name: '爱情', color: '#ec4899' },
  { id: '2', name: '事业', color: '#3b82f6' },
  { id: '3', name: '财运', color: '#f59e0b' },
  { id: '4', name: '健康', color: '#10b981' },
  { id: '5', name: '人际', color: '#8b5cf6' },
  { id: '6', name: '其他', color: '#6b7280' },
];

export function getPlanetByName(name: string): Planet | undefined {
  return PLANETS.find(p => p.name === name);
}

export function getSignByName(name: string): Sign | undefined {
  return SIGNS.find(s => s.name === name);
}

export function getHouseByNumber(number: number): House | undefined {
  return HOUSES.find(h => h.number === number);
}

export function rollDice(): DiceResult {
  const planet = PLANETS[Math.floor(Math.random() * PLANETS.length)];
  const sign = SIGNS[Math.floor(Math.random() * SIGNS.length)];
  const house = HOUSES[Math.floor(Math.random() * HOUSES.length)];
  return { planet, sign, house };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
