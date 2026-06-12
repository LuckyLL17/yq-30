import React from 'react';

interface StatCardProps {
  label: React.ReactNode;
  value: string | number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color = 'from-violet-500 to-purple-600', size = 'md' }) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  const textSizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-2xl backdrop-blur-md bg-white/5 border border-white/10`}>
      <div className="text-indigo-300/70 text-sm mb-2">{label}</div>
      <div className={`${textSizeClasses[size]} font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
        {value}
      </div>
    </div>
  );
};

export default StatCard;
