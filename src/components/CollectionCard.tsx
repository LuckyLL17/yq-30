import React from 'react';
import { Collection } from '@/types';
import { useDiceStore } from '@/store/useDiceStore';
import { formatDateShort } from '@/utils/diceData';
import { Folder, ChevronRight, Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CollectionCardProps {
  collection: Collection;
  onEdit?: (collection: Collection) => void;
  onDelete?: (collection: Collection) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { getCollectionRecords } = useDiceStore();
  const records = getCollectionRecords(collection.id);
  const recordCount = records.length;

  const handleClick = () => {
    navigate(`/collections/${collection.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(collection);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(collection);
  };

  return (
    <div
      onClick={handleClick}
      className="relative group p-5 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all duration-300 cursor-pointer"
      style={{
        boxShadow: `0 0 0 1px ${collection.color}20 inset`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${collection.color}40, ${collection.color}10)`,
              border: `1px solid ${collection.color}30`,
            }}
          >
            <Folder size={24} style={{ color: collection.color }} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{collection.name}</h3>
            <p className="text-xs text-indigo-300/60">
              {recordCount} 条记录
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-2 rounded-lg text-indigo-300/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg text-indigo-300/50 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {collection.description && (
        <p className="text-sm text-indigo-200/70 line-clamp-2 mb-4">
          {collection.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="text-xs text-indigo-300/50">
          创建于 {formatDateShort(collection.createdAt)}
        </span>
        <ChevronRight size={18} className="text-indigo-400/50 group-hover:text-violet-400 transition-colors" />
      </div>

      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(to top, ${collection.color}10, transparent)`,
        }}
      />
    </div>
  );
};

export default CollectionCard;
