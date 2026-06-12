import React from 'react';
import StatsChart from '@/components/StatsChart';
import StatCard from '@/components/StatCard';
import { ChartDataItem } from '@/types';

interface FrequencyTabProps {
  totalRecords: number;
  planetData: ChartDataItem[];
  signData: ChartDataItem[];
  houseData: ChartDataItem[];
}

const FrequencyTab: React.FC<FrequencyTabProps> = ({ totalRecords, planetData, signData, houseData }) => {
  const summaryCards = [
    { label: '总记录数', value: totalRecords, color: 'from-violet-500 to-purple-600' },
    { label: '行星覆盖', value: Object.keys(planetData).length, color: 'from-amber-500 to-orange-600' },
    { label: '星座覆盖', value: Object.keys(signData).length, color: 'from-blue-500 to-cyan-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {summaryCards.map((item, idx) => (
          <StatCard key={idx} label={item.label} value={item.value} color={item.color} size="lg" />
        ))}
      </div>

      <StatsChart data={planetData} title="行星出现频率" color="#f59e0b" />
      <StatsChart data={signData} title="星座出现频率" color="#8b5cf6" />
      <StatsChart data={houseData} title="宫位出现频率" color="#3b82f6" />
    </div>
  );
};

export default FrequencyTab;
