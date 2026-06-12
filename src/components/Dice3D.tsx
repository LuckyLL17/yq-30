import React, { useMemo } from 'react';
import { RollForce, ROLL_FORCE_CONFIG } from '@/types';

interface Dice3DProps {
  symbol: string;
  isRolling: boolean;
  delay?: number;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  glowColor?: string;
  symbolColor?: string;
  size?: 'sm' | 'md' | 'lg';
  allSymbols?: string[];
  animationName?: string;
  animationDuration?: number;
  animationEasing?: string;
  rollForce?: RollForce;
}

const Dice3D: React.FC<Dice3DProps> = ({
  symbol,
  isRolling,
  delay = 0,
  gradientFrom,
  gradientTo,
  borderColor,
  glowColor,
  symbolColor = '#ffffff',
  size = 'lg',
  allSymbols,
  animationName = 'dice-3d-roll',
  animationDuration = 1500,
  animationEasing = 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  rollForce = 'normal',
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };

  const symbolSizes = {
    sm: 'text-3xl',
    md: 'text-4xl',
    lg: 'text-5xl',
  };

  const shadowSizes = {
    sm: 'w-10 h-2',
    md: 'w-12 h-3',
    lg: 'w-14 h-3',
  };

  const glowSizes = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
  };

  const isMagic = animationName === 'dice-magic-roll';

  const forceConfig = ROLL_FORCE_CONFIG[rollForce] || ROLL_FORCE_CONFIG.normal;
  const adjustedDuration = Math.round(animationDuration * forceConfig.durationMultiplier);
  const intensityScale = forceConfig.intensity;

  const forceAnimationName = useMemo(() => {
    if (rollForce === 'gentle') return 'dice-gentle-roll';
    if (rollForce === 'strong') return 'dice-strong-roll';
    if (rollForce === 'fierce') return 'dice-fierce-roll';
    return animationName;
  }, [rollForce, animationName]);

  const faceSymbols = useMemo(() => {
    if (allSymbols && allSymbols.length >= 6) {
      const shuffled = [...allSymbols].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 6);
    }
    return [symbol, symbol, symbol, symbol, symbol, symbol];
  }, [allSymbols, symbol, isRolling]);

  const faceTransforms = [
    'rotateY(0deg) translateZ(var(--half-size))',
    'rotateY(90deg) translateZ(var(--half-size))',
    'rotateY(180deg) translateZ(var(--half-size))',
    'rotateY(-90deg) translateZ(var(--half-size))',
    'rotateX(90deg) translateZ(var(--half-size))',
    'rotateX(-90deg) translateZ(var(--half-size))',
  ];

  const sizeValue = size === 'sm' ? 64 : size === 'md' ? 80 : 96;
  const halfSize = sizeValue / 2;

  const displayFaces = isRolling ? faceSymbols : [symbol, symbol, symbol, symbol, symbol, symbol];
  const finalGlowColor = glowColor || gradientTo;
  const glowIntensity = isRolling ? 0.6 + intensityScale * 0.3 : 0.45;

  return (
    <div
      className="relative"
      style={{
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {isMagic && isRolling && (
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${glowSizes[size]} pointer-events-none rounded-full`}
          style={{
            zIndex: 0,
            animationName: 'dice-magic-glow',
            animationDuration: `${adjustedDuration}ms`,
            animationTimingFunction: animationEasing,
            animationDelay: `${delay}ms`,
            animationFillMode: 'forwards',
            background: `radial-gradient(circle, ${finalGlowColor}90 0%, ${finalGlowColor}50 25%, transparent 60%)`,
            boxShadow: `0 0 ${60 * intensityScale}px ${finalGlowColor}60, 0 0 ${120 * intensityScale}px ${finalGlowColor}30`,
            mixBlendMode: 'screen',
          }}
        />
      )}

      <div
        className={`${sizeClasses[size]} relative`}
        style={{
          zIndex: 1,
          transformStyle: 'preserve-3d',
          '--half-size': `${halfSize}px`,
        } as React.CSSProperties}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            ...(isRolling
              ? {
                  animationName: forceAnimationName,
                  animationDuration: `${adjustedDuration}ms`,
                  animationTimingFunction: animationEasing,
                  animationFillMode: 'forwards',
                  animationDelay: `${delay}ms`,
                  animationIterationCount: 1,
                }
              : {}),
          }}
        >
          {displayFaces.map((faceSymbol, index) => (
            <div
              key={index}
              className={`
                absolute ${sizeClasses[size]} rounded-2xl flex items-center justify-center
                border-2
              `}
              style={{
                transform: faceTransforms[index],
                background: `linear-gradient(135deg, ${gradientFrom}35 0%, ${gradientTo}45 100%)`,
                borderColor: `${borderColor}60`,
                boxShadow: `inset 0 2px 12px ${gradientFrom}20, 0 0 20px ${finalGlowColor}30`,
                backfaceVisibility: 'hidden',
                willChange: 'transform',
              }}
            >
              <span
                className={`${symbolSizes[size]} font-bold select-none`}
                style={{
                  color: symbolColor,
                  textShadow: `0 0 18px ${finalGlowColor}, 0 2px 4px rgba(0,0,0,0.4)`,
                  transform: 'translateZ(1px)',
                }}
              >
                {faceSymbol}
              </span>

              <div
                className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
                style={{
                  background: `
                    radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.3) 0%, transparent 45%),
                    linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 55%)
                  `,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className={`absolute left-1/2 -translate-x-1/2 ${shadowSizes[size]} rounded-full blur-md transition-all duration-300 pointer-events-none`}
        style={{
          zIndex: 0,
          top: `${sizeValue + 10}px`,
          background: `radial-gradient(ellipse, ${finalGlowColor}45 0%, transparent 75%)`,
          opacity: isRolling ? glowIntensity : 0.45,
          transform: `translateX(-50%) scale(${isRolling ? 0.4 + (1 - intensityScale * 0.4) : 1})`,
        }}
      />
    </div>
  );
};

export default Dice3D;
