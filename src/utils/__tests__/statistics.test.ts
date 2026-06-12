import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  calculateFrequency,
  calculateCombinations,
  calculateTypeDistribution,
  getTopItems,
  toChartData,
  getElementDistribution,
  getModalityDistribution,
  calculateRollCounts,
  calculateTimeDistribution,
  calculateHeatmapData,
  generateAnalysisReport,
} from '../statistics';
import { PLANETS, SIGNS, HOUSES } from '../diceData';
import type { DiceRecord, FrequencyStats, CombinationStats, RollCountStats, TimeDistributionStats } from '@/types';

function createMockRecord(overrides: Partial<DiceRecord> = {}): DiceRecord {
  return {
    id: 'test-id',
    planet: '太阳',
    sign: '白羊座',
    house: 1,
    question: '测试问题',
    questionType: '爱情',
    notes: '',
    timestamp: '2025-01-01T12:00:00.000Z',
    ...overrides,
  };
}

describe('statistics utils', () => {
  describe('calculateFrequency', () => {
    it('空数组应返回所有项为0', () => {
      const result = calculateFrequency([]);
      expect(Object.keys(result.planet).length).toBe(PLANETS.length);
      expect(Object.keys(result.sign).length).toBe(SIGNS.length);
      expect(Object.keys(result.house).length).toBe(HOUSES.length);
      Object.values(result.planet).forEach(v => expect(v).toBe(0));
      Object.values(result.sign).forEach(v => expect(v).toBe(0));
      Object.values(result.house).forEach(v => expect(v).toBe(0));
    });

    it('单条记录应正确计数', () => {
      const record = createMockRecord({ planet: '太阳', sign: '白羊座', house: 1 });
      const result = calculateFrequency([record]);
      expect(result.planet['太阳']).toBe(1);
      expect(result.sign['白羊座']).toBe(1);
      expect(result.house[1]).toBe(1);
      expect(result.planet['月亮']).toBe(0);
    });

    it('多条记录应正确累加', () => {
      const records = [
        createMockRecord({ planet: '太阳', sign: '白羊座', house: 1 }),
        createMockRecord({ planet: '太阳', sign: '金牛座', house: 1 }),
        createMockRecord({ planet: '月亮', sign: '白羊座', house: 2 }),
      ];
      const result = calculateFrequency(records);
      expect(result.planet['太阳']).toBe(2);
      expect(result.planet['月亮']).toBe(1);
      expect(result.sign['白羊座']).toBe(2);
      expect(result.sign['金牛座']).toBe(1);
      expect(result.house[1]).toBe(2);
      expect(result.house[2]).toBe(1);
    });

    it('所有行星/星座/宫位都应被初始化', () => {
      const result = calculateFrequency([]);
      PLANETS.forEach(p => {
        expect(result.planet).toHaveProperty(p.name);
      });
      SIGNS.forEach(s => {
        expect(result.sign).toHaveProperty(s.name);
      });
      HOUSES.forEach(h => {
        expect(result.house).toHaveProperty(h.number);
      });
    });
  });

  describe('calculateCombinations', () => {
    it('空数组应返回空组合', () => {
      const result = calculateCombinations([]);
      expect(result.planetSign).toEqual([]);
      expect(result.planetHouse).toEqual([]);
      expect(result.signHouse).toEqual([]);
      expect(result.triple).toEqual([]);
    });

    it('单条记录应生成四个维度的组合', () => {
      const record = createMockRecord({ planet: '太阳', sign: '白羊座', house: 1 });
      const result = calculateCombinations([record]);
      expect(result.planetSign.length).toBe(1);
      expect(result.planetSign[0].planet).toBe('太阳');
      expect(result.planetSign[0].sign).toBe('白羊座');
      expect(result.planetSign[0].count).toBe(1);
      expect(result.planetSign[0].percentage).toBe(100);
      expect(result.planetHouse.length).toBe(1);
      expect(result.signHouse.length).toBe(1);
      expect(result.triple.length).toBe(1);
    });

    it('相同组合应被合并计数', () => {
      const records = [
        createMockRecord({ planet: '太阳', sign: '白羊座', house: 1 }),
        createMockRecord({ planet: '太阳', sign: '白羊座', house: 1 }),
        createMockRecord({ planet: '太阳', sign: '金牛座', house: 2 }),
      ];
      const result = calculateCombinations(records);
      const psSolarAries = result.planetSign.find(c => c.planet === '太阳' && c.sign === '白羊座');
      expect(psSolarAries?.count).toBe(2);
      expect(psSolarAries?.percentage).toBeCloseTo(66.67, 1);
    });

    it('结果应按计数降序排列', () => {
      const records = [
        createMockRecord({ planet: '太阳', sign: '白羊座', house: 1 }),
        createMockRecord({ planet: '太阳', sign: '白羊座', house: 1 }),
        createMockRecord({ planet: '月亮', sign: '金牛座', house: 2 }),
      ];
      const result = calculateCombinations(records);
      expect(result.planetSign[0].count).toBeGreaterThanOrEqual(result.planetSign[1].count);
      expect(result.triple[0].count).toBeGreaterThanOrEqual(result.triple[1].count);
    });

    it('最多只返回前10个组合', () => {
      const records: DiceRecord[] = [];
      for (let i = 0; i < 20; i++) {
        records.push(createMockRecord({
          planet: PLANETS[i % PLANETS.length].name,
          sign: SIGNS[i % SIGNS.length].name,
          house: (i % 12) + 1,
        }));
      }
      const result = calculateCombinations(records);
      expect(result.planetSign.length).toBeLessThanOrEqual(10);
      expect(result.planetHouse.length).toBeLessThanOrEqual(10);
      expect(result.signHouse.length).toBeLessThanOrEqual(10);
      expect(result.triple.length).toBeLessThanOrEqual(10);
    });
  });

  describe('calculateTypeDistribution', () => {
    it('空数组应返回空对象', () => {
      const result = calculateTypeDistribution([]);
      expect(result).toEqual({});
    });

    it('应按问题类型分组统计', () => {
      const records = [
        createMockRecord({ questionType: '爱情', planet: '金星', sign: '天秤座', house: 7 }),
        createMockRecord({ questionType: '爱情', planet: '火星', sign: '天蝎座', house: 8 }),
        createMockRecord({ questionType: '事业', planet: '土星', sign: '摩羯座', house: 10 }),
      ];
      const result = calculateTypeDistribution(records);
      expect(result['爱情']).toBeDefined();
      expect(result['事业']).toBeDefined();
      expect(result['爱情'].count).toBe(2);
      expect(result['事业'].count).toBe(1);
    });

    it('未设置questionType的记录归类为未分类', () => {
      const record = createMockRecord({ questionType: '' });
      const result = calculateTypeDistribution([record]);
      expect(result['未分类']).toBeDefined();
      expect(result['未分类'].count).toBe(1);
    });

    it('每个类型都应包含完整的行星/星座/宫位统计', () => {
      const records = [createMockRecord({ questionType: '爱情' })];
      const result = calculateTypeDistribution(records);
      expect(Object.keys(result['爱情'].planet).length).toBe(PLANETS.length);
      expect(Object.keys(result['爱情'].sign).length).toBe(SIGNS.length);
      expect(Object.keys(result['爱情'].house).length).toBe(HOUSES.length);
    });
  });

  describe('getTopItems', () => {
    it('空对象应返回空数组', () => {
      const result = getTopItems({});
      expect(result).toEqual([]);
    });

    it('默认返回前5项', () => {
      const freq: Record<string, number> = {};
      for (let i = 0; i < 10; i++) freq[`item${i}`] = 10 - i;
      const result = getTopItems(freq);
      expect(result.length).toBe(5);
    });

    it('应按值降序排列', () => {
      const freq = { a: 3, b: 1, c: 2 };
      const result = getTopItems(freq);
      expect(result[0].name).toBe('a');
      expect(result[0].value).toBe(3);
      expect(result[1].name).toBe('c');
      expect(result[2].name).toBe('b');
    });

    it('支持自定义topN参数', () => {
      const freq: Record<string, number> = {};
      for (let i = 0; i < 10; i++) freq[`item${i}`] = i;
      const result = getTopItems(freq, 3);
      expect(result.length).toBe(3);
    });

    it('数字键名应被转换为字符串', () => {
      const freq: Record<number, number> = { 1: 10, 2: 20 };
      const result = getTopItems(freq);
      expect(typeof result[0].name).toBe('string');
    });
  });

  describe('toChartData', () => {
    it('空对象应返回空数组', () => {
      const result = toChartData({}, 0);
      expect(result).toEqual([]);
    });

    it('应正确计算百分比', () => {
      const freq = { a: 25, b: 75 };
      const result = toChartData(freq, 100);
      expect(result[0].percentage).toBe('75.0%');
      expect(result[1].percentage).toBe('25.0%');
    });

    it('总数为0时百分比应为0%', () => {
      const freq = { a: 0, b: 0 };
      const result = toChartData(freq, 0);
      result.forEach(item => expect(item.percentage).toBe('0%'));
    });

    it('应按值降序排列', () => {
      const freq = { a: 1, b: 3, c: 2 };
      const result = toChartData(freq, 6);
      expect(result[0].name).toBe('b');
      expect(result[1].name).toBe('c');
      expect(result[2].name).toBe('a');
    });
  });

  describe('getElementDistribution', () => {
    it('空数组应返回四个元素都为0', () => {
      const result = getElementDistribution([]);
      expect(result.length).toBe(4);
      result.forEach(item => expect(item.value).toBe(0));
    });

    it('应按星座元素正确统计', () => {
      const records = [
        createMockRecord({ sign: '白羊座' }),
        createMockRecord({ sign: '狮子座' }),
        createMockRecord({ sign: '金牛座' }),
      ];
      const result = getElementDistribution(records);
      const fire = result.find(r => r.name === '火象');
      const earth = result.find(r => r.name === '土象');
      expect(fire?.value).toBe(2);
      expect(earth?.value).toBe(1);
    });

    it('应包含百分比', () => {
      const records = [createMockRecord({ sign: '白羊座' })];
      const result = getElementDistribution(records);
      const fire = result.find(r => r.name === '火象');
      expect(fire?.percentage).toBe('100.0%');
    });
  });

  describe('getModalityDistribution', () => {
    it('空数组应返回三个调性都为0', () => {
      const result = getModalityDistribution([]);
      expect(result.length).toBe(3);
      result.forEach(item => expect(item.value).toBe(0));
    });

    it('应按星座调性正确统计', () => {
      const records = [
        createMockRecord({ sign: '白羊座' }),
        createMockRecord({ sign: '巨蟹座' }),
        createMockRecord({ sign: '金牛座' }),
      ];
      const result = getModalityDistribution(records);
      const cardinal = result.find(r => r.name === '开创');
      const fixed = result.find(r => r.name === '固定');
      expect(cardinal?.value).toBe(2);
      expect(fixed?.value).toBe(1);
    });
  });

  describe('calculateRollCounts', () => {
    it('空数组应返回零值统计', () => {
      const result = calculateRollCounts([]);
      expect(result.totalRolls).toBe(0);
      expect(result.totalDays).toBe(0);
      expect(result.avgRollsPerDay).toBe(0);
      expect(result.maxRollsDay).toBeNull();
      expect(result.currentStreak).toBe(0);
      expect(result.daily).toEqual([]);
    });

    it('应正确统计每日投掷次数', () => {
      const records = [
        createMockRecord({ timestamp: '2025-01-01T10:00:00.000Z' }),
        createMockRecord({ timestamp: '2025-01-01T14:00:00.000Z' }),
        createMockRecord({ timestamp: '2025-01-02T10:00:00.000Z' }),
      ];
      const result = calculateRollCounts(records);
      expect(result.totalRolls).toBe(3);
      expect(result.totalDays).toBe(2);
      expect(result.daily.length).toBe(2);
      expect(result.daily[0].count).toBe(2);
      expect(result.daily[1].count).toBe(1);
    });

    it('应正确计算平均每日投掷数', () => {
      const records = [
        createMockRecord({ timestamp: '2025-01-01T10:00:00.000Z' }),
        createMockRecord({ timestamp: '2025-01-02T10:00:00.000Z' }),
        createMockRecord({ timestamp: '2025-01-03T10:00:00.000Z' }),
      ];
      const result = calculateRollCounts(records);
      expect(result.avgRollsPerDay).toBe(1);
    });

    it('应找出投掷最多的一天', () => {
      const records = [
        createMockRecord({ timestamp: '2025-01-01T10:00:00.000Z' }),
        createMockRecord({ timestamp: '2025-01-01T14:00:00.000Z' }),
        createMockRecord({ timestamp: '2025-01-02T10:00:00.000Z' }),
      ];
      const result = calculateRollCounts(records);
      expect(result.maxRollsDay?.date).toBe('2025-01-01');
      expect(result.maxRollsDay?.count).toBe(2);
    });

    it('日期应按升序排列', () => {
      const records = [
        createMockRecord({ timestamp: '2025-01-03T10:00:00.000Z' }),
        createMockRecord({ timestamp: '2025-01-01T10:00:00.000Z' }),
        createMockRecord({ timestamp: '2025-01-02T10:00:00.000Z' }),
      ];
      const result = calculateRollCounts(records);
      expect(result.daily[0].date).toBe('2025-01-01');
      expect(result.daily[1].date).toBe('2025-01-02');
      expect(result.daily[2].date).toBe('2025-01-03');
    });

    it('应正确计算连续投掷天数', () => {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(today.getDate() - 2);

      const records = [
        createMockRecord({ timestamp: today.toISOString() }),
        createMockRecord({ timestamp: yesterday.toISOString() }),
        createMockRecord({ timestamp: twoDaysAgo.toISOString() }),
      ];
      const result = calculateRollCounts(records);
      expect(result.currentStreak).toBe(3);
    });
  });

  describe('calculateTimeDistribution', () => {
    function createLocalTimestamp(date: Date): string {
      return date.toISOString();
    }

    function createDateAtHour(hour: number): Date {
      const d = new Date();
      d.setFullYear(2025, 0, 1);
      d.setHours(hour, 0, 0, 0);
      return d;
    }

    it('空数组应返回零值统计', () => {
      const result = calculateTimeDistribution([]);
      expect(result.hourly.length).toBe(24);
      result.hourly.forEach(h => expect(h.count).toBe(0));
      expect(result.slots.length).toBe(4);
      result.slots.forEach(s => expect(s.count).toBe(0));
      expect(result.peakHour).toBeNull();
      expect(result.peakSlot).toBeNull();
    });

    it('应正确统计每小时分布', () => {
      const hour9 = createDateAtHour(9);
      const hour14 = createDateAtHour(14);
      const records = [
        createMockRecord({ timestamp: createLocalTimestamp(hour9) }),
        createMockRecord({ timestamp: createLocalTimestamp(new Date(hour9.getTime() + 15 * 60 * 1000)) }),
        createMockRecord({ timestamp: createLocalTimestamp(hour14) }),
      ];
      const result = calculateTimeDistribution(records);
      expect(result.hourly[9].count).toBe(2);
      expect(result.hourly[14].count).toBe(1);
    });

    it('应正确统计时段分布', () => {
      const records = [
        createMockRecord({ timestamp: createLocalTimestamp(createDateAtHour(2)) }),
        createMockRecord({ timestamp: createLocalTimestamp(createDateAtHour(8)) }),
        createMockRecord({ timestamp: createLocalTimestamp(createDateAtHour(15)) }),
        createMockRecord({ timestamp: createLocalTimestamp(createDateAtHour(20)) }),
      ];
      const result = calculateTimeDistribution(records);
      expect(result.slots.find(s => s.slot === 'dawn')?.count).toBe(1);
      expect(result.slots.find(s => s.slot === 'morning')?.count).toBe(1);
      expect(result.slots.find(s => s.slot === 'afternoon')?.count).toBe(1);
      expect(result.slots.find(s => s.slot === 'evening')?.count).toBe(1);
    });

    it('应找出高峰小时', () => {
      const hour14 = createDateAtHour(14);
      const records = [
        createMockRecord({ timestamp: createLocalTimestamp(hour14) }),
        createMockRecord({ timestamp: createLocalTimestamp(new Date(hour14.getTime() + 30 * 60 * 1000)) }),
        createMockRecord({ timestamp: createLocalTimestamp(new Date(hour14.getTime() + 45 * 60 * 1000)) }),
        createMockRecord({ timestamp: createLocalTimestamp(createDateAtHour(9)) }),
      ];
      const result = calculateTimeDistribution(records);
      expect(result.peakHour).toBe(14);
    });

    it('应包含时段百分比', () => {
      const records = [createMockRecord({ timestamp: createLocalTimestamp(createDateAtHour(14)) })];
      const result = calculateTimeDistribution(records);
      const afternoon = result.slots.find(s => s.slot === 'afternoon');
      expect(afternoon?.percentage).toBe('100.0%');
    });
  });

  describe('calculateHeatmapData', () => {
    it('应返回三个热力图', () => {
      const result = calculateHeatmapData([]);
      expect(result.length).toBe(3);
      expect(result[0].title).toBe('行星 × 星座');
      expect(result[1].title).toBe('行星 × 宫位');
      expect(result[2].title).toBe('星座 × 宫位');
    });

    it('空数组时所有单元格值为0', () => {
      const result = calculateHeatmapData([]);
      result.forEach(heatmap => {
        heatmap.cells.forEach(cell => {
          expect(cell.value).toBe(0);
        });
      });
    });

    it('行星×星座热力图尺寸正确', () => {
      const result = calculateHeatmapData([]);
      const heatmap = result[0];
      expect(heatmap.rowLabels.length).toBe(PLANETS.length);
      expect(heatmap.colLabels.length).toBe(SIGNS.length);
      expect(heatmap.cells.length).toBe(PLANETS.length * SIGNS.length);
    });

    it('应正确累加单元格数值', () => {
      const records = [
        createMockRecord({ planet: '太阳', sign: '白羊座', house: 1 }),
        createMockRecord({ planet: '太阳', sign: '白羊座', house: 1 }),
        createMockRecord({ planet: '月亮', sign: '金牛座', house: 2 }),
      ];
      const result = calculateHeatmapData(records);
      const psHeatmap = result[0];
      const cell = psHeatmap.cells.find(c => c.row === '太阳' && c.col === '白羊座');
      expect(cell?.value).toBe(2);
    });

    it('应正确计算maxValue', () => {
      const records = [
        createMockRecord({ planet: '太阳', sign: '白羊座', house: 1 }),
        createMockRecord({ planet: '太阳', sign: '白羊座', house: 1 }),
        createMockRecord({ planet: '太阳', sign: '白羊座', house: 1 }),
      ];
      const result = calculateHeatmapData(records);
      expect(result[0].maxValue).toBe(3);
    });
  });

  describe('generateAnalysisReport', () => {
    function setupTestData(records: DiceRecord[]) {
      const frequency = calculateFrequency(records);
      const combinations = calculateCombinations(records);
      const rollCounts = calculateRollCounts(records);
      const timeDist = calculateTimeDistribution(records);
      return { frequency, combinations, rollCounts, timeDist };
    }

    it('应生成包含基本信息的报告', () => {
      const records = [
        createMockRecord({ timestamp: '2025-01-01T12:00:00.000Z' }),
      ];
      const { frequency, combinations, rollCounts, timeDist } = setupTestData(records);
      const report = generateAnalysisReport(records, frequency, combinations, rollCounts, timeDist);
      expect(report.totalRecords).toBe(1);
      expect(report.generatedAt).toBeDefined();
      expect(report.summary).toContain('共记录');
      expect(report.sections.length).toBeGreaterThan(0);
    });

    it('空记录应生成零值报告', () => {
      const records: DiceRecord[] = [];
      const { frequency, combinations, rollCounts, timeDist } = setupTestData(records);
      const report = generateAnalysisReport(records, frequency, combinations, rollCounts, timeDist);
      expect(report.totalRecords).toBe(0);
      expect(report.summary).toContain('共记录 0 次占卜');
    });

    it('应包含核心频率章节', () => {
      const records = [createMockRecord()];
      const { frequency, combinations, rollCounts, timeDist } = setupTestData(records);
      const report = generateAnalysisReport(records, frequency, combinations, rollCounts, timeDist);
      const coreSection = report.sections.find(s => s.title === '核心频率');
      expect(coreSection).toBeDefined();
      expect(coreSection?.content).toContain('出现最多的行星');
    });

    it('有组合时应包含最强组合章节', () => {
      const records = [
        createMockRecord({ planet: '太阳', sign: '白羊座', house: 1 }),
        createMockRecord({ planet: '太阳', sign: '白羊座', house: 1 }),
      ];
      const { frequency, combinations, rollCounts, timeDist } = setupTestData(records);
      const report = generateAnalysisReport(records, frequency, combinations, rollCounts, timeDist);
      const comboSection = report.sections.find(s => s.title === '最强组合');
      expect(comboSection).toBeDefined();
    });

    it('有投掷数据时应包含活跃度章节', () => {
      const records = [createMockRecord({ timestamp: '2025-01-01T12:00:00.000Z' })];
      const { frequency, combinations, rollCounts, timeDist } = setupTestData(records);
      const report = generateAnalysisReport(records, frequency, combinations, rollCounts, timeDist);
      const activitySection = report.sections.find(s => s.title === '投掷活跃度');
      expect(activitySection).toBeDefined();
    });

    it('有时间数据时应包含时间偏好章节', () => {
      const records = [createMockRecord({ timestamp: '2025-01-01T14:00:00.000Z' })];
      const { frequency, combinations, rollCounts, timeDist } = setupTestData(records);
      const report = generateAnalysisReport(records, frequency, combinations, rollCounts, timeDist);
      const timeSection = report.sections.find(s => s.title === '时间偏好');
      expect(timeSection).toBeDefined();
    });

    it('应包含元素倾向章节', () => {
      const records = [createMockRecord()];
      const { frequency, combinations, rollCounts, timeDist } = setupTestData(records);
      const report = generateAnalysisReport(records, frequency, combinations, rollCounts, timeDist);
      const elementSection = report.sections.find(s => s.title === '元素倾向');
      expect(elementSection).toBeDefined();
    });

    it('有未出现项时应包含盲区提醒章节', () => {
      const records = [createMockRecord({ planet: '太阳', sign: '白羊座' })];
      const { frequency, combinations, rollCounts, timeDist } = setupTestData(records);
      const report = generateAnalysisReport(records, frequency, combinations, rollCounts, timeDist);
      const blindSection = report.sections.find(s => s.title === '盲区提醒');
      expect(blindSection).toBeDefined();
    });
  });
});
