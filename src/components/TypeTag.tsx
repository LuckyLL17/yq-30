import React from 'react';
import { useDiceStore } from '@/store/useDiceStore';

interface TypeTagProps {
  typeId: string;
  className?: string;
}

const TypeTag: React.FC<TypeTagProps> = ({ typeId, className = '' }) => {
  const { questionTypes } = useDiceStore();
  const type = questionTypes.find(t => t.id === typeId);

  if (!type) return null;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
      style={{
        backgroundColor: type.color + '20',
        color: type.color,
        border: `1px solid ${type.color}40`,
      }}
    >
      {type.name}
    </span>
  );
};

export default TypeTag;
