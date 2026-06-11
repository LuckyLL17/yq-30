import React from 'react';
import { DiceResult, Planet, Sign, House } from '@/types';

interface DiceCardProps {
  title: string;
  symbol: string;
  name: string;
  meaning: string;
  extra?: string;
  isRolling: boolean;
  delay: number;
  iconBg: string;
}

const DiceCard: React.FC<DiceCardProps> = ({
  title,
  symbol,
  name,
  meaning,
  extra,
  isRolling,
  delay,
  iconBg,
}) => {
  return (
    <div
      className={`
        relative flex flex-col items-center p-6 rounded-2xl
        backdrop-blur-md bg-white/5 border border-white/10
        transform transition-all duration-700 ease-out
        hover:bg-white/10 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10
        ${isRolling ? 'animate-dice-roll' : ''}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-xs text-indigo-300/70 uppercase tracking-widest mb-3">
        {title}
      </div>

      <div
        className={`
          w-24 h-24 rounded-full flex items-center justify-center mb-4
          ${iconBg}
          shadow-lg transform transition-transform duration-500
          ${isRolling ? 'scale-110' : 'hover:scale-105'}
        `}
      >
        <span className={`text-5xl text-white drop-shadow-lg ${isRolling ? 'animate-spin-slow' : ''}`}>
          {symbol}
        </span>
      </div>

      <div className="text-xl font-bold text-white mb-1">{name}</div>

      {extra && (
        <div className="text-sm text-amber-300/80 mb-2">{extra}</div>
      )}

      <div className="text-xs text-indigo-300/60 text-center leading-relaxed">
        {meaning}
      </div>

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-violet-500/10 to-transparent pointer-events-none" />
    </div>
  );
};

interface DiceDisplayProps {
  result: DiceResult | null;
  isRolling: boolean;
}

const DiceDisplay: React.FC<DiceDisplayProps> = ({ result, isRolling }) => {
  if (!result) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['行星', '星座', '宫位'].map((title, index) => (
          <div
            key={title}
            className="flex flex-col items-center p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10"
          >
            <div className="text-xs text-indigo-300/70 uppercase tracking-widest mb-3">
              {title}
            </div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-900/50 to-violet-900/50 flex items-center justify-center mb-4 border border-indigo-500/20">
              <span className="text-3xl text-indigo-400/50">?</span>
            </div>
            <div className="text-indigo-300/50 text-sm">点击下方按钮投掷</div>
          </div>
        ))}
      </div>
    );
  }

  const { planet, sign, house } = result;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DiceCard
        title="行星"
        symbol={planet.symbol}
        name={planet.name}
        meaning={planet.meaning}
        isRolling={isRolling}
        delay={0}
        iconBg="bg-gradient-to-br from-amber-500/30 to-orange-600/30 border border-amber-400/30"
      />
      <DiceCard
        title="星座"
        symbol={sign.symbol}
        name={sign.name}
        meaning={sign.meaning}
        extra={`${sign.element}象 · ${sign.modality}星座`}
        isRolling={isRolling}
        delay={150}
        iconBg="bg-gradient-to-br from-violet-500/30 to-purple-600/30 border border-violet-400/30"
      />
      <DiceCard
        title="宫位"
        symbol={house.number.toString()}
        name={house.name}
        meaning={house.meaning}
        isRolling={isRolling}
        delay={300}
        iconBg="bg-gradient-to-br from-blue-500/30 to-cyan-600/30 border border-blue-400/30"
      />
    </div>
  );
};

export default DiceDisplay;
