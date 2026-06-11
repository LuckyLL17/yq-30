import React, { useMemo } from 'react';

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

  return (
    <div 
      className="relative" 
      style={{ 
        perspective: '1000px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      <div
        className={`${sizeClasses[size]} relative`}
        style={{
          transformStyle: 'preserve-3d',
          '--half-size': `${halfSize}px`,
        } as React.CSSProperties}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            animationDelay: `${delay}ms`,
            willChange: 'transform',
            ...(isRolling
              ? {
                  animation: `${animationName} ${animationDuration}ms ${animationEasing} forwards`,
                  animationDelay: `${delay}ms`,
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
        className={`absolute left-1/2 -translate-x-1/2 ${shadowSizes[size]} rounded-full blur-md transition-all duration-300`}
        style={{
          top: `${sizeValue + 10}px`,
          background: `radial-gradient(ellipse, ${finalGlowColor}45 0%, transparent 75%)`,
          opacity: isRolling ? 0.8 : 0.45,
          transform: `translateX(-50%) scale(${isRolling ? 0.6 : 1})`,
        }}
      />
    </div>
  );
};

export default Dice3D;
