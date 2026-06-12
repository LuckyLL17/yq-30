import React from 'react';

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  children,
  className = '',
  contentClassName = '',
}) => {
  return (
    <div
      className={`p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 ${className}`}
    >
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      <div className={contentClassName}>{children}</div>
    </div>
  );
};

export default SectionCard;
