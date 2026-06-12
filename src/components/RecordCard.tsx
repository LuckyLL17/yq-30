import React, { useState, useMemo } from 'react';
import { DiceRecord, DiceResult } from '@/types';
import { useDiceStore } from '@/store/useDiceStore';
import { formatDate, getPlanetByName, getSignByName, getHouseByNumber } from '@/utils/diceData';
import { generateDivinationInterpretation } from '@/utils/divinationData';
import TypeTag from './TypeTag';
import Dice3D from './Dice3D';
import { Trash2, ChevronDown, ChevronUp, Sparkles, FolderPlus, Check, Folder } from 'lucide-react';

interface RecordCardProps {
  record: DiceRecord;
}

const MiniDice: React.FC<{
  symbol: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
}> = ({ symbol, gradientFrom, gradientTo, borderColor }) => (
  <div className="transform hover:scale-110 transition-transform duration-300">
    <Dice3D
      symbol={symbol}
      isRolling={false}
      gradientFrom={gradientFrom}
      gradientTo={gradientTo}
      borderColor={borderColor}
      size="sm"
    />
  </div>
);

const RecordCard: React.FC<RecordCardProps> = ({ record }) => {
  const { deleteRecord, collections, addRecordToCollection, removeRecordFromCollection, getCollectionsForRecord } = useDiceStore();
  const [expanded, setExpanded] = useState(false);
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);

  const recordCollections = useMemo(() => {
    return getCollectionsForRecord(record.id);
  }, [record.id, getCollectionsForRecord, collections]);

  const isInCollection = (collectionId: string) => {
    return recordCollections.some((c) => c.id === collectionId);
  };

  const toggleCollection = (collectionId: string) => {
    if (isInCollection(collectionId)) {
      removeRecordFromCollection(collectionId, record.id);
    } else {
      addRecordToCollection(collectionId, record.id);
    }
  };

  const planet = getPlanetByName(record.planet);
  const sign = getSignByName(record.sign);
  const house = getHouseByNumber(record.house);

  const interpretation = useMemo(() => {
    if (planet && sign && house) {
      const result: DiceResult = { planet, sign, house };
      return generateDivinationInterpretation(result);
    }
    return null;
  }, [planet, sign, house]);

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
          <div className="flex -space-x-3">
            {planet && (
              <MiniDice
                symbol={planet.symbol}
                gradientFrom="#f59e0b"
                gradientTo="#ea580c"
                borderColor="#fbbf24"
              />
            )}
            {sign && (
              <MiniDice
                symbol={sign.symbol}
                gradientFrom="#8b5cf6"
                gradientTo="#7c3aed"
                borderColor="#a78bfa"
              />
            )}
            {house && (
              <MiniDice
                symbol={house.number.toString()}
                gradientFrom="#3b82f6"
                gradientTo="#0891b2"
                borderColor="#60a5fa"
              />
            )}
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
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCollectionMenu(!showCollectionMenu);
              }}
              className="p-2 rounded-lg text-indigo-300/50 hover:text-violet-400 hover:bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-all"
            >
              <FolderPlus size={16} />
            </button>

            {showCollectionMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCollectionMenu(false);
                  }}
                />
                <div className="absolute right-0 top-full mt-2 z-30 w-56 p-2 rounded-xl bg-indigo-950 border border-white/10 shadow-2xl">
                  <div className="text-xs text-indigo-300/60 px-2 py-1.5 mb-1">添加到合集</div>
                  {collections.length === 0 ? (
                    <div className="px-3 py-4 text-center text-sm text-indigo-300/50">
                      暂无合集，先去创建一个吧
                    </div>
                  ) : (
                    <div className="space-y-0.5 max-h-60 overflow-y-auto">
                      {collections.map((collection) => {
                        const inCollection = isInCollection(collection.id);
                        return (
                          <button
                            key={collection.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCollection(collection.id);
                            }}
                            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-sm transition-all ${
                              inCollection
                                ? 'bg-violet-500/20 text-white'
                                : 'text-indigo-200/70 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <Folder
                              size={16}
                              style={{ color: inCollection ? collection.color : undefined }}
                              className={inCollection ? '' : 'text-indigo-400/50'}
                            />
                            <span className="flex-1 truncate">{collection.name}</span>
                            {inCollection && <Check size={14} className="text-violet-400" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

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
        <div className="pt-4 border-t border-white/10 mb-4">
          <div className="text-xs text-indigo-300/60 mb-2">解读笔记</div>
          <p className="text-indigo-200/80 text-sm leading-relaxed whitespace-pre-wrap">
            {record.notes}
          </p>
        </div>
      )}

      {expanded && interpretation && (
        <div className={`${record.notes ? '' : 'pt-4 border-t border-white/10'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-xs text-indigo-300/60">占卜解析</span>
          </div>
          <p className="text-indigo-200/80 text-sm leading-relaxed mb-3">
            {interpretation.overall}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {interpretation.keyThemes.map((theme, index) => (
              <span
                key={index}
                className="px-2 py-0.5 rounded-full text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30"
              >
                {theme}
              </span>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-violet-500/10 border border-amber-500/20">
            <p className="text-indigo-200/80 text-xs leading-relaxed">
              <span className="text-amber-400 font-medium">建议：</span>
              {interpretation.advice}
            </p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-violet-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default RecordCard;
