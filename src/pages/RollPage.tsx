import React, { useState, useCallback } from 'react';
import { useDiceStore } from '@/store/useDiceStore';
import DiceDisplay from '@/components/DiceDisplay';
import DiceForm from '@/components/DiceForm';
import { Sparkles, Check } from 'lucide-react';

const RollPage: React.FC = () => {
  const { currentResult, isRolling, rollTheDice, setRolling } = useDiceStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRoll = useCallback(() => {
    if (isRolling) return;

    setRolling(true);
    rollTheDice();

    setTimeout(() => {
      rollTheDice();
      setRolling(false);
    }, 1500);
  }, [isRolling, rollTheDice, setRolling]);

  const handleSaved = useCallback(() => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  }, []);

  return (
    <div className="relative z-10 min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-violet-300 via-amber-200 to-violet-300 bg-clip-text text-transparent">
              投掷占星骰子
            </span>
          </h2>
          <p className="text-indigo-300/70 max-w-xl mx-auto">
            静心凝神，专注于你的问题，然后点击投掷按钮。骰子将揭示行星、星座和宫位的组合，为你指引方向。
          </p>
        </div>

        <div className="mb-10">
          <DiceDisplay result={currentResult} isRolling={isRolling} />
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={handleRoll}
            disabled={isRolling}
            className="
              relative px-12 py-5 rounded-2xl text-xl font-bold text-white
              bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600
              hover:from-violet-500 hover:via-purple-500 hover:to-violet-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300 transform active:scale-[0.97]
              shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50
              overflow-hidden group
            "
          >
            <span className="relative z-10 flex items-center gap-3">
              {isRolling ? (
                <>
                  <Sparkles className="animate-pulse" size={24} />
                  投掷中...
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  投掷骰子
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>

        {currentResult && (
          <div className="max-w-2xl mx-auto p-6 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              记录本次结果
            </h3>
            <DiceForm result={currentResult} onSaved={handleSaved} />
          </div>
        )}

        {showSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/90 backdrop-blur-md text-white font-medium shadow-lg shadow-emerald-500/30">
              <Check size={20} />
              记录保存成功！
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RollPage;
