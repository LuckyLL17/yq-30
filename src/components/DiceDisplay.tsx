import React from 'react';
import { DiceResult, Planet, Sign, House } from '@/types';
import { PLANETS, SIGNS, HOUSES } from '@/utils/diceData';
import Dice3D from './Dice3D';

interface DiceCardProps {
  title: string;
  symbol: string;
  name: string;
  meaning: string;
  extra?: string;
  isRolling: boolean;
  delay: number;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  allSymbols: string[];
}

const DiceCard: React.FC<DiceCardProps> = ({
  title,
  symbol,
  name,
  meaning,
  extra,
  isRolling,
  delay,
  gradientFrom,
  gradientTo,
  borderColor,
  allSymbols,
}) => {
  return (
    <div
      className={`
        relative flex flex-col items-center p-6 rounded-2xl
        backdrop-blur-md bg-white/5 border border-white/10
        transition-all duration-700 ease-out
        hover:bg-white/10 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10
      `}
    >
      <div className="text-xs text-indigo-300/70 uppercase tracking-widest mb-4">
        {title}
      </div>

      <div className="mb-6 h-28 flex items-center justify-center">
        <Dice3D
          symbol={symbol}
          isRolling={isRolling}
          delay={delay}
          gradientFrom={gradientFrom}
          gradientTo={gradientTo}
          borderColor={borderColor}
          size="lg"
          allSymbols={allSymbols}
        />
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

const EmptyDiceCard: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex flex-col items-center p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
      <div className="text-xs text-indigo-300/70 uppercase tracking-widest mb-4">
        {title}
      </div>
      <div className="mb-6 h-28 flex items-center justify-center">
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center border-2 border-indigo-500/30"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            boxShadow: 'inset 0 0 30px rgba(99, 102, 241, 0.1)',
          }}
        >
          <span className="text-4xl text-indigo-400/50 font-bold">?</span>
        </div>
      </div>
      <div className="text-indigo-300/50 text-sm">点击下方按钮投掷</div>
    </div>
  );
};

interface DiceDisplayProps {
  result: DiceResult | null;
  isRolling: boolean;
}

const planetSymbols = PLANETS.map(p => p.symbol);
const signSymbols = SIGNS.map(s => s.symbol);
const houseNumbers = HOUSES.map(h => h.number.toString());

const DiceDisplay: React.FC<DiceDisplayProps> = ({ result, isRolling }) => {
  if (!result) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EmptyDiceCard title="行星" />
        <EmptyDiceCard title="星座" />
        <EmptyDiceCard title="宫位" />
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
        gradientFrom="#f59e0b"
        gradientTo="#ea580c"
        borderColor="#fbbf24"
        allSymbols={planetSymbols}
      />
      <DiceCard
        title="星座"
        symbol={sign.symbol}
        name={sign.name}
        meaning={sign.meaning}
        extra={`${sign.element}象 · ${sign.modality}星座`}
        isRolling={isRolling}
        delay={150}
        gradientFrom="#8b5cf6"
        gradientTo="#7c3aed"
        borderColor="#a78bfa"
        allSymbols={signSymbols}
      />
      <DiceCard
        title="宫位"
        symbol={house.number.toString()}
        name={house.name}
        meaning={house.meaning}
        isRolling={isRolling}
        delay={300}
        gradientFrom="#3b82f6"
        gradientTo="#0891b2"
        borderColor="#60a5fa"
        allSymbols={houseNumbers}
      />
    </div>
  );
};

export default DiceDisplay;
