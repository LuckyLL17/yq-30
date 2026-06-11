import React, { useState, useEffect, useMemo } from 'react';

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
  const [displaySymbol, setDisplaySymbol] = useState(symbol);
  const [faces, setFaces] = useState<string[]>([]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };

  const faceSize = {
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
  }, [allSymbols, symbol]);

  useEffect(() => {
    if (!isRolling) {
      setDisplaySymbol(symbol);
      setFaces([symbol, symbol, symbol, symbol, symbol, symbol]);
    } else {
      setFaces(faceSymbols);
      const interval = setInterval(() => {
        if (allSymbols) {
          setDisplaySymbol(allSymbols[Math.floor(Math.random() * allSymbols.length)]);
        }
      }, 80);

      return () => clearInterval(interval);
    }
  }, [isRolling, symbol, allSymbols, faceSymbols]);

  const faceStyles = (index: number) => {
    const transforms = [
      'rotateY(0deg) translateZ(var(--half-size))',
      'rotateY(90deg) translateZ(var(--half-size))',
      'rotateY(180deg) translateZ(var(--half-size))',
      'rotateY(-90deg) translateZ(var(--half-size))',
      'rotateX(90deg) translateZ(var(--half-size))',
      'rotateX(-90deg) translateZ(var(--half-size))',
    ];

    return {
      transform: transforms[index],
    };
  };

  const sizeValue = size === 'sm' ? 64 : size === 'md' ? 80 : 96;
  const halfSize = sizeValue / 2;

  return (
    <div className="relative" style={{ perspective: '800px' }}>
      <div
        className={`${sizeClasses[size]} relative transition-transform duration-500`}
        style={{
          transformStyle: 'preserve-3d',
          '--half-size': `${halfSize}px`,
        } as React.CSSProperties}
      >
        <div
          className={`
            absolute inset-0 transform-gpu
            ${isRolling ? 'animate-dice-3d-roll' : ''}
          `}
          style={{
            transformStyle: 'preserve-3d',
            animationDelay: `${delay}ms`,
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className={`
                absolute ${faceSize[size]} rounded-2xl flex items-center justify-center
                border-2 shadow-xl
              `}
              style={{
                ...faceStyles(index),
                background: `linear-gradient(135deg, ${gradientFrom}40 0%, ${gradientTo}40 100%)`,
                borderColor: `${borderColor}60`,
                boxShadow: `inset 0 0 30px ${gradientFrom}20, 0 0 20px ${gradientTo}30`,
                backdropFilter: 'blur(10px)',
                backfaceVisibility: 'hidden',
              }}
            >
              <span
                className={`${symbolSizes[size]} text-white font-bold drop-shadow-lg`}
                style={{
                  textShadow: `0 0 20px ${gradientTo}`,
                }}
              >
                {isRolling ? faces[index] : displaySymbol}
              </span>

              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: `
                    radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 50%),
                    linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)
                  `,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full blur-md opacity-50"
        style={{
          background: `radial-gradient(ellipse, ${gradientTo}40 0%, transparent 70%)`,
        }}
      />
    </div>
  );
};

export default Dice3D;
