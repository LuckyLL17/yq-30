import React from 'react';
import StatsChart from '@/components/StatsChart';
import StatCard from '@/components/StatCard';
import HighlightCard from '@/components/HighlightCard';
import ProgressBar from '@/components/ProgressBar';
import SectionCard from '@/components/SectionCard';
import { TimeDistributionStats, ChartDataItem, TimeSlotDistribution } from '@/types';

interface TimeTabProps {
  timeDist: TimeDistributionStats;
  hourlyChartData: ChartDataItem[];
}

const SLOT_COLORS: Record<string, string> = {
  dawn: 'from-indigo-500 to-blue-600',
  morning: 'from-amber-400 to-orange-500',
  afternoon: 'from-yellow-400 to-amber-500',
  evening: 'from-violet-500 to-purple-600',
};

const SLOT_ICONS: Record<string, string> = {
  dawn: '🌙',
  morning: '☀️',
  afternoon: '🌤',
  evening: '🌌',
};

const TimeTab: React.FC<TimeTabProps> = ({ timeDist, hourlyChartData }) => {
  const renderSlotStatCard = (slot: TimeSlotDistribution) => (
    <StatCard
      key={slot.slot}
      label={
        <span className="flex items-center gap-2">
          <span>{SLOT_ICONS[slot.slot]}</span>
          {slot.label}
        </span>
      }
      value={slot.count}
      color={SLOT_COLORS[slot.slot]}
    />
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {timeDist.slots.map(renderSlotStatCard)}
      </div>

      {timeDist.peakHour !== null && (
        <HighlightCard
          icon="⏰"
          iconGradient="from-amber-500/30 to-orange-600/30"
          label="投掷高峰"
          value={`${timeDist.peakHour}时 · ${timeDist.peakSlot?.label || '-'}`}
        />
      )}

      <StatsChart data={hourlyChartData} type="bar" title="24小时投掷分布" color="#f59e0b" />

      <SectionCard title="时段占比" contentClassName="space-y-4">
        {timeDist.slots.map((slot) => {
          const pct = parseFloat(slot.percentage);
          return (
            <div key={slot.slot}>
              <ProgressBar
                percentage={pct}
                gradient={SLOT_COLORS[slot.slot].replace('from-', '').replace(' to-', ', ')}
                height="md"
                showLabel
                label={
                  <span className="flex items-center gap-2">
                    <span>{SLOT_ICONS[slot.slot]}</span>
                    {slot.label}
                  </span>
                }
                value={`${slot.count}次 · ${slot.percentage}`}
              />
            </div>
          );
        })}
      </SectionCard>
    </div>
  );
};

export default TimeTab;
