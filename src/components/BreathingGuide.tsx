import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wind, Play, Pause, SkipForward, Clock, Sparkles } from 'lucide-react';

interface BreathingGuideProps {
  onComplete: () => void;
  onSkip: () => void;
}

type BreathingPhase = 'idle' | 'inhale' | 'hold' | 'exhale';
type DurationOption = { label: string; seconds: number };

const DURATION_OPTIONS: DurationOption[] = [
  { label: '30秒', seconds: 30 },
  { label: '1分钟', seconds: 60 },
  { label: '2分钟', seconds: 120 },
];

const BREATHING_CYCLE = {
  inhale: 4,
  hold: 4,
  exhale: 6,
};

const BreathingGuide: React.FC<BreathingGuideProps> = ({ onComplete, onSkip }) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [phase, setPhase] = useState<BreathingPhase>('idle');
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const timerRef = useRef<number | null>(null);
  const phaseTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (phaseTimerRef.current) {
      clearInterval(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
  }, []);

  const startPhase = useCallback((newPhase: BreathingPhase, duration: number) => {
    setPhase(newPhase);
    setPhaseTimeLeft(duration);

    if (phaseTimerRef.current) {
      clearInterval(phaseTimerRef.current);
    }

    phaseTimerRef.current = window.setInterval(() => {
      setPhaseTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const startBreathing = useCallback(() => {
    setIsActive(true);
    setTimeLeft(selectedDuration);

    let currentPhase: BreathingPhase = 'inhale';
    let currentPhaseTime = BREATHING_CYCLE.inhale;
    startPhase('inhale', BREATHING_CYCLE.inhale);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimers();
          setIsActive(false);
          setPhase('idle');
          setTimeout(() => onComplete(), 500);
          return 0;
        }
        return prev - 1;
      });

      currentPhaseTime -= 1;
      if (currentPhaseTime <= 0) {
        if (currentPhase === 'inhale') {
          currentPhase = 'hold';
          currentPhaseTime = BREATHING_CYCLE.hold;
          startPhase('hold', BREATHING_CYCLE.hold);
        } else if (currentPhase === 'hold') {
          currentPhase = 'exhale';
          currentPhaseTime = BREATHING_CYCLE.exhale;
          startPhase('exhale', BREATHING_CYCLE.exhale);
        } else if (currentPhase === 'exhale') {
          currentPhase = 'inhale';
          currentPhaseTime = BREATHING_CYCLE.inhale;
          startPhase('inhale', BREATHING_CYCLE.inhale);
        }
      }
    }, 1000);
  }, [selectedDuration, clearTimers, startPhase, onComplete]);

  const pauseBreathing = useCallback(() => {
    setIsActive(false);
    clearTimers();
  }, [clearTimers]);

  const handleDurationChange = useCallback((seconds: number) => {
    if (isActive) return;
    setSelectedDuration(seconds);
    setTimeLeft(seconds);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return '吸气';
      case 'hold':
        return '屏息';
      case 'exhale':
        return '呼气';
      default:
        return '准备';
    }
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case 'inhale':
        return '深深吸入，感受宇宙的能量';
      case 'hold':
        return '静静停留，让能量在体内流转';
      case 'exhale':
        return '缓缓呼出，释放所有杂念';
      default:
        return '选择时长，开始静心之旅';
    }
  };

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const progress = ((selectedDuration - timeLeft) / selectedDuration) * 100;

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

      <div className="flex justify-center gap-3 mb-8">
        {DURATION_OPTIONS.map((option) => (
          <button
            key={option.seconds}
            onClick={() => handleDurationChange(option.seconds)}
            disabled={isActive}
            className={`
              px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300
              ${selectedDuration === option.seconds
                ? 'bg-violet-500/30 border border-violet-400/50 text-white shadow-lg shadow-violet-500/20'
                : 'bg-white/5 border border-white/10 text-indigo-300/70 hover:bg-white/10 hover:text-white'
              }
              ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <Clock size={14} className="inline mr-1.5 -mt-0.5" />
            {option.label}
          </button>
        ))}
      </div>

      <div className="relative flex items-center justify-center mb-8">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div
            className={`
              absolute w-56 h-56 rounded-full border-2 border-violet-400/20
              breathing-ring-1
              ${isActive ? 'opacity-100' : 'opacity-50'}
            `}
            style={{
              animationPlayState: isActive ? 'running' : 'paused',
            }}
          />
          <div
            className={`
              absolute w-48 h-48 rounded-full border-2 border-violet-400/30
              breathing-ring-2
              ${isActive ? 'opacity-100' : 'opacity-50'}
            `}
            style={{
              animationPlayState: isActive ? 'running' : 'paused',
            }}
          />

          <div
            className={`
              absolute w-40 h-40 rounded-full
              bg-gradient-to-br from-violet-500/20 via-purple-500/30 to-indigo-500/20
              border border-violet-400/40
              breathing-circle
              ${isActive ? '' : 'scale-100'}
            `}
            style={{
              animationPlayState: isActive ? 'running' : 'paused',
            }}
          />

          <div className="relative z-10 text-center">
            <div className="text-4xl font-bold text-white mb-2 font-mono">
              {formatTime(timeLeft)}
            </div>
            <div className="text-lg font-medium text-violet-300 mb-1">
              {getPhaseText()}
            </div>
            <div className="text-xs text-indigo-400/60 max-w-32 mx-auto">
              {getPhaseDescription()}
            </div>
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
            stroke="url(#breathingGradient)"
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
          </defs>
        </svg>
      </div>

      <div className="flex items-center justify-center gap-4">
        {!isActive ? (
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
            开始呼吸
          </button>
        ) : (
          <button
            onClick={pauseBreathing}
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
        )}

        <button
          onClick={onSkip}
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
      </div>

      {isActive && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
            <Sparkles size={14} className="text-violet-400 animate-pulse" />
            <span className="text-xs text-violet-300/80">专注呼吸中... 感受内心的平静</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreathingGuide;
