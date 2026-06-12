import React from 'react';
import StatsChart from '@/components/StatsChart';
import StatCard from '@/components/StatCard';
import HighlightCard from '@/components/HighlightCard';
import ProgressBar from '@/components/ProgressBar';
import SectionCard from '@/components/SectionCard';
import { RollCountStats, ChartDataItem, RollCountDaily } from '@/types';

interface RollsTabProps {
  rollCounts: RollCountStats;
  rollTrendData: ChartDataItem[];
}

const RollsTab: React.FC<RollsTabProps> = ({ rollCounts, rollTrendData }) => {
  const statCards = [
    { label: '总投掷次数', value: rollCounts.totalRolls, color: 'from-violet-500 to-purple-600' },
    { label: '投掷天数', value: rollCounts.totalDays, color: 'from-amber-500 to-orange-600' },
    { label: '日均投掷', value: rollCounts.avgRollsPerDay, color: 'from-blue-500 to-cyan-600' },
    { label: '连续天数', value: rollCounts.currentStreak, color: 'from-emerald-500 to-green-600' },
  ];

  const getMaxCount = (days: RollCountDaily[]) => {
    return rollCounts.maxRollsDay?.count || 1;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((item, idx) => (
          <StatCard key={idx} label={item.label} value={item.value} color={item.color} />
        ))}
      </div>

      {rollCounts.maxRollsDay && (
        <HighlightCard
          icon="🔥"
          iconGradient="from-rose-500/30 to-pink-600/30"
          label="最活跃的一天"
          value={`${rollCounts.maxRollsDay.date} · ${rollCounts.maxRollsDay.count} 次投掷`}
        />
      )}

      {rollTrendData.length > 0 && (
        <StatsChart data={rollTrendData} type="line" title="每日投掷趋势" color="#8b5cf6" />
      )}

      {rollCounts.daily.length > 0 && (
        <SectionCard title="每日投掷明细" contentClassName="max-h-64 overflow-y-auto space-y-2 pr-2">
          {[...rollCounts.daily].reverse().map((day) => (
            <div key={day.date} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
              <span className="text-indigo-300/70 text-sm w-24 shrink-0">{day.date}</span>
              <div className="flex-1">
                <ProgressBar
                  percentage={(day.count / getMaxCount(rollCounts.daily)) * 100}
                  gradient="from-violet-500, to-purple-500"
                />
              </div>
              <span className="text-white font-medium text-sm w-12 text-right">{day.count}次</span>
            </div>
          ))}
        </SectionCard>
      )}
    </div>
  );
};

export default RollsTab;
