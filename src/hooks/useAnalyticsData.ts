import { useMemo } from 'react';
import { DiceRecord, ChartDataItem, RollCountStats, TimeDistributionStats, HeatmapData, AnalysisReport, CombinationStats, QuestionType, TypeDistributionItem } from '@/types';
import {
  calculateFrequency,
  calculateCombinations,
  toChartData,
  getElementDistribution,
  getModalityDistribution,
  calculateRollCounts,
  calculateTimeDistribution,
  calculateHeatmapData,
  generateAnalysisReport,
} from '@/utils/statistics';

export interface UseAnalyticsDataResult {
  totalRecords: number;
  planetData: ChartDataItem[];
  signData: ChartDataItem[];
  houseData: ChartDataItem[];
  combinations: CombinationStats;
  elementDist: ChartDataItem[];
  modalityDist: ChartDataItem[];
  rollCounts: RollCountStats;
  timeDist: TimeDistributionStats;
  heatmapData: HeatmapData[];
  report: AnalysisReport;
  rollTrendData: ChartDataItem[];
  hourlyChartData: ChartDataItem[];
  typeDistribution: TypeDistributionItem[];
}

export const useAnalyticsData = (records: DiceRecord[], questionTypes: QuestionType[]): UseAnalyticsDataResult => {
  const totalRecords = records.length;

  const stats = useMemo(() => {
    const frequency = calculateFrequency(records);
    const combinations = calculateCombinations(records);
    const elementDist = getElementDistribution(records);
    const modalityDist = getModalityDistribution(records);
    const rollCounts = calculateRollCounts(records);
    const timeDist = calculateTimeDistribution(records);
    const heatmapData = calculateHeatmapData(records);
    const report = generateAnalysisReport(records, frequency, combinations, rollCounts, timeDist);

    const typeDistribution = questionTypes
      .map((type) => {
        const count = records.filter((r) => r.questionType === type.id).length;
        return {
          typeId: type.id,
          name: type.name,
          color: type.color,
          count,
          percentage: totalRecords > 0 ? ((count / totalRecords) * 100).toFixed(1) : '0',
        };
      })
      .filter((item) => item.count > 0);

    return {
      planetData: toChartData(frequency.planet, totalRecords),
      signData: toChartData(frequency.sign, totalRecords),
      houseData: toChartData(frequency.house, totalRecords),
      combinations,
      elementDist,
      modalityDist,
      rollCounts,
      timeDist,
      heatmapData,
      report,
      typeDistribution,
    };
  }, [records, questionTypes, totalRecords]);

  const rollTrendData = useMemo(() => {
    return stats.rollCounts.daily.map(d => ({
      name: d.date.slice(5),
      value: d.count,
      percentage: '',
    }));
  }, [stats.rollCounts.daily]);

  const hourlyChartData = useMemo(() => {
    return stats.timeDist.hourly.map(h => ({
      name: `${h.hour}时`,
      value: h.count,
      percentage: totalRecords > 0 ? ((h.count / totalRecords) * 100).toFixed(1) + '%' : '0%',
    }));
  }, [stats.timeDist.hourly, totalRecords]);

  return {
    totalRecords,
    ...stats,
    rollTrendData,
    hourlyChartData,
  };
};

export default useAnalyticsData;
