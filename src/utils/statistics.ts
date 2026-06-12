import {
  DiceRecord,
  FrequencyStats,
  CombinationStats,
  PlanetSignCombination,
  PlanetHouseCombination,
  SignHouseCombination,
  TripleCombination,
  TypeDistribution,
  ChartDataItem,
  RollCountStats,
  RollCountDaily,
  TimeDistributionStats,
  TimeSlotDistribution,
  HeatmapData,
  HeatmapCell,
  AnalysisReport,
} from '@/types';
import { PLANETS, SIGNS, HOUSES } from './diceData';

export function calculateFrequency(records: DiceRecord[]): FrequencyStats {
  const planet: Record<string, number> = {};
  const sign: Record<string, number> = {};
  const house: Record<number, number> = {};

  PLANETS.forEach(p => planet[p.name] = 0);
  SIGNS.forEach(s => sign[s.name] = 0);
  HOUSES.forEach(h => house[h.number] = 0);

  records.forEach(record => {
    planet[record.planet] = (planet[record.planet] || 0) + 1;
    sign[record.sign] = (sign[record.sign] || 0) + 1;
    house[record.house] = (house[record.house] || 0) + 1;
  });

  return { planet, sign, house };
}

export function calculateCombinations(records: DiceRecord[]): CombinationStats {
  const total = records.length;
  const planetSignMap = new Map<string, PlanetSignCombination>();
  const planetHouseMap = new Map<string, PlanetHouseCombination>();
  const signHouseMap = new Map<string, SignHouseCombination>();
  const tripleMap = new Map<string, TripleCombination>();

  records.forEach(record => {
    const psKey = `${record.planet}-${record.sign}`;
    const phKey = `${record.planet}-${record.house}`;
    const shKey = `${record.sign}-${record.house}`;
    const tripleKey = `${record.planet}-${record.sign}-${record.house}`;

    if (!planetSignMap.has(psKey)) {
      planetSignMap.set(psKey, { planet: record.planet, sign: record.sign, count: 0, percentage: 0 });
    }
    const ps = planetSignMap.get(psKey)!;
    ps.count++;
    ps.percentage = total > 0 ? (ps.count / total) * 100 : 0;

    if (!planetHouseMap.has(phKey)) {
      planetHouseMap.set(phKey, { planet: record.planet, house: record.house, count: 0, percentage: 0 });
    }
    const ph = planetHouseMap.get(phKey)!;
    ph.count++;
    ph.percentage = total > 0 ? (ph.count / total) * 100 : 0;

    if (!signHouseMap.has(shKey)) {
      signHouseMap.set(shKey, { sign: record.sign, house: record.house, count: 0, percentage: 0 });
    }
    const sh = signHouseMap.get(shKey)!;
    sh.count++;
    sh.percentage = total > 0 ? (sh.count / total) * 100 : 0;

    if (!tripleMap.has(tripleKey)) {
      tripleMap.set(tripleKey, { planet: record.planet, sign: record.sign, house: record.house, count: 0, percentage: 0 });
    }
    const triple = tripleMap.get(tripleKey)!;
    triple.count++;
    triple.percentage = total > 0 ? (triple.count / total) * 100 : 0;
  });

  const sortByCountDesc = (a: { count: number }, b: { count: number }) => b.count - a.count;

  return {
    planetSign: Array.from(planetSignMap.values()).sort(sortByCountDesc).slice(0, 10),
    planetHouse: Array.from(planetHouseMap.values()).sort(sortByCountDesc).slice(0, 10),
    signHouse: Array.from(signHouseMap.values()).sort(sortByCountDesc).slice(0, 10),
    triple: Array.from(tripleMap.values()).sort(sortByCountDesc).slice(0, 10),
  };
}

export function calculateTypeDistribution(records: DiceRecord[]): TypeDistribution {
  const distribution: TypeDistribution = {};

  records.forEach(record => {
    const type = record.questionType || '未分类';
    if (!distribution[type]) {
      distribution[type] = {
        planet: {},
        sign: {},
        house: {},
        count: 0,
      };
      PLANETS.forEach(p => distribution[type].planet[p.name] = 0);
      SIGNS.forEach(s => distribution[type].sign[s.name] = 0);
      HOUSES.forEach(h => distribution[type].house[h.number] = 0);
    }
    distribution[type].count++;
    distribution[type].planet[record.planet]++;
    distribution[type].sign[record.sign]++;
    distribution[type].house[record.house]++;
  });

  return distribution;
}

