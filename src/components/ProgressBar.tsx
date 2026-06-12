import React from 'react';

interface ProgressBarProps {
  percentage: number;
  color?: string;
  gradient?: string;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: React.ReactNode;
  value?: React.ReactNode;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color,
  gradient,
  height = 'md',
  showLabel = false,
  label,
  value,
}) => {
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const barStyle = gradient
    ? { background: `linear-gradient(to right, ${gradient})` }
    : { backgroundColor: color };

  return (
    <div>
      {showLabel && (label || value) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-indigo-200 text-sm">{label}</span>}
          {value && <span className="text-white font-medium text-sm">{value}</span>}
        </div>
      )}
      <div className={`w-full ${heightClasses[height]} rounded-full bg-white/10 overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            ...barStyle,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
