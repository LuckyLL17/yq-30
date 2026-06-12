import React from 'react';

interface HighlightCardProps {
  icon: string;
  iconGradient: string;
  label: string;
  value: React.ReactNode;
}

const HighlightCard: React.FC<HighlightCardProps> = ({ icon, iconGradient, label, value }) => {
  return (
    <div className="p-5 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${iconGradient} flex items-center justify-center text-lg`}>
          {icon}
        </div>
        <div>
          <div className="text-indigo-300/70 text-sm">{label}</div>
          <div className="text-white font-semibold">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default HighlightCard;
