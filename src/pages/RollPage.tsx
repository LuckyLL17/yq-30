import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useDiceStore } from '@/store/useDiceStore';
import DiceDisplay from '@/components/DiceDisplay';
import DiceForm from '@/components/DiceForm';
import DivinationInterpretation from '@/components/DivinationInterpretation';
import QuestionTemplateSelector from '@/components/QuestionTemplateSelector';
import BreathingGuide from '@/components/BreathingGuide';
import { Sparkles, Check, Palette, Wind } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useNavigate } from 'react-router-dom';
import { QuestionTemplate } from '@/utils/questionTemplates';
import { generateDivinationInterpretation } from '@/utils/divinationData';

const RollPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentResult, isRolling, rollTheDice, setRolling, getCurrentDiceSet, questionTypes } = useDiceStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<QuestionTemplate | null>(null);
  const [autoFillNotes, setAutoFillNotes] = useState<string>('');
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);
  const { playRollSound, playStopSound } = useSoundEffects();
  const rollTimerRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = () => {
    rollTimerRef.current.forEach((t) => clearTimeout(t));
    rollTimerRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const handleRoll = useCallback(() => {
    if (isRolling) return;
    clearTimers();

    const diceSet = getCurrentDiceSet();
    const animDuration = diceSet.animationPreset.duration;

    setRolling(true);
    rollTheDice();
    playRollSound(diceSet.rollSound);

    const t1 = setTimeout(() => {
      rollTheDice();
    }, animDuration * 0.35);
    rollTimerRef.current.push(t1);

    const t2 = setTimeout(() => {
      rollTheDice();
      playStopSound(diceSet.stopSound);
      setRolling(false);
      setShowInterpretation(true);
    }, animDuration);
    rollTimerRef.current.push(t2);
  }, [isRolling, rollTheDice, setRolling, getCurrentDiceSet, playRollSound, playStopSound]);

  useEffect(() => {
    if (currentResult && showInterpretation && !isRolling) {
      const interpretation = generateDivinationInterpretation(currentResult);
      const notesText = [
        `【综合解读】${interpretation.overall}`,
        '',
        `【行星落星座】${interpretation.planetInSign}`,
        '',
        `【行星落宫位】${interpretation.planetInHouse}`,
        '',
        `【星座落宫位】${interpretation.signInHouse}`,
        '',
        `【关键主题】${interpretation.keyThemes.join('、')}`,
        '',
        `【占卜建议】${interpretation.advice}`,
      ].join('\n');
      setAutoFillNotes(notesText);
    }
  }, [currentResult, showInterpretation, isRolling]);

  const handleSelectTemplate = useCallback((template: QuestionTemplate) => {
    setSelectedTemplate(template);
  }, []);

  const handleBreathingStartRoll = useCallback(() => {
    setShowBreathingGuide(false);
    setTimeout(() => handleRoll(), 300);
  }, [handleRoll]);

  const handleBreathingClose = useCallback(() => {
    setShowBreathingGuide(false);
  }, []);

  const handleFocusedRoll = useCallback(() => {
    if (isRolling) return;
    setShowBreathingGuide(true);
  }, [isRolling]);

  const handleSaved = useCallback(() => {
    setShowSuccess(true);
    setSelectedTemplate(null);
    setAutoFillNotes('');
    setTimeout(() => setShowSuccess(false), 2000);
  }, []);

  const currentDiceSet = getCurrentDiceSet();

  return (
    <div className="relative z-10 min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl font-bold text-white">
              <span className="bg-gradient-to-r from-violet-300 via-amber-200 to-violet-300 bg-clip-text text-transparent">
                投掷占星骰子
              </span>
            </h2>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => navigate('/dice-sets')}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-xl
                bg-white/5 border border-white/10 text-sm
                hover:bg-white/10 hover:border-violet-500/30 text-indigo-300/80 hover:text-white
                transition-all
              "
            >
              <Palette size={16} />
              <span>当前套装：</span>
              <span className="font-medium">{currentDiceSet.name}</span>
              <span className="text-indigo-400/40">|</span>
              <span>{currentDiceSet.animationPreset.name}</span>
            </button>
          </div>
          <p className="text-indigo-300/70 max-w-xl mx-auto">
            静心凝神，专注于你的问题，然后点击投掷按钮。骰子将揭示行星、星座和宫位的组合，为你指引方向。
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <QuestionTemplateSelector
            questionTypes={questionTypes}
            selectedTemplateId={selectedTemplate?.id || null}
            onSelectTemplate={handleSelectTemplate}
          />
        </div>

        {selectedTemplate && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl backdrop-blur-md bg-violet-500/10 border border-violet-500/20">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-violet-300" />
              <span className="text-sm text-violet-200">当前问题：</span>
              <span className="text-sm text-white font-medium">{selectedTemplate.question}</span>
            </div>
          </div>
        )}

        {showBreathingGuide ? (
          <div className="mb-10 p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
            <BreathingGuide
              onStartRoll={handleBreathingStartRoll}
              onClose={handleBreathingClose}
            />
          </div>
        ) : (
          <>
            <div className="mb-10">
              <DiceDisplay result={currentResult} isRolling={isRolling} />
            </div>

            <div className="flex flex-col items-center gap-4 mb-10">
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

              <button
                onClick={handleFocusedRoll}
                disabled={isRolling}
                className="
                  flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium
                  text-violet-300 bg-violet-500/10 border border-violet-500/30
                  hover:bg-violet-500/20 hover:text-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300
                "
              >
                <Wind size={18} />
                专注投掷（先呼吸静心）
              </button>
            </div>
          </>
        )}

        {currentResult && showInterpretation && !isRolling && (
          <div className="max-w-2xl mx-auto mb-8">
            <DivinationInterpretation result={currentResult} />
          </div>
        )}

        {currentResult && (
          <div className="max-w-2xl mx-auto p-6 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              记录本次结果
            </h3>
            <DiceForm
              result={currentResult}
              onSaved={handleSaved}
              initialQuestion={selectedTemplate?.question}
              initialQuestionType={selectedTemplate?.categoryId}
              autoFillNotes={autoFillNotes}
            />
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
