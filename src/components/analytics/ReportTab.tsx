import React from 'react';
import { FileText } from 'lucide-react';
import SectionCard from '@/components/SectionCard';
import { AnalysisReport, RollCountStats, TimeDistributionStats } from '@/types';

interface ReportTabProps {
  report: AnalysisReport;
  rollCounts: RollCountStats;
  timeDist: TimeDistributionStats;
}

const ReportTab: React.FC<ReportTabProps> = ({ report, rollCounts, timeDist }) => {
  const detailItems = [
    { label: '总记录数', value: report.totalRecords },
    { label: '投掷天数', value: rollCounts.totalDays },
    { label: '日均投掷', value: rollCounts.avgRollsPerDay },
    { label: '高峰时段', value: timeDist.peakSlot?.label || '-' },
    { label: '高峰小时', value: timeDist.peakHour !== null ? `${timeDist.peakHour}时` : '-' },
    { label: '连续天数', value: rollCounts.currentStreak },
  ];

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">分析报告</h3>
            <p className="text-indigo-300/60 text-sm">生成于 {report.generatedAt}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-600/30 flex items-center justify-center">
            <FileText size={24} className="text-violet-300" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20 mb-6">
          <p className="text-white/90 leading-relaxed">{report.summary}</p>
        </div>

        <div className="space-y-4">
          {report.sections.map((section, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/5">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                {section.title}
              </h4>
              <p className="text-indigo-200/80 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>

      <SectionCard title="详细数据">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {detailItems.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/5">
              <div className="text-indigo-300/60 text-xs mb-1">{item.label}</div>
              <div className="text-white font-semibold">{item.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default ReportTab;