export function getTopItems(freq: Record<string | number, number>, topN: number = 5): Array<{ name: string; value: number }> {
  return Object.entries(freq)
    .map(([name, value]) => ({ name: String(name), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);
}

export function toChartData(freq: Record<string | number, number>, total: number): ChartDataItem[] {
  return Object.entries(freq)
    .map(([name, value]) => ({
      name: String(name),
      value,
      percentage: total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%',
    }))
    .sort((a, b) => b.value - a.value);
}

export function getElementDistribution(records: DiceRecord[]): ChartDataItem[] {
  const elementMap: Record<string, number> = { '火': 0, '土': 0, '风': 0, '水': 0 };
  
  records.forEach(record => {
    const sign = SIGNS.find(s => s.name === record.sign);
    if (sign) {
      elementMap[sign.element] = (elementMap[sign.element] || 0) + 1;
    }
  });

  const total = records.length;
  return Object.entries(elementMap).map(([name, value]) => ({
    name: name + '象',
    value,
    percentage: total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%',
  }));
}

export function getModalityDistribution(records: DiceRecord[]): ChartDataItem[] {
  const modalityMap: Record<string, number> = { '开创': 0, '固定': 0, '变动': 0 };
  
  records.forEach(record => {
    const sign = SIGNS.find(s => s.name === record.sign);
    if (sign) {
      modalityMap[sign.modality] = (modalityMap[sign.modality] || 0) + 1;
    }
  });

  const total = records.length;
  return Object.entries(modalityMap).map(([name, value]) => ({
    name,
    value,
    percentage: total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%',
  }));
}

export function calculateRollCounts(records: DiceRecord[]): RollCountStats {
  const dailyMap = new Map<string, number>();

  records.forEach(record => {
    const date = record.timestamp.slice(0, 10);
    dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
  });

  const daily: RollCountDaily[] = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalDays = daily.length;
  const totalRolls = records.length;
  const avgRollsPerDay = totalDays > 0 ? Math.round((totalRolls / totalDays) * 10) / 10 : 0;

  const maxRollsDay = daily.length > 0
    ? daily.reduce((max, cur) => cur.count > max.count ? cur : max, daily[0])
    : null;

  let currentStreak = 0;
  if (daily.length > 0) {
    const today = new Date().toISOString().slice(0, 10);
    const sortedDesc = [...daily].sort((a, b) => b.date.localeCompare(a.date));
    const checkDate = new Date(today);
    for (const entry of sortedDesc) {
      const entryDateStr = checkDate.toISOString().slice(0, 10);
      if (entry.date === entryDateStr) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (entry.date < entryDateStr) {
        break;
      }
    }
  }

  return { daily, totalDays, totalRolls, avgRollsPerDay, maxRollsDay, currentStreak };
}

const TIME_SLOTS: Array<{ slot: string; label: string; range: [number, number] }> = [
  { slot: 'dawn', label: '凌晨 (0-6时)', range: [0, 5] },
  { slot: 'morning', label: '上午 (6-12时)', range: [6, 11] },
  { slot: 'afternoon', label: '下午 (12-18时)', range: [12, 17] },
  { slot: 'evening', label: '晚上 (18-24时)', range: [18, 23] },
];

export function calculateTimeDistribution(records: DiceRecord[]): TimeDistributionStats {
  const hourly: Array<{ hour: number; count: number }> = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));

  const slotCounts: Record<string, number> = {};
  TIME_SLOTS.forEach(s => slotCounts[s.slot] = 0);

  records.forEach(record => {
    const date = new Date(record.timestamp);
    const hour = date.getHours();
    hourly[hour].count++;

    for (const ts of TIME_SLOTS) {
      if (hour >= ts.range[0] && hour <= ts.range[1]) {
        slotCounts[ts.slot]++;
        break;
      }
    }
  });

  const total = records.length;
  const slots: TimeSlotDistribution[] = TIME_SLOTS.map(ts => ({
    slot: ts.slot,
    label: ts.label,
    count: slotCounts[ts.slot],
    percentage: total > 0 ? ((slotCounts[ts.slot] / total) * 100).toFixed(1) + '%' : '0%',
  }));

  const peakHourEntry = hourly.reduce((max, cur) => cur.count > max.count ? cur : max, hourly[0]);
  const peakHour = peakHourEntry.count > 0 ? peakHourEntry.hour : null;

  const peakSlot = slots.reduce((max, cur) => cur.count > max.count ? cur : max, slots[0]);
  const peakSlotResult = peakSlot.count > 0 ? peakSlot : null;

  return { hourly, slots, peakHour, peakSlot: peakSlotResult };
}

