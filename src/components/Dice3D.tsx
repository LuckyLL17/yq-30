import React, { useMemo } from 'react';

interface Dice3DProps {
  symbol: string;
  isRolling: boolean;
  delay?: number;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  size?: 'sm' | 'md' | 'lg';
  allSymbols?: string[];
}

const Dice3D: React.FC<Dice3DProps> = ({
  symbol,
  isRolling,
  delay = 0,
  gradientFrom,
  gradientTo,
  borderColor,
  size = 'lg',
  allSymbols,
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
          className={`
            absolute inset-0
            ${isRolling ? 'animate-dice-3d-roll' : ''}
          `}
          style={{
            transformStyle: 'preserve-3d',
            animationDelay: `${delay}ms`,
            willChange: 'transform',
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
                background: `linear-gradient(135deg, ${gradientFrom}30 0%, ${gradientTo}40 100%)`,
                borderColor: `${borderColor}50`,
                boxShadow: `inset 0 2px 10px ${gradientFrom}15, 0 0 15px ${gradientTo}20`,
                backfaceVisibility: 'hidden',
                willChange: 'transform',
              }}
            >
              <span
                className={`${symbolSizes[size]} text-white font-bold select-none`}
                style={{
                  textShadow: `0 0 15px ${gradientTo}, 0 2px 4px rgba(0,0,0,0.3)`,
                  transform: 'translateZ(1px)',
                }}
              >
                {faceSymbol}
              </span>

              <div
                className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
                style={{
                  background: `
                    radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.25) 0%, transparent 40%),
                    linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%)
                  `,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute left-1/2 -translate-x-1/2 w-12 h-3 rounded-full blur-md transition-opacity duration-300"
        style={{
          top: `${sizeValue + 8}px`,
          background: `radial-gradient(ellipse, ${gradientTo}35 0%, transparent 70%)`,
          opacity: isRolling ? 0.7 : 0.4,
          transform: `translateX(-50%) scale(${isRolling ? 0.7 : 1})`,
        }}
      />
    </div>
  );
};

export default Dice3D;
