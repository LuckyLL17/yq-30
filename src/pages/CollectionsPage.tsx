import React, { useState } from 'react';
import { useDiceStore } from '@/store/useDiceStore';
import CollectionCard from '@/components/CollectionCard';
import { Plus, FolderOpen, X, Save } from 'lucide-react';
import { Collection } from '@/types';

const COLOR_OPTIONS = [
  '#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981',
  '#f59e0b', '#f97316', '#ef4444', '#6366f1', '#14b8a6',
];

const PRESET_COLLECTIONS = [
  { name: '感情发展追踪', description: '记录感情相关的占卜，观察发展趋势', color: '#ec4899' },
  { name: '事业发展追踪', description: '记录工作和事业相关的占卜', color: '#3b82f6' },
  { name: '财运追踪', description: '记录财务相关的占卜，观察财运变化', color: '#f59e0b' },
];

const CollectionsPage: React.FC = () => {
  const { collections, addCollection, updateCollection, deleteCollection } = useDiceStore();
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: COLOR_OPTIONS[0],
  });

  const openCreateModal = () => {
    setEditingCollection(null);
    setFormData({ name: '', description: '', color: COLOR_OPTIONS[0] });
    setShowModal(true);
  };

  const openEditModal = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description,
      color: collection.color,
    });
    setShowModal(true);
  };

  const handleDelete = (collection: Collection) => {
    if (confirm(`确定要删除合集"${collection.name}"吗？（不会删除合集中的记录）`)) {
      deleteCollection(collection.id);
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('请输入合集名称');
      return;
    }

    if (editingCollection) {
      updateCollection(editingCollection.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color,
      });
    } else {
      addCollection({
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color,
      });
    }

    setShowModal(false);
  };

  const selectPreset = (preset: { name: string; description: string; color: string }) => {
    setFormData({
      name: preset.name,
      description: preset.description,
      color: preset.color,
    });
  };

  return (
    <div className="relative z-10 min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-violet-300 via-amber-200 to-violet-300 bg-clip-text text-transparent">
                记录合集
              </span>
            </h2>
            <p className="text-indigo-300/70">
              共 {collections.length} 个合集，整理你的占卜记录
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all"
          >
            <Plus size={18} />
            新建合集
          </button>
        </div>

        {collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <FolderOpen size={40} className="text-indigo-400/50" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              还没有合集
            </h3>
            <p className="text-indigo-300/60 max-w-sm mb-6">
              创建合集来整理你的占卜记录，比如"感情发展追踪"、"事业发展追踪"等
            </p>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all"
            >
              <Plus size={18} />
              创建第一个合集
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-md bg-indigo-950 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {editingCollection ? '编辑合集' : '新建合集'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg text-indigo-300/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {!editingCollection && (
              <div className="mb-6">
                <label className="text-sm text-indigo-300/70 mb-2 block">快速选择模板</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLLECTIONS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => selectPreset(preset)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-indigo-200/70 hover:bg-white/10 hover:text-white transition-all border border-white/10"
                      style={{
                        borderColor: formData.name === preset.name ? preset.color : undefined,
                        color: formData.name === preset.name ? preset.color : undefined,
                      }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm text-indigo-300/70 mb-2 block">合集名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：感情发展追踪"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-indigo-300/40 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>

              <div>
                <label className="text-sm text-indigo-300/70 mb-2 block">描述（可选）</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="简单描述这个合集的用途..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-indigo-300/40 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-sm text-indigo-300/70 mb-2 block">主题颜色</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full transition-all ${
                        formData.color === color
                          ? 'scale-110'
                          : 'hover:scale-110'
                      }`}
                      style={{
                        backgroundColor: color,
                        boxShadow: formData.color === color
                          ? `0 0 0 2px #1e1b4b, 0 0 0 4px ${color}`
                          : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-indigo-200/70 hover:bg-white/10 hover:text-white transition-all font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all"
              >
                <Save size={18} />
                {editingCollection ? '保存' : '创建'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
