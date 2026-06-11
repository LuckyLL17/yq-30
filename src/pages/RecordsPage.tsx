import React, { useState, useMemo } from 'react';
import { useDiceStore } from '@/store/useDiceStore';
import RecordCard from '@/components/RecordCard';
import { Search, Filter, Trash2, LayoutList } from 'lucide-react';

const RecordsPage: React.FC = () => {
  const { records, questionTypes, clearAllRecords, searchRecords } = useDiceStore();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredRecords = useMemo(() => {
    let result = records;

    if (searchKeyword.trim()) {
      result = searchRecords(searchKeyword.trim());
    }

    if (selectedType !== 'all') {
      result = result.filter(r => r.questionType === selectedType);
    }

    return result;
  }, [records, searchKeyword, selectedType, searchRecords]);

  const handleClearAll = () => {
    if (confirm('确定要清空所有记录吗？此操作不可恢复！')) {
      clearAllRecords();
    }
  };

  return (
    <div className="relative z-10 min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-violet-300 via-amber-200 to-violet-300 bg-clip-text text-transparent">
                历史记录
              </span>
            </h2>
            <p className="text-indigo-300/70">
              共 {records.length} 条记录
              {filteredRecords.length !== records.length && `，已筛选 ${filteredRecords.length} 条`}
            </p>
          </div>

          {records.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-all text-sm"
            >
              <Trash2 size={16} />
              清空所有
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400/50" size={18} />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索问题、笔记或结果..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-indigo-300/40 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400/50" size={18} />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="pl-12 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="all" className="bg-indigo-950">全部类型</option>
              {questionTypes.map((type) => (
                <option key={type.id} value={type.id} className="bg-indigo-950">
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedType === 'all'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                : 'bg-white/5 text-indigo-300/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            全部
          </button>
          {questionTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedType === type.id
                  ? 'text-white shadow-lg'
                  : 'bg-white/5 text-indigo-300/70 hover:bg-white/10 hover:text-white'
              }`}
              style={{
                backgroundColor: selectedType === type.id ? type.color : undefined,
                boxShadow: selectedType === type.id ? `0 0 20px ${type.color}40` : undefined,
              }}
            >
              {type.name}
            </button>
          ))}
        </div>

        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <LayoutList size={36} className="text-indigo-400/50" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {records.length === 0 ? '暂无记录' : '没有匹配的记录'}
            </h3>
            <p className="text-indigo-300/60 max-w-sm">
              {records.length === 0
                ? '开始投掷骰子并记录你的问题和解读吧！'
                : '尝试调整搜索关键词或筛选条件'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordsPage;
