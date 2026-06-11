import React, { useState } from 'react';
import { DiceRecord } from '@/types';
import { useDiceStore } from '@/store/useDiceStore';
import { formatDate, getPlanetByName, getSignByName, getHouseByNumber } from '@/utils/diceData';
import TypeTag from './TypeTag';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface RecordCardProps {
  record: DiceRecord;
}

const RecordCard: React.FC<RecordCardProps> = ({ record }) => {
  const { deleteRecord } = useDiceStore();
  const [expanded, setExpanded] = useState(false);

  const planet = getPlanetByName(record.planet);
  const sign = getSignByName(record.sign);
  const house = getHouseByNumber(record.house);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这条记录吗？')) {
      deleteRecord(record.id);
    }
  };

  return (
    <div
      className="relative p-5 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all duration-300 cursor-pointer group"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-600/30 border border-amber-400/30 flex items-center justify-center text-lg">
              {planet?.symbol}
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-600/30 border border-violet-400/30 flex items-center justify-center text-lg">
              {sign?.symbol}
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-600/30 border border-blue-400/30 flex items-center justify-center text-lg font-bold">
              {house?.number}
            </div>
          </div>
          <div>
            <div className="text-white font-medium line-clamp-1">
              {record.question}
            </div>
            <div className="text-xs text-indigo-300/60 mt-0.5">
              {formatDate(record.timestamp)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TypeTag typeId={record.questionType} />
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg text-indigo-300/50 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={16} />
          </button>
          {expanded ? <ChevronUp size={18} className="text-indigo-300/50" /> : <ChevronDown size={18} className="text-indigo-300/50" />}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-xl bg-white/5">
          <div className="text-xs text-indigo-300/60 mb-1">行星</div>
          <div className="text-white font-semibold">{record.planet}</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/5">
          <div className="text-xs text-indigo-300/60 mb-1">星座</div>
          <div className="text-white font-semibold">{record.sign}</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/5">
          <div className="text-xs text-indigo-300/60 mb-1">宫位</div>
          <div className="text-white font-semibold">{record.house}宫</div>
        </div>
      </div>

      {expanded && record.notes && (
        <div className="pt-4 border-t border-white/10">
          <div className="text-xs text-indigo-300/60 mb-2">解读笔记</div>
          <p className="text-indigo-200/80 text-sm leading-relaxed whitespace-pre-wrap">
            {record.notes}
          </p>
        </div>
      )}

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-violet-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default RecordCard;
