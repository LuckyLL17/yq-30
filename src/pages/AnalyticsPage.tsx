import React, { useState } from 'react';
import { useDiceStore } from '@/store/useDiceStore';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import {
  FrequencyTab,
  CombinationsTab,
  DistributionTab,
  RollsTab,
  TimeTab,
  HeatmapTab,
  ReportTab,
} from '@/components/analytics';
import { BarChart3, TrendingUp, Layers, Sparkles, Activity, Clock, Grid3X3, FileText } from 'lucide-react';

type TabId = 'frequency' | 'combinations' | 'distribution' | 'rolls' | 'time' | 'heatmap' | 'report';

const tabs: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
  { id: 'frequency', label: '频率统计', icon: BarChart3 },
  { id: 'combinations', label: '组合分析', icon: TrendingUp },
  { id: 'distribution', label: '分布特征', icon: Layers },
  { id: 'rolls', label: '投掷次数', icon: Activity },
  { id: 'time', label: '时间分布', icon: Clock },
  { id: 'heatmap', label: '热力图', icon: Grid3X3 },
  { id: 'report', label: '分析报告', icon: FileText },
];

const AnalyticsPage: React.FC = () => {
  const { records, questionTypes } = useDiceStore();
  const [activeTab, setActiveTab] = useState<TabId>('frequency');
  const analyticsData = useAnalyticsData(records, questionTypes);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'frequency':
        return (
          <FrequencyTab
            totalRecords={analyticsData.totalRecords}
            planetData={analyticsData.planetData}
            signData={analyticsData.signData}
            houseData={analyticsData.houseData}
          />
        );
      case 'combinations':
        return <CombinationsTab combinations={analyticsData.combinations} />;
      case 'distribution':
        return (
          <DistributionTab
            elementDist={analyticsData.elementDist}
            modalityDist={analyticsData.modalityDist}
            typeDistribution={analyticsData.typeDistribution}
          />
        );
      case 'rolls':
        return (
          <RollsTab
            rollCounts={analyticsData.rollCounts}
            rollTrendData={analyticsData.rollTrendData}
          />
        );
      case 'time':
        return (
          <TimeTab
            timeDist={analyticsData.timeDist}
            hourlyChartData={analyticsData.hourlyChartData}
          />
        );
      case 'heatmap':
        return <HeatmapTab heatmapData={analyticsData.heatmapData} />;
      case 'report':
        return (
          <ReportTab
            report={analyticsData.report}
            rollCounts={analyticsData.rollCounts}
            timeDist={analyticsData.timeDist}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative z-10 min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-violet-300 via-amber-200 to-violet-300 bg-clip-text text-transparent">
              统计分析
            </span>
          </h2>
          <p className="text-indigo-300/70">
            基于 {analyticsData.totalRecords} 条记录的数据分析，洞察长期模式与规律
          </p>
        </div>

        {analyticsData.totalRecords === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Sparkles size={36} className="text-indigo-400/50" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">暂无数据</h3>
            <p className="text-indigo-300/60 max-w-sm">
              记录至少一次骰子结果后，这里将显示详细的统计分析
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all text-sm
                      ${activeTab === tab.id
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                        : 'bg-white/5 text-indigo-300/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {renderTabContent()}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
