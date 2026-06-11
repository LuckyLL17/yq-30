import { Planet, Sign, House, QuestionType, DiceResult, DailyFortune } from '@/types';

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

export function formatDateShort(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
  });
}

export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

const FORTUNE_KEYWORDS: Record<string, string[]> = {
  '太阳': ['活力四射', '光芒万丈', '自信满满', '领导力', '创造力迸发', '备受瞩目'],
  '月亮': ['内心平和', '情感丰富', '直觉敏锐', '温柔以待', '思绪万千', '感性时刻'],
  '水星': ['思维敏捷', '沟通顺畅', '学习运佳', '灵感涌现', '表达清晰', '逻辑清晰'],
  '金星': ['魅力四射', '桃花朵朵', '审美提升', '甜蜜时光', '人缘极佳', '美好邂逅'],
  '火星': ['行动力强', '斗志昂扬', '充满激情', '勇往直前', '能量充沛', '果断坚决'],
  '木星': ['好运连连', '贵人相助', '扩张机遇', '智慧增长', '顺风顺水', '收获满满'],
  '土星': ['脚踏实地', '厚积薄发', '责任担当', '稳步前行', '自律成长', '稳重求进'],
  '天王星': ['惊喜不断', '创新突破', '意料之外', '独树一帜', '变革契机', '灵光乍现'],
  '海王星': ['灵感迸发', '梦幻浪漫', '艺术气息', '灵性提升', '梦境指引', '想象力丰富'],
  '冥王星': ['深度蜕变', '重生力量', '内在觉醒', '转化契机', '探本溯源', '凤凰涅槃'],
  '北交点': ['方向明朗', '成长机遇', '灵魂课题', '进化之路', '使命召唤', '前行方向'],
  '南交点': ['回顾过往', '释放旧习', '整合经验', '放下执念', '疗愈过去', '内在智慧'],
};

const FORTUNE_ADVICES: Record<string, string[]> = {
  '太阳': ['今天适合展现自己的才华，让别人看到你的光芒。', '保持自信，你比想象中更有力量。', '多晒太阳，补充能量，心情会更好。'],
  '月亮': ['关注内心感受，给自己一些独处的时间。', '今天适合与家人朋友相聚，分享情感。', '注意休息，照顾好自己的情绪。'],
  '水星': ['今天适合学习新技能，大脑运转特别快。', '重要的沟通不妨安排在今天，表达会更顺畅。', '写点什么记录灵感，别让好点子溜走。'],
  '金星': ['今天适合打扮自己，展现独特魅力。', '可以约喜欢的人见面，气氛会很融洽。', '用审美眼光发现生活中的小美好。'],
  '火星': ['今天行动力爆棚，适合推进拖延的事情。', '运动起来吧，释放多余的能量。', '勇敢追求你想要的，别犹豫。'],
  '木星': ['今天运气不错，可以试试新的机会。', '保持乐观，好事正在向你走来。', '适合做长远规划，视野会更开阔。'],
  '土星': ['踏实做好每一件事，回报会慢慢到来。', '今天适合处理繁琐的事务，耐心会有回报。', '给自己设定小目标，一步一步实现。'],
  '天王星': ['保持开放的心态，惊喜可能就在转角。', '今天适合尝试新鲜事物，打破常规。', '灵感来了就抓住，说不定是个好创意。'],
  '海王星': ['今天适合冥想、听音乐，滋养灵魂。', '关注你的梦境，也许藏着重要的讯息。', '让想象力飞一会儿，别太理性了。'],
  '冥王星': ['今天适合深度思考，洞察事物本质。', '放下那些不再服务于你的人和事。', '内心的力量正在觉醒，相信自己。'],
  '北交点': ['今天是朝着人生目标前进的好日子。', '拥抱变化，成长就在舒适区之外。', '听听内心的声音，那是你的方向。'],
  '南交点': ['回顾过去，看看你已经成长了多少。', '释放旧的模式，才能迎接新的可能。', '今天适合整理和清理，无论是物品还是情绪。'],
};

const LUCKY_COLORS = [
  '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981',
  '#f97316', '#06b6d4', '#6366f1', '#14b8a6', '#eab308',
  '#a855f7', '#22c55e',
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function generateDailyFortune(date: string): DailyFortune {
  const seed = hashString(date);
  const random = seededRandom(seed);

  const planetIndex = Math.floor(random() * PLANETS.length);
  const signIndex = Math.floor(random() * SIGNS.length);
  const houseIndex = Math.floor(random() * HOUSES.length);

  const planet = PLANETS[planetIndex];
  const sign = SIGNS[signIndex];
  const house = HOUSES[houseIndex];

  const keywords = FORTUNE_KEYWORDS[planet.name] || ['好运将至'];
  const advices = FORTUNE_ADVICES[planet.name] || ['保持好心态，迎接新的一天。'];

  const keywordIndex = Math.floor(random() * keywords.length);
  const adviceIndex = Math.floor(random() * advices.length);

  const luckyIndex = Math.floor(random() * 31) + 70;
  const luckyColorIndex = Math.floor(random() * LUCKY_COLORS.length);
  const luckyNumber = Math.floor(random() * 9) + 1;

  return {
    id: date,
    date,
    planet: planet.name,
    sign: sign.name,
    house: house.number,
    keyword: keywords[keywordIndex],
    advice: advices[adviceIndex],
    luckyIndex,
    luckyColor: LUCKY_COLORS[luckyColorIndex],
    luckyNumber,
    timestamp: new Date(date).toISOString(),
  };
}

export function isTodayCheckedIn(records: DailyFortune[]): boolean {
  const today = getTodayDateString();
  return records.some(r => r.date === today);
}

export function calculateStreak(records: DailyFortune[]): { currentStreak: number; longestStreak: number } {
  if (records.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sortedDates = records
    .map(r => r.date)
    .sort()
    .reverse();

  const today = getTodayDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getDateString(yesterday);

  let currentStreak = 0;
  if (sortedDates.includes(today) || sortedDates.includes(yesterdayStr)) {
    let checkDate = new Date(sortedDates[0]);
    currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(checkDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDateStr = getDateString(prevDate);

      if (sortedDates[i] === prevDateStr) {
        currentStreak++;
        checkDate = prevDate;
      } else {
        break;
      }
    }

    if (!sortedDates.includes(today)) {
      currentStreak = 0;
    }
  }

  let longestStreak = 0;
  let tempStreak = 1;
  const sortedAsc = [...sortedDates].sort();

  for (let i = 1; i < sortedAsc.length; i++) {
    const prevDate = new Date(sortedAsc[i - 1]);
    const currDate = new Date(sortedAsc[i]);
    const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { currentStreak, longestStreak };
}
