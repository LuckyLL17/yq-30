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
