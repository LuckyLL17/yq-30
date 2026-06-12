import React from 'react';
import { DiceResult, DiceSet, RollForce } from '@/types';
import { PLANETS, SIGNS, HOUSES } from '@/utils/diceData';
import { useDiceStore } from '@/store/useDiceStore';
import Dice3D from './Dice3D';

interface DiceCardProps {
  title: string;
  symbol: string;
  name: string;
  meaning: string;
  extra?: string;
  isRolling: boolean;
  delay: number;
  diceSet: DiceSet;
  diceType: 'planet' | 'sign' | 'house';
  allSymbols: string[];
  rollForce?: RollForce;
}

const DiceCard: React.FC<DiceCardProps> = ({
  title,
  symbol,
  name,
  meaning,
  extra,
  isRolling,
  delay,
  diceSet,
  diceType,
  allSymbols,
  rollForce = 'normal',
}) => {
  const style = diceType === 'planet'
    ? diceSet.planetStyle
    : diceType === 'sign'
      ? diceSet.signStyle
      : diceSet.houseStyle;

  const { animationPreset } = diceSet;

  return (
    <div
      className={`
        relative flex flex-col items-center p-6 rounded-2xl
        backdrop-blur-md bg-white/5 border border-white/10
        transition-all duration-700 ease-out
        hover:bg-white/10 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10
      `}
      style={{
        boxShadow: isRolling ? `0 0 40px ${style.glowColor}30` : undefined,
      }}
    >
      <div
        className="text-xs uppercase tracking-widest mb-4"
        style={{ color: `${style.glowColor}cc` }}
      >
        {title}
      </div>

      <div className="mb-6 h-28 flex items-center justify-center">
        <Dice3D
          symbol={symbol}
          isRolling={isRolling}
          delay={delay}
          gradientFrom={style.gradientFrom}
          gradientTo={style.gradientTo}
          borderColor={style.borderColor}
          glowColor={style.glowColor}
          symbolColor={style.symbolColor}
          size={diceSet.size}
          allSymbols={allSymbols}
          animationName={animationPreset.animationName}
          animationDuration={animationPreset.duration}
          animationEasing={animationPreset.easing}
          rollForce={rollForce}
        />
      </div>

      <div className="text-xl font-bold text-white mb-1">{name}</div>

      {extra && (
        <div className="text-sm mb-2" style={{ color: `${style.glowColor}cc` }}>
          {extra}
        </div>
      )}

      <div className="text-xs text-indigo-300/60 text-center leading-relaxed">
        {meaning}
      </div>

      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${style.glowColor}10 0%, transparent 100%)`,
        }}
      />
    </div>
  );
};

const EmptyDiceCard: React.FC<{
  title: string;
  diceSet: DiceSet;
  diceType: 'planet' | 'sign' | 'house';
}> = ({ title, diceSet, diceType }) => {
  const style = diceType === 'planet'
    ? diceSet.planetStyle
    : diceType === 'sign'
      ? diceSet.signStyle
      : diceSet.houseStyle;

  const sizeClasses = {
    sm: 'w-16 h-16 text-3xl',
    md: 'w-20 h-20 text-4xl',
    lg: 'w-24 h-24 text-5xl',
  };

  return (
    <div className="flex flex-col items-center p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
      <div
        className="text-xs uppercase tracking-widest mb-4"
        style={{ color: `${style.glowColor}99` }}
      >
        {title}
      </div>
      <div className="mb-6 h-28 flex items-center justify-center">
        <div
          className={`${sizeClasses[diceSet.size]} rounded-2xl flex items-center justify-center border-2 font-bold`}
          style={{
            background: `linear-gradient(135deg, ${style.gradientFrom}20 0%, ${style.gradientTo}25 100%)`,
            borderColor: `${style.borderColor}40`,
            color: `${style.symbolColor}40`,
            boxShadow: `inset 0 0 30px ${style.glowColor}10`,
          }}
        >
          ?
        </div>
      </div>
      <div style={{ color: `${style.glowColor}60` }} className="text-sm">
        点击下方按钮投掷
      </div>
    </div>
  );
};

interface DiceDisplayProps {
  result: DiceResult | null;
  isRolling: boolean;
  rollForce?: RollForce;
}

const planetSymbols = PLANETS.map(p => p.symbol);
const signSymbols = SIGNS.map(s => s.symbol);
const houseNumbers = HOUSES.map(h => h.number.toString());

const DiceDisplay: React.FC<DiceDisplayProps> = ({ result, isRolling, rollForce = 'normal' }) => {
  const getCurrentDiceSet = useDiceStore((s) => s.getCurrentDiceSet);
  const diceSet = getCurrentDiceSet();

  if (!result) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EmptyDiceCard title="行星" diceSet={diceSet} diceType="planet" />
        <EmptyDiceCard title="星座" diceSet={diceSet} diceType="sign" />
        <EmptyDiceCard title="宫位" diceSet={diceSet} diceType="house" />
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
        diceSet={diceSet}
        diceType="planet"
        allSymbols={planetSymbols}
        rollForce={rollForce}
      />
      <DiceCard
        title="星座"
        symbol={sign.symbol}
        name={sign.name}
        meaning={sign.meaning}
        extra={`${sign.element}象 · ${sign.modality}星座`}
        isRolling={isRolling}
        delay={150}
        diceSet={diceSet}
        diceType="sign"
        allSymbols={signSymbols}
        rollForce={rollForce}
      />
      <DiceCard
        title="宫位"
        symbol={house.number.toString()}
        name={house.name}
        meaning={house.meaning}
        isRolling={isRolling}
        delay={300}
        diceSet={diceSet}
        diceType="house"
        allSymbols={houseNumbers}
        rollForce={rollForce}
      />
    </div>
  );
};

export default DiceDisplay;
