import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiceStore } from '@/store/useDiceStore';
import { DiceSet } from '@/types';
import Dice3D from '@/components/Dice3D';
import { Palette, Plus, Check, Edit2, Trash2, Volume2, Sparkles, GripVertical } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const DiceSetCard: React.FC<{
  diceSet: DiceSet;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ diceSet, isActive, onSelect, onEdit, onDelete }) => {
  const { previewSound } = useSoundEffects();

  return (
    <div
      className={`
        relative p-6 rounded-3xl backdrop-blur-md border-2 transition-all duration-500 cursor-pointer
        ${isActive
          ? 'bg-white/10 border-violet-400/60 shadow-2xl shadow-violet-500/20 scale-[1.02]'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
        }
      `}
      onClick={onSelect}
    >
      {isActive && (
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-amber-400 flex items-center justify-center shadow-lg shadow-violet-500/40">
          <Check size={20} className="text-white" />
        </div>
      )}

      <div className="mb-4">
        <h4 className="text-lg font-bold text-white mb-1">{diceSet.name}</h4>
        <p className="text-sm text-indigo-300/60 line-clamp-2">{diceSet.description}</p>
      </div>

      <div className="flex items-center justify-center gap-4 py-6 mb-4">
        <div className="transform hover:scale-110 transition-transform">
          <Dice3D
            symbol="☉"
            isRolling={false}
            gradientFrom={diceSet.planetStyle.gradientFrom}
            gradientTo={diceSet.planetStyle.gradientTo}
            borderColor={diceSet.planetStyle.borderColor}
            glowColor={diceSet.planetStyle.glowColor}
            symbolColor={diceSet.planetStyle.symbolColor}
            size="sm"
          />
        </div>
        <GripVertical size={20} className="text-indigo-400/30" />
        <div className="transform hover:scale-110 transition-transform">
          <Dice3D
            symbol="♈"
            isRolling={false}
            gradientFrom={diceSet.signStyle.gradientFrom}
            gradientTo={diceSet.signStyle.gradientTo}
            borderColor={diceSet.signStyle.borderColor}
            glowColor={diceSet.signStyle.glowColor}
            symbolColor={diceSet.signStyle.symbolColor}
            size="sm"
          />
        </div>
        <GripVertical size={20} className="text-indigo-400/30" />
        <div className="transform hover:scale-110 transition-transform">
          <Dice3D
            symbol="Ⅰ"
            isRolling={false}
            gradientFrom={diceSet.houseStyle.gradientFrom}
            gradientTo={diceSet.houseStyle.gradientTo}
            borderColor={diceSet.houseStyle.borderColor}
            glowColor={diceSet.houseStyle.glowColor}
            symbolColor={diceSet.houseStyle.symbolColor}
            size="sm"
          />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-indigo-300/70">
          <Sparkles size={14} />
          <span>{diceSet.animationPreset.name}</span>
          <span className="text-indigo-400/40">·</span>
          <span>{diceSet.animationPreset.duration}ms</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-indigo-300/70">
          <Volume2 size={14} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              previewSound(diceSet.rollSound);
            }}
            className="hover:text-white transition-colors underline underline-offset-2"
          >
            {diceSet.rollSound.name}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-white/5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="
            flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
            bg-white/5 border border-white/10 text-white text-sm
            hover:bg-white/10 hover:border-violet-500/30 transition-all
          "
        >
          <Edit2 size={16} />
          编辑
        </button>
        {!diceSet.isDefault && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('确定要删除这个骰子套装吗？此操作不可撤销。')) {
                onDelete();
              }
            }}
            className="
              p-2.5 rounded-xl bg-white/5 border border-white/10
              text-indigo-300/60 hover:text-rose-400 hover:bg-rose-500/10
              hover:border-rose-500/30 transition-all
            "
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

const DiceSetsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    diceSets,
    currentDiceSetId,
    setCurrentDiceSet,
    deleteDiceSet,
    addDiceSet,
  } = useDiceStore();
  const { createDefaultDiceSet } = require('@/utils/diceSetPresets');

  const handleCreateNew = () => {
    const newSet = addDiceSet(createDefaultDiceSet());
    navigate(`/dice-sets/edit/${newSet.id}`);
  };

  return (
    <div className="relative z-10 min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-violet-300 via-amber-200 to-violet-300 bg-clip-text text-transparent flex items-center gap-3">
                <Palette className="inline-block" size={32} />
                我的骰子套装
              </span>
            </h2>
            <p className="text-indigo-300/70 max-w-xl">
              创建属于你自己的虚拟骰子套装，自定义每颗骰子的颜色、发光效果、动画样式和投掷音效。
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="
              inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white
              bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600
              hover:from-violet-500 hover:via-purple-500 hover:to-violet-500
              transition-all duration-300 transform active:scale-[0.97]
              shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50
              overflow-hidden group
            "
          >
            <Plus size={20} />
            创建新套装
          </button>
        </div>

        {diceSets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl bg-white/5 border border-white/10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-amber-500/20 flex items-center justify-center mb-5 border border-violet-500/20">
              <Palette size={36} className="text-violet-300" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">还没有骰子套装</h4>
            <p className="text-indigo-300/60 max-w-sm mb-6">
              创建你的第一个骰子套装，定制独一无二的视觉风格和音效
            </p>
            <button
              onClick={handleCreateNew}
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white
                bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600
                hover:from-violet-500 hover:via-purple-500 hover:to-violet-500
                transition-all duration-300 transform active:scale-[0.97]
                shadow-xl shadow-violet-500/30
              "
            >
              <Plus size={20} />
              创建套装
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diceSets.map((diceSet) => (
              <DiceSetCard
                key={diceSet.id}
                diceSet={diceSet}
                isActive={diceSet.id === currentDiceSetId}
                onSelect={() => setCurrentDiceSet(diceSet.id)}
                onEdit={() => navigate(`/dice-sets/edit/${diceSet.id}`)}
                onDelete={() => deleteDiceSet(diceSet.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-12 p-6 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-amber-400" />
            快速切换当前使用的骰子套装
          </h4>
          <p className="text-sm text-indigo-300/60">
            点击上方任意套装卡片即可将其设为当前使用。首页和每日一骰页面会立即应用你选择的骰子样式、动画和音效。
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiceSetsPage;
