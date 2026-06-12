import React, { useState, useMemo } from 'react';
import { DiceResult } from '@/types';
import { generateDivinationInterpretation } from '@/utils/divinationData';
import { Sparkles, ChevronDown, ChevronUp, Lightbulb, Star, BookOpen, Wand2 } from 'lucide-react';

interface DivinationInterpretationProps {
  result: DiceResult;
  compact?: boolean;
}

const DivinationInterpretationComponent: React.FC<DivinationInterpretationProps> = ({ result, compact = false }) => {
  const [expanded, setExpanded] = useState(!compact);
  const [activeTab, setActiveTab] = useState<'overall' | 'planetSign' | 'planetHouse' | 'signHouse'>('overall');

  const interpretation = useMemo(() => {
    return generateDivinationInterpretation(result);
  }, [result]);

  if (compact) {
    return (
      <div className="rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 overflow-hidden">
        <div
          className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              <span className="text-white font-medium">占卜解析</span>
            </div>
            {expanded ? (
              <ChevronUp size={18} className="text-indigo-300/60" />
            ) : (
              <ChevronDown size={18} className="text-indigo-300/60" />
            )}
          </div>
        </div>

        {expanded && (
          <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-violet-500/15 border border-amber-500/30">
              <div className="flex items-start gap-2">
                <Wand2 size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-amber-200 text-sm leading-relaxed font-medium">
                  {interpretation.summary}
                </p>
              </div>
            </div>
            <p className="text-indigo-200/80 text-sm leading-relaxed">
              {interpretation.overall}
            </p>
            <div className="flex flex-wrap gap-2">
              {interpretation.keyThemes.map((theme, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30"
                >
                  {theme}
                </span>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-violet-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <Lightbulb size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-indigo-200/80 text-sm leading-relaxed">
                  {interpretation.advice}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative p-6 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-amber-500/5 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/30 to-violet-500/30 flex items-center justify-center">
            <Sparkles size={20} className="text-amber-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">占星骰子解析</h3>
            <p className="text-sm text-indigo-300/60">深入解读你的骰子组合</p>
          </div>
        </div>

        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-violet-500/15 to-amber-500/20 border border-amber-500/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-violet-400/5 pointer-events-none" />
          <div className="relative flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400/30 to-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Wand2 size={18} className="text-amber-300" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-300/70 mb-1.5">综合含义</div>
              <p className="text-lg font-semibold text-amber-100 leading-relaxed">
                {interpretation.summary}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-indigo-200/90 leading-relaxed">
            {interpretation.overall}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} className="text-amber-400" />
            <span className="text-sm font-medium text-white">关键主题</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {interpretation.keyThemes.map((theme, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-violet-500/20 to-amber-500/20 text-violet-200 border border-violet-500/30"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex border-b border-white/10 mb-4">
            <button
              onClick={() => setActiveTab('overall')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'overall'
                  ? 'text-violet-300 border-violet-400'
                  : 'text-indigo-300/60 border-transparent hover:text-indigo-200'
              }`}
            >
              行星落星座
            </button>
            <button
              onClick={() => setActiveTab('planetHouse')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'planetHouse'
                  ? 'text-violet-300 border-violet-400'
                  : 'text-indigo-300/60 border-transparent hover:text-indigo-200'
              }`}
            >
              行星落宫位
            </button>
            <button
              onClick={() => setActiveTab('signHouse')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'signHouse'
                  ? 'text-violet-300 border-violet-400'
                  : 'text-indigo-300/60 border-transparent hover:text-indigo-200'
              }`}
            >
              星座落宫位
            </button>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            {activeTab === 'overall' && (
              <p className="text-indigo-200/80 text-sm leading-relaxed">
                {interpretation.planetInSign}
              </p>
            )}
            {activeTab === 'planetHouse' && (
              <p className="text-indigo-200/80 text-sm leading-relaxed">
                {interpretation.planetInHouse}
              </p>
            )}
            {activeTab === 'signHouse' && (
              <p className="text-indigo-200/80 text-sm leading-relaxed">
                {interpretation.signInHouse}
              </p>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-violet-500/10 to-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb size={18} className="text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white mb-1">占卜建议</div>
              <p className="text-indigo-200/80 text-sm leading-relaxed">
                {interpretation.advice}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-indigo-300/40">
            <BookOpen size={12} className="inline mr-1" />
            以上解析仅供参考，命运掌握在你自己手中
          </p>
        </div>
      </div>
    </div>
  );
};

export default DivinationInterpretationComponent;
