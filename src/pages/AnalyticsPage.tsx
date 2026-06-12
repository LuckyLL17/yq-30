import React, { useMemo, useState } from 'react';
import { useDiceStore } from '@/store/useDiceStore';
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
import StatsChart from '@/components/StatsChart';
import HeatmapChart from '@/components/HeatmapChart';
import { getPlanetByName, getSignByName } from '@/utils/diceData';
import { BarChart3, TrendingUp, Layers, Sparkles, Activity, Clock, Grid3X3, FileText } from 'lucide-react';

type TabId = 'frequency' | 'combinations' | 'distribution' | 'rolls' | 'time' | 'heatmap' | 'report';

const AnalyticsPage: React.FC = () => {
  const { records, questionTypes } = useDiceStore();
  const [activeTab, setActiveTab] = useState<TabId>('frequency');

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
    };
  }, [records, totalRecords]);

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

  const tabs: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
    { id: 'frequency', label: '频率统计', icon: BarChart3 },
    { id: 'combinations', label: '组合分析', icon: TrendingUp },
    { id: 'distribution', label: '分布特征', icon: Layers },
    { id: 'rolls', label: '投掷次数', icon: Activity },
    { id: 'time', label: '时间分布', icon: Clock },
    { id: 'heatmap', label: '热力图', icon: Grid3X3 },
    { id: 'report', label: '分析报告', icon: FileText },
  ];

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
            基于 {totalRecords} 条记录的数据分析，洞察长期模式与规律
          </p>
        </div>

        {totalRecords === 0 ? (
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

            {activeTab === 'frequency' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {[
                    { label: '总记录数', value: totalRecords, color: 'from-violet-500 to-purple-600' },
                    { label: '行星覆盖', value: Object.keys(stats.planetData).length, color: 'from-amber-500 to-orange-600' },
                    { label: '星座覆盖', value: Object.keys(stats.signData).length, color: 'from-blue-500 to-cyan-600' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10"
                    >
                      <div className="text-indigo-300/70 text-sm mb-2">{item.label}</div>
                      <div className={`text-4xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <StatsChart data={stats.planetData} title="行星出现频率" color="#f59e0b" />
                <StatsChart data={stats.signData} title="星座出现频率" color="#8b5cf6" />
                <StatsChart data={stats.houseData} title="宫位出现频率" color="#3b82f6" />
              </div>
            )}

            {activeTab === 'combinations' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      行星 + 星座 热门组合
                    </h3>
                    <div className="space-y-3">
                      {stats.combinations.planetSign.slice(0, 5).map((item, idx) => {
                        const planet = getPlanetByName(item.planet);
                        const sign = getSignByName(item.sign);
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-600/30 flex items-center justify-center text-sm font-bold text-amber-300">
                                #{idx + 1}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{planet?.symbol}</span>
                                <span className="text-white font-medium">{item.planet}</span>
                                <span className="text-indigo-400/60">+</span>
                                <span className="text-xl">{sign?.symbol}</span>
                                <span className="text-white font-medium">{item.sign}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">{item.count}次</div>
                              <div className="text-xs text-indigo-400/60">{item.percentage.toFixed(1)}%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-violet-400" />
                      行星 + 宫位 热门组合
                    </h3>
                    <div className="space-y-3">
                      {stats.combinations.planetHouse.slice(0, 5).map((item, idx) => {
                        const planet = getPlanetByName(item.planet);
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-600/30 flex items-center justify-center text-sm font-bold text-violet-300">
                                #{idx + 1}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{planet?.symbol}</span>
                                <span className="text-white font-medium">{item.planet}</span>
                                <span className="text-indigo-400/60">+</span>
                                <span className="text-white font-medium">{item.house}宫</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">{item.count}次</div>
                              <div className="text-xs text-indigo-400/60">{item.percentage.toFixed(1)}%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      星座 + 宫位 热门组合
                    </h3>
                    <div className="space-y-3">
                      {stats.combinations.signHouse.slice(0, 5).map((item, idx) => {
                        const sign = getSignByName(item.sign);
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-600/30 flex items-center justify-center text-sm font-bold text-blue-300">
                                #{idx + 1}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{sign?.symbol}</span>
                                <span className="text-white font-medium">{item.sign}</span>
                                <span className="text-indigo-400/60">+</span>
                                <span className="text-white font-medium">{item.house}宫</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">{item.count}次</div>
                              <div className="text-xs text-indigo-400/60">{item.percentage.toFixed(1)}%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      完整三元素 热门组合
                    </h3>
                    <div className="space-y-3">
                      {stats.combinations.triple.slice(0, 5).map((item, idx) => {
                        const planet = getPlanetByName(item.planet);
                        const sign = getSignByName(item.sign);
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500/30 to-pink-600/30 flex items-center justify-center text-sm font-bold text-rose-300">
                                #{idx + 1}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-lg">{planet?.symbol}</span>
                                <span className="text-lg">{sign?.symbol}</span>
                                <span className="text-sm font-bold text-white">{item.house}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">{item.count}次</div>
                              <div className="text-xs text-indigo-400/60">{item.percentage.toFixed(1)}%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'distribution' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <StatsChart data={stats.elementDist} type="pie" title="四元素分布" />
                  <StatsChart data={stats.modalityDist} type="pie" title="三方性分布" />
                </div>

                <div className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">按问题类型分布</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {questionTypes.map((type) => {
                      const typeRecords = records.filter(r => r.questionType === type.id);
                      const count = typeRecords.length;
                      const percentage = totalRecords > 0 ? ((count / totalRecords) * 100).toFixed(1) : '0';

                      if (count === 0) return null;

                      return (
                        <div
                          key={type.id}
                          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                              style={{
                                backgroundColor: type.color + '20',
                                color: type.color,
                                border: `1px solid ${type.color}40`,
                              }}
                            >
                              {type.name}
                            </span>
                            <span className="text-white font-semibold">{count}条</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%`, backgroundColor: type.color }}
                            />
                          </div>
                          <div className="text-right text-xs text-indigo-400/60 mt-1">
                            {percentage}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rolls' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: '总投掷次数', value: stats.rollCounts.totalRolls, color: 'from-violet-500 to-purple-600' },
                    { label: '投掷天数', value: stats.rollCounts.totalDays, color: 'from-amber-500 to-orange-600' },
                    { label: '日均投掷', value: stats.rollCounts.avgRollsPerDay, color: 'from-blue-500 to-cyan-600' },
                    { label: '连续天数', value: stats.rollCounts.currentStreak, color: 'from-emerald-500 to-green-600' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10"
                    >
                      <div className="text-indigo-300/70 text-sm mb-2">{item.label}</div>
                      <div className={`text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                {stats.rollCounts.maxRollsDay && (
                  <div className="p-5 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500/30 to-pink-600/30 flex items-center justify-center text-lg">
                        🔥
                      </div>
                      <div>
                        <div className="text-indigo-300/70 text-sm">最活跃的一天</div>
                        <div className="text-white font-semibold">
                          {stats.rollCounts.maxRollsDay.date} · {stats.rollCounts.maxRollsDay.count} 次投掷
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {rollTrendData.length > 0 && (
                  <StatsChart data={rollTrendData} type="line" title="每日投掷趋势" color="#8b5cf6" />
                )}

                {stats.rollCounts.daily.length > 0 && (
                  <div className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">每日投掷明细</h3>
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                      {[...stats.rollCounts.daily].reverse().map((day) => (
                        <div key={day.date} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                          <span className="text-indigo-300/70 text-sm w-24 shrink-0">{day.date}</span>
                          <div className="flex-1 h-4 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all"
                              style={{
                                width: `${stats.rollCounts.maxRollsDay ? (day.count / stats.rollCounts.maxRollsDay.count) * 100 : 0}%`,
                              }}
                            />
                          </div>
                          <span className="text-white font-medium text-sm w-12 text-right">{day.count}次</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'time' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.timeDist.slots.map((slot) => (
                    <div
                      key={slot.slot}
                      className="p-5 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{SLOT_ICONS[slot.slot]}</span>
                        <span className="text-indigo-300/70 text-sm">{slot.label}</span>
                      </div>
                      <div className={`text-3xl font-bold bg-gradient-to-r ${SLOT_COLORS[slot.slot]} bg-clip-text text-transparent`}>
                        {slot.count}
                      </div>
                      <div className="text-indigo-400/60 text-sm mt-1">{slot.percentage}</div>
                    </div>
                  ))}
                </div>

                {stats.timeDist.peakHour !== null && (
                  <div className="p-5 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-600/30 flex items-center justify-center text-lg">
                        ⏰
                      </div>
                      <div>
                        <div className="text-indigo-300/70 text-sm">投掷高峰</div>
                        <div className="text-white font-semibold">
                          {stats.timeDist.peakHour}时 · {stats.timeDist.peakSlot?.label || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <StatsChart data={hourlyChartData} type="bar" title="24小时投掷分布" color="#f59e0b" />

                <div className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">时段占比</h3>
                  <div className="space-y-4">
                    {stats.timeDist.slots.map((slot) => {
                      const pct = parseFloat(slot.percentage);
                      return (
                        <div key={slot.slot}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-indigo-200 text-sm flex items-center gap-2">
                              <span>{SLOT_ICONS[slot.slot]}</span>
                              {slot.label}
                            </span>
                            <span className="text-white font-medium text-sm">{slot.count}次 · {slot.percentage}</span>
                          </div>
                          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${SLOT_COLORS[slot.slot]} transition-all duration-500`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'heatmap' && (
              <div className="space-y-6">
                {stats.heatmapData.map((hm, idx) => (
                  <HeatmapChart key={idx} data={hm} />
                ))}
              </div>
            )}

            {activeTab === 'report' && (
              <div className="space-y-6">
                <div className="p-8 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">分析报告</h3>
                      <p className="text-indigo-300/60 text-sm">生成于 {stats.report.generatedAt}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-600/30 flex items-center justify-center">
                      <FileText size={24} className="text-violet-300" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20 mb-6">
                    <p className="text-white/90 leading-relaxed">{stats.report.summary}</p>
                  </div>

                  <div className="space-y-4">
                    {stats.report.sections.map((section, idx) => (
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

                <div className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">详细数据</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { label: '总记录数', value: stats.report.totalRecords },
                      { label: '投掷天数', value: stats.rollCounts.totalDays },
                      { label: '日均投掷', value: stats.rollCounts.avgRollsPerDay },
                      { label: '高峰时段', value: stats.timeDist.peakSlot?.label || '-' },
                      { label: '高峰小时', value: stats.timeDist.peakHour !== null ? `${stats.timeDist.peakHour}时` : '-' },
                      { label: '连续天数', value: stats.rollCounts.currentStreak },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/5">
                        <div className="text-indigo-300/60 text-xs mb-1">{item.label}</div>
                        <div className="text-white font-semibold">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
