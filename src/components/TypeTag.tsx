import React from 'react';

interface TypeTagProps {
  name: string;
  color: string;
  className?: string;
}

const TypeTag: React.FC<TypeTagProps> = ({ name, color, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
      style={{
        backgroundColor: color + '20',
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      {name}
    </span>
  );
};

export default TypeTag;
