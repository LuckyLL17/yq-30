import React, { useMemo, useState } from 'react';
import { useDiceStore } from '@/store/useDiceStore';
import {
  calculateFrequency,
  calculateCombinations,
  toChartData,
  getElementDistribution,
  getModalityDistribution,
} from '@/utils/statistics';
import StatsChart from '@/components/StatsChart';
import { getPlanetByName, getSignByName } from '@/utils/diceData';
import { BarChart3, TrendingUp, Layers, Sparkles } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const { records, questionTypes } = useDiceStore();
  const [activeTab, setActiveTab] = useState<'frequency' | 'combinations' | 'distribution'>('frequency');

  const totalRecords = records.length;

  const stats = useMemo(() => {
    const frequency = calculateFrequency(records);
    const combinations = calculateCombinations(records);
    const elementDist = getElementDistribution(records);
    const modalityDist = getModalityDistribution(records);

    return {
      planetData: toChartData(frequency.planet, totalRecords),
      signData: toChartData(frequency.sign, totalRecords),
      houseData: toChartData(frequency.house, totalRecords),
      combinations,
      elementDist,
      modalityDist,
    };
  }, [records, totalRecords]);

  const tabs = [
    { id: 'frequency', label: '频率统计', icon: BarChart3 },
    { id: 'combinations', label: '组合分析', icon: TrendingUp },
    { id: 'distribution', label: '分布特征', icon: Layers },
  ] as const;

  const getTypeName = (typeId: string) => {
    return questionTypes.find(t => t.id === typeId)?.name || typeId;
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
            <div className="flex justify-center gap-2 mb-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all
                      ${activeTab === tab.id
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                        : 'bg-white/5 text-indigo-300/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <Icon size={18} />
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
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
