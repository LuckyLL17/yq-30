import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wind, Play, Pause, SkipForward, Clock, Sparkles, RotateCcw, Dices } from 'lucide-react';

type GuideStatus = 'idle' | 'running' | 'paused' | 'completed';
type BreathingPhase = 'inhale' | 'hold' | 'exhale';

interface DurationOption {
  label: string;
  seconds: number;
}

interface PhaseConfig {
  duration: number;
  label: string;
  description: string;
}

interface BreathingGuideProps {
  onStartRoll: () => void;
  onClose: () => void;
}

const DURATION_OPTIONS: DurationOption[] = [
  { label: '30秒', seconds: 30 },
  { label: '1分钟', seconds: 60 },
  { label: '2分钟', seconds: 120 },
];

const BREATHING_PHASES: Record<BreathingPhase, PhaseConfig> = {
  inhale: {
    duration: 4,
    label: '吸气',
    description: '深深吸入，感受宇宙的能量',
  },
  hold: {
    duration: 4,
    label: '屏息',
    description: '静静停留，让能量在体内流转',
  },
  exhale: {
    duration: 6,
    label: '呼气',
    description: '缓缓呼出，释放所有杂念',
  },
};

const PHASE_ORDER: BreathingPhase[] = ['inhale', 'hold', 'exhale'];

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const BreathingGuide: React.FC<BreathingGuideProps> = ({ onStartRoll, onClose }) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [status, setStatus] = useState<GuideStatus>('idle');
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');

  const mainTimerRef = useRef<number | null>(null);
  const phaseTimerRef = useRef<number | null>(null);
  const phaseCounterRef = useRef<number>(0);

  const clearAllTimers = useCallback(() => {
    if (mainTimerRef.current) {
      clearInterval(mainTimerRef.current);
      mainTimerRef.current = null;
    }
    if (phaseTimerRef.current) {
      clearInterval(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
  }, []);

  const stopBreathing = useCallback(() => {
    clearAllTimers();
    setStatus('paused');
  }, [clearAllTimers]);

  const resetToIdle = useCallback(() => {
    clearAllTimers();
    setStatus('idle');
    setTimeLeft(selectedDuration);
    setCurrentPhase('inhale');
    phaseCounterRef.current = 0;
  }, [clearAllTimers, selectedDuration]);

  const startPhase = useCallback((phase: BreathingPhase) => {
    setCurrentPhase(phase);

    if (phaseTimerRef.current) {
      clearInterval(phaseTimerRef.current);
    }

    let elapsed = 0;
    phaseTimerRef.current = window.setInterval(() => {
      elapsed += 1;
      if (elapsed >= BREATHING_PHASES[phase].duration) {
        clearInterval(phaseTimerRef.current!);
        phaseTimerRef.current = null;
      }
    }, 1000);
  }, []);

  const advancePhase = useCallback(() => {
    phaseCounterRef.current = (phaseCounterRef.current + 1) % PHASE_ORDER.length;
    const nextPhase = PHASE_ORDER[phaseCounterRef.current];
    startPhase(nextPhase);
  }, [startPhase]);

  const completeBreathing = useCallback(() => {
    clearAllTimers();
    setStatus('completed');
  }, [clearAllTimers]);

  const startBreathing = useCallback(() => {
    if (status === 'completed') return;

    phaseCounterRef.current = 0;
    setStatus('running');
    setTimeLeft((prev) => (prev === 0 ? selectedDuration : prev));
    startPhase('inhale');

    let phaseElapsed = 0;

    mainTimerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          completeBreathing();
          return 0;
        }
        return prev - 1;
      });

      phaseElapsed += 1;
      const currentPhaseDuration = BREATHING_PHASES[PHASE_ORDER[phaseCounterRef.current]].duration;
      if (phaseElapsed >= currentPhaseDuration) {
        phaseElapsed = 0;
        advancePhase();
      }
    }, 1000);
  }, [status, selectedDuration, startPhase, completeBreathing, advancePhase]);

  const handleDurationChange = useCallback((seconds: number) => {
    if (status === 'running') return;
    setSelectedDuration(seconds);
    if (status !== 'paused') {
      setTimeLeft(seconds);
    }
  }, [status]);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const progress = ((selectedDuration - timeLeft) / selectedDuration) * 100;
  const phaseConfig = BREATHING_PHASES[currentPhase];

  const renderControls = () => {
    if (status === 'completed') {
      return (
        <>
          <button
            onClick={onStartRoll}
            className="
              flex items-center gap-2 px-8 py-3 rounded-xl text-white font-medium
              bg-gradient-to-r from-violet-600 to-purple-600
              hover:from-violet-500 hover:to-purple-500
              transition-all duration-300 transform active:scale-[0.97]
              shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50
            "
          >
            <Dices size={20} />
            开始投掷
          </button>
          <button
            onClick={resetToIdle}
            className="
              flex items-center gap-2 px-6 py-3 rounded-xl text-indigo-300/70 font-medium
              bg-white/5 border border-white/10
              hover:bg-white/10 hover:text-white
              transition-all duration-300
            "
          >
            <RotateCcw size={18} />
            再来一次
          </button>
        </>
      );
    }

    if (status === 'running') {
      return (
        <>
          <button
            onClick={stopBreathing}
            className="
              flex items-center gap-2 px-8 py-3 rounded-xl text-white font-medium
              bg-amber-500/30 border border-amber-400/50
              hover:bg-amber-500/40
              transition-all duration-300 transform active:scale-[0.97]
            "
          >
            <Pause size={20} />
            暂停
          </button>
          <button
            onClick={onClose}
            className="
              flex items-center gap-2 px-6 py-3 rounded-xl text-indigo-300/70 font-medium
              bg-white/5 border border-white/10
              hover:bg-white/10 hover:text-white
              transition-all duration-300
            "
          >
            <SkipForward size={18} />
            跳过
          </button>
        </>
      );
    }

    return (
      <>
        <button
          onClick={startBreathing}
          className="
            flex items-center gap-2 px-8 py-3 rounded-xl text-white font-medium
            bg-gradient-to-r from-violet-600 to-purple-600
            hover:from-violet-500 hover:to-purple-500
            transition-all duration-300 transform active:scale-[0.97]
            shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50
          "
        >
          <Play size={20} />
          {status === 'paused' ? '继续呼吸' : '开始呼吸'}
        </button>
        <button
          onClick={onClose}
          className="
            flex items-center gap-2 px-6 py-3 rounded-xl text-indigo-300/70 font-medium
            bg-white/5 border border-white/10
            hover:bg-white/10 hover:text-white
            transition-all duration-300
          "
        >
          <SkipForward size={18} />
          跳过
        </button>
      </>
    );
  };

  const renderCenterText = () => {
    if (status === 'completed') {
      return (
        <>
          <div className="text-3xl font-bold text-white mb-2">
            <Sparkles size={36} className="inline text-amber-400 animate-pulse mr-2" />
            完成
          </div>
          <div className="text-sm text-violet-300 mb-1">
            静心已完成
          </div>
          <div className="text-xs text-indigo-400/60 max-w-36 mx-auto">
            当你准备好时，点击下方按钮开始投掷
          </div>
        </>
      );
    }

    return (
      <>
        <div className="text-4xl font-bold text-white mb-2 font-mono">
          {formatTime(timeLeft)}
        </div>
        <div className="text-lg font-medium text-violet-300 mb-1">
          {status === 'idle' ? '准备' : phaseConfig.label}
        </div>
        <div className="text-xs text-indigo-400/60 max-w-32 mx-auto">
          {status === 'idle' ? '选择时长，开始静心之旅' : phaseConfig.description}
        </div>
      </>
    );
  };

  return (
    <div className="relative max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Wind className="text-violet-400" size={24} />
          <h3 className="text-2xl font-bold text-white">专注呼吸引导</h3>
        </div>
        <p className="text-indigo-300/70 text-sm">
          静心凝神，让呼吸带你进入专注状态，为投掷骰子做好准备
        </p>
      </div>

      {status !== 'completed' && (
        <div className="flex justify-center gap-3 mb-8">
          {DURATION_OPTIONS.map((option) => (
            <button
              key={option.seconds}
              onClick={() => handleDurationChange(option.seconds)}
              disabled={status === 'running'}
              className={`
                px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${selectedDuration === option.seconds
                  ? 'bg-violet-500/30 border border-violet-400/50 text-white shadow-lg shadow-violet-500/20'
                  : 'bg-white/5 border border-white/10 text-indigo-300/70 hover:bg-white/10 hover:text-white'
                }
                ${status === 'running' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <Clock size={14} className="inline mr-1.5 -mt-0.5" />
              {option.label}
            </button>
          ))}
        </div>
      )}

      <div className="relative flex items-center justify-center mb-8">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div
            className={`
              absolute w-56 h-56 rounded-full border-2 border-violet-400/20
              breathing-ring-1
              ${status === 'running' ? 'opacity-100' : status === 'completed' ? 'opacity-80' : 'opacity-50'}
            `}
            style={{
              animationPlayState: status === 'running' ? 'running' : 'paused',
            }}
          />
          <div
            className={`
              absolute w-48 h-48 rounded-full border-2 border-violet-400/30
              breathing-ring-2
              ${status === 'running' ? 'opacity-100' : status === 'completed' ? 'opacity-80' : 'opacity-50'}
            `}
            style={{
              animationPlayState: status === 'running' ? 'running' : 'paused',
            }}
          />

          <div
            className={`
              absolute w-40 h-40 rounded-full
              ${status === 'completed'
                ? 'bg-gradient-to-br from-amber-500/20 via-violet-500/30 to-indigo-500/20 border-amber-400/50'
                : 'bg-gradient-to-br from-violet-500/20 via-purple-500/30 to-indigo-500/20 border-violet-400/40'
              }
              border
              breathing-circle
            `}
            style={{
              animationPlayState: status === 'running' ? 'running' : 'paused',
            }}
          />

          <div className="relative z-10 text-center">
            {renderCenterText()}
          </div>
        </div>

        <svg className="absolute w-64 h-64 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="rgba(139, 92, 246, 0.15)"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={status === 'completed' ? 'url(#completedGradient)' : 'url(#breathingGradient)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 46}`}
            strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}`}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="breathingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex items-center justify-center gap-4">
        {renderControls()}
      </div>

      {status === 'running' && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
            <Sparkles size={14} className="text-violet-400 animate-pulse" />
            <span className="text-xs text-violet-300/80">专注呼吸中... 感受内心的平静</span>
          </div>
        </div>
      )}

      {status === 'completed' && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-xs text-amber-300/80">呼吸引导已完成，愿你心神宁静</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreathingGuide;
