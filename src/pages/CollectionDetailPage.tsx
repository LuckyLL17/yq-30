import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDiceStore } from '@/store/useDiceStore';
import { CollectionSortBy, DiceRecord } from '@/types';
import {
  ArrowLeft,
  SortAsc,
  Trash2,
  BarChart3,
  List,
  GripVertical,
  ChevronUp,
  ChevronDown,
  X,
  Clock,
  Globe,
  Sparkles,
} from 'lucide-react';
import {
  calculateFrequency,
  calculateCombinations,
  toChartData,
  getElementDistribution,
  getModalityDistribution,
} from '@/utils/statistics';
import StatsChart from '@/components/StatsChart';
import { getPlanetByName, getSignByName, formatDate } from '@/utils/diceData';
import Dice3D from '@/components/Dice3D';

const SORT_OPTIONS: { value: CollectionSortBy; label: string; icon: React.ReactNode }[] = [
  { value: 'custom', label: '自定义', icon: <GripVertical size={16} /> },
  { value: 'time-desc', label: '时间倒序', icon: <Clock size={16} /> },
  { value: 'time-asc', label: '时间正序', icon: <Clock size={16} /> },
  { value: 'planet', label: '按行星', icon: <Globe size={16} /> },
  { value: 'sign', label: '按星座', icon: <Sparkles size={16} /> },
  { value: 'house', label: '按宫位', icon: <List size={16} /> },
];

const CollectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    collections,
    getCollectionRecords,
    removeRecordFromCollection,
    reorderRecordsInCollection,
    deleteCollection,
  } = useDiceStore();

  const [sortBy, setSortBy] = useState<CollectionSortBy>('custom');
  const [showStats, setShowStats] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);

  const collection = useMemo(() => {
    return collections.find((c) => c.id === id);
  }, [collections, id]);

  const records = useMemo(() => {
    if (!collection) return [];
    return getCollectionRecords(collection.id, sortBy);
  }, [collection, sortBy, getCollectionRecords]);

  const stats = useMemo(() => {
    const total = records.length;
    const frequency = calculateFrequency(records);
    const combinations = calculateCombinations(records);
    const elementDist = getElementDistribution(records);
    const modalityDist = getModalityDistribution(records);

    return {
      total,
      planetData: toChartData(frequency.planet, total),
      signData: toChartData(frequency.sign, total),
      houseData: toChartData(frequency.house, total),
      combinations,
      elementDist,
      modalityDist,
    };
  }, [records]);

  const handleRemoveRecord = (recordId: string) => {
    if (!collection) return;
    removeRecordFromCollection(collection.id, recordId);
    setShowRemoveConfirm(null);
  };

  const handleMoveRecord = (index: number, direction: 'up' | 'down') => {
    if (!collection || sortBy !== 'custom') return;
    const newOrder = [...collection.recordIds];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    reorderRecordsInCollection(collection.id, newOrder);
  };

  const handleDeleteCollection = () => {
    if (!collection) return;
    if (confirm(`确定要删除合集"${collection.name}"吗？（不会删除合集中的记录）`)) {
      deleteCollection(collection.id);
      navigate('/collections');
    }
  };

  if (!collection) {
    return (
      <div className="relative z-10 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-indigo-300/70 mb-4">合集不存在</p>
          <button
            onClick={() => navigate('/collections')}
            className="text-violet-400 hover:text-violet-300"
          >
            返回合集列表
          </button>
        </div>
      </div>
    );
  }

  const MiniDice: React.FC<{ record: DiceRecord }> = ({ record }) => {
    const planet = getPlanetByName(record.planet);
    const sign = getSignByName(record.sign);

    return (
      <div className="flex -space-x-2">
        <div className="transform hover:scale-110 transition-transform">
          <Dice3D
            symbol={planet?.symbol || '?'}
            isRolling={false}
            gradientFrom="#f59e0b"
            gradientTo="#ea580c"
            borderColor="#fbbf24"
            size="sm"
          />
        </div>
        <div className="transform hover:scale-110 transition-transform">
          <Dice3D
            symbol={sign?.symbol || '?'}
            isRolling={false}
            gradientFrom="#8b5cf6"
            gradientTo="#7c3aed"
            borderColor="#a78bfa"
            size="sm"
          />
        </div>
        <div className="transform hover:scale-110 transition-transform">
          <Dice3D
            symbol={record.house.toString()}
            isRolling={false}
            gradientFrom="#3b82f6"
            gradientTo="#0891b2"
            borderColor="#60a5fa"
            size="sm"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="relative z-10 min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/collections')}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-indigo-300/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${collection.color}40, ${collection.color}10)`,
                  border: `1px solid ${collection.color}30`,
                }}
              >
                <List size={20} style={{ color: collection.color }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{collection.name}</h2>
                <p className="text-sm text-indigo-300/60">
                  {records.length} 条记录
                </p>
              </div>
            </div>
            {collection.description && (
              <p className="text-sm text-indigo-300/70 mt-2 ml-13">
                {collection.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                showStats
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-white/5 text-indigo-300/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <BarChart3 size={18} />
              统计分析
            </button>
            <button
              onClick={handleDeleteCollection}
              className="p-2 rounded-xl text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {showStats && records.length > 0 && (
          <div className="mb-8 p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-violet-400" />
              合集统计分析
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: '总记录数', value: stats.total, color: 'from-violet-500 to-purple-600' },
                {
                  label: '行星种类',
                  value: stats.planetData.filter((d) => d.value > 0).length,
                  color: 'from-amber-500 to-orange-600',
                },
                {
                  label: '星座种类',
                  value: stats.signData.filter((d) => d.value > 0).length,
                  color: 'from-blue-500 to-cyan-600',
                },
                {
                  label: '宫位种类',
                  value: stats.houseData.filter((d) => d.value > 0).length,
                  color: 'from-emerald-500 to-teal-600',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-indigo-300/70 text-sm mb-1">{item.label}</div>
                  <div
                    className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <StatsChart data={stats.planetData} title="行星分布" color="#f59e0b" />
              <StatsChart data={stats.signData} title="星座分布" color="#8b5cf6" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <StatsChart data={stats.elementDist} type="pie" title="四元素分布" />
              <StatsChart data={stats.modalityDist} type="pie" title="三方性分布" />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-indigo-300/60 mr-2">排序方式：</span>
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                sortBy === option.value
                  ? 'text-white'
                  : 'bg-white/5 text-indigo-300/70 hover:bg-white/10 hover:text-white'
              }`}
              style={{
                backgroundColor: sortBy === option.value ? collection.color : undefined,
                boxShadow: sortBy === option.value ? `0 0 15px ${collection.color}40` : undefined,
              }}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>

        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <List size={28} className="text-indigo-400/50" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">合集为空</h3>
            <p className="text-indigo-300/60 max-w-sm mb-4">
              去历史记录中，将记录添加到这个合集里吧
            </p>
            <button
              onClick={() => navigate('/records')}
              className="text-violet-400 hover:text-violet-300 text-sm"
            >
              前往历史记录 →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record, index) => (
              <div
                key={record.id}
                className="relative group flex items-center gap-4 p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all"
              >
                {sortBy === 'custom' && (
                  <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleMoveRecord(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded text-indigo-400/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => handleMoveRecord(index, 'down')}
                      disabled={index === records.length - 1}
                      className="p-1 rounded text-indigo-400/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                )}

                <div className="flex-shrink-0">
                  <MiniDice record={record} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{record.question}</div>
                  <div className="text-xs text-indigo-300/60 mt-0.5">
                    {formatDate(record.timestamp)}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-indigo-300/70">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                    {record.planet}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-300">
                    {record.sign}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">
                    {record.house}宫
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setShowRemoveConfirm(record.id)}
                    className="p-2 rounded-lg text-indigo-300/50 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>

                {showRemoveConfirm === record.id && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-950 border border-rose-500/30 shadow-lg">
                    <span className="text-xs text-rose-200">移除？</span>
                    <button
                      onClick={() => handleRemoveRecord(record.id)}
                      className="px-2 py-1 rounded text-xs bg-rose-600 text-white hover:bg-rose-500 transition-colors"
                    >
                      确认
                    </button>
                    <button
                      onClick={() => setShowRemoveConfirm(null)}
                      className="px-2 py-1 rounded text-xs bg-white/10 text-indigo-200 hover:bg-white/20 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetailPage;