export function calculateHeatmapData(records: DiceRecord[]): HeatmapData[] {
  const planetNames = PLANETS.map(p => p.name);
  const signNames = SIGNS.map(s => s.name);
  const houseLabels = HOUSES.map(h => String(h.number));

  const buildHeatmap = (
    title: string,
    rowLabels: string[],
    colLabels: string[],
    getRow: (r: DiceRecord) => string,
    getCol: (r: DiceRecord) => string,
  ): HeatmapData => {
    const cellMap = new Map<string, number>();
    rowLabels.forEach(row => {
      colLabels.forEach(col => {
        cellMap.set(`${row}-${col}`, 0);
      });
    });

    records.forEach(record => {
      const row = getRow(record);
      const col = getCol(record);
      const key = `${row}-${col}`;
      cellMap.set(key, (cellMap.get(key) || 0) + 1);
    });

    const cells: HeatmapCell[] = [];
    let maxValue = 0;
    cellMap.forEach((value, key) => {
      const [row, col] = key.split('-');
      cells.push({ row, col, value });
      if (value > maxValue) maxValue = value;
    });

    return { title, rowLabels, colLabels, cells, maxValue };
  };

  return [
    buildHeatmap('行星 × 星座', planetNames, signNames, r => r.planet, r => r.sign),
    buildHeatmap('行星 × 宫位', planetNames, houseLabels, r => r.planet, r => String(r.house)),
    buildHeatmap('星座 × 宫位', signNames, houseLabels, r => r.sign, r => String(r.house)),
  ];
}

export function generateAnalysisReport(
  records: DiceRecord[],
  frequency: FrequencyStats,
  combinations: CombinationStats,
  rollCounts: RollCountStats,
  timeDist: TimeDistributionStats,
): AnalysisReport {
  const total = records.length;
  const generatedAt = new Date().toLocaleString('zh-CN');

  const summary = `共记录 ${total} 次占卜，跨越 ${rollCounts.totalDays} 天，平均每日 ${rollCounts.avgRollsPerDay} 次。`
    + (timeDist.peakSlot ? `投掷高峰时段为${timeDist.peakSlot.label}。` : '');

  const sections: Array<{ title: string; content: string }> = [];

  {
    const topPlanet = Object.entries(frequency.planet).sort((a, b) => b[1] - a[1])[0];
    const topSign = Object.entries(frequency.sign).sort((a, b) => b[1] - a[1])[0];
    const topHouse = Object.entries(frequency.house).sort((a, b) => b[1] - a[1])[0];
    sections.push({
      title: '核心频率',
      content: `出现最多的行星是${topPlanet?.[0] || '-'}（${topPlanet?.[1] || 0}次），`
        + `星座是${topSign?.[0] || '-'}（${topSign?.[1] || 0}次），`
        + `宫位是第${topHouse?.[0] || '-'}宫（${topHouse?.[1] || 0}次）。`,
    });
  }

  if (combinations.triple.length > 0) {
    const top = combinations.triple[0];
    sections.push({
      title: '最强组合',
      content: `最高频完整组合为 ${top.planet} + ${top.sign} + 第${top.house}宫，出现 ${top.count} 次（${top.percentage.toFixed(1)}%）。`,
    });
  }

  if (rollCounts.maxRollsDay) {
    sections.push({
      title: '投掷活跃度',
      content: `最活跃的一天是 ${rollCounts.maxRollsDay.date}，共投掷 ${rollCounts.maxRollsDay.count} 次。当前连续投掷天数为 ${rollCounts.currentStreak} 天。`,
    });
  }

  if (timeDist.peakHour !== null) {
    sections.push({
      title: '时间偏好',
      content: `投掷高峰时段为${timeDist.peakSlot?.label || '-'}，其中 ${timeDist.peakHour} 时最为活跃。`
        + `凌晨占 ${(timeDist.slots.find(s => s.slot === 'dawn')?.percentage) || '0%'}，`
        + `上午占 ${(timeDist.slots.find(s => s.slot === 'morning')?.percentage) || '0%'}，`
        + `下午占 ${(timeDist.slots.find(s => s.slot === 'afternoon')?.percentage) || '0%'}，`
        + `晚上占 ${(timeDist.slots.find(s => s.slot === 'evening')?.percentage) || '0%'}。`,
    });
  }

  {
    const elementDist = getElementDistribution(records);
    const topElement = elementDist.sort((a, b) => b.value - a.value)[0];
    if (topElement && topElement.value > 0) {
      sections.push({
        title: '元素倾向',
        content: `元素分布中最突出的是${topElement.name}（${topElement.percentage}），反映出你近期的能量倾向。`,
      });
    }
  }

  {
    const rarestPlanet = Object.entries(frequency.planet).filter(([, v]) => v === 0);
    const rarestSign = Object.entries(frequency.sign).filter(([, v]) => v === 0);
    if (rarestPlanet.length > 0 || rarestSign.length > 0) {
      const missing: string[] = [];
      if (rarestPlanet.length > 0) missing.push(`行星: ${rarestPlanet.map(p => p[0]).join('、')}`);
      if (rarestSign.length > 0) missing.push(`星座: ${rarestSign.map(s => s[0]).join('、')}`);
      sections.push({
        title: '盲区提醒',
        content: `尚未出现的维度：${missing.join('；')}。这些未触及的领域可能蕴含重要启示。`,
      });
    }
  }

  return { generatedAt, totalRecords: total, summary, sections };
}
