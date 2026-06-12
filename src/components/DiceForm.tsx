import React, { useState, useEffect } from 'react';
import { DiceResult } from '@/types';
import { useDiceStore } from '@/store/useDiceStore';
import { Save, Plus, X, Wand2 } from 'lucide-react';

interface DiceFormProps {
  result: DiceResult | null;
  onSaved: () => void;
  initialQuestion?: string;
  initialQuestionType?: string;
  autoFillNotes?: string;
}

const DiceForm: React.FC<DiceFormProps> = ({
  result,
  onSaved,
  initialQuestion,
  initialQuestionType,
  autoFillNotes,
}) => {
  const { questionTypes, addRecord, addQuestionType } = useDiceStore();
  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [notes, setNotes] = useState('');
  const [showNewType, setShowNewType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeColor, setNewTypeColor] = useState('#8b5cf6');

  useEffect(() => {
    if (initialQuestion !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuestion(initialQuestion);
    }
  }, [initialQuestion]);

  useEffect(() => {
    if (initialQuestionType !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuestionType(initialQuestionType);
    }
  }, [initialQuestionType]);

  useEffect(() => {
    if (autoFillNotes !== undefined && autoFillNotes !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotes(autoFillNotes);
    }
  }, [autoFillNotes]);

  useEffect(() => {
    if (result) {
      if (initialQuestion === undefined) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setQuestion('');
      }
      if (autoFillNotes === undefined) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNotes('');
      }
    }
  }, [result]);

  const handleFillInterpretation = () => {
    if (autoFillNotes) {
      setNotes(autoFillNotes);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!result || !question.trim()) return;

    addRecord({
      planet: result.planet.name,
      sign: result.sign.name,
      house: result.house.number,
      question: question.trim(),
      questionType: questionType || questionTypes[0]?.id || '',
      notes: notes.trim(),
    });

    setQuestion('');
    setNotes('');
    onSaved();
  };

  const handleAddType = () => {
    if (!newTypeName.trim()) return;
    addQuestionType({
      name: newTypeName.trim(),
      color: newTypeColor,
    });
    setNewTypeName('');
    setShowNewType(false);
  };

  const colorOptions = [
    '#ec4899', '#ef4444', '#f59e0b', '#10b981',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#6b7280',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-indigo-200 mb-2">
          你的问题 <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="例如：我和他的关系会如何发展？"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-indigo-300/40 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-indigo-200 mb-2">
          问题类型
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {questionTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setQuestionType(type.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${questionType === type.id
                  ? 'ring-2 ring-offset-2 ring-offset-indigo-950'
                  : 'opacity-60 hover:opacity-100'
                }
              `}
              style={{
                backgroundColor: type.color + '20',
                color: type.color,
                border: `1px solid ${type.color}40`,
                boxShadow: questionType === type.id ? `0 0 20px ${type.color}40` : 'none',
              }}
            >
              {type.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowNewType(!showNewType)}
            className="px-3 py-2 rounded-lg text-sm text-indigo-300 border border-dashed border-indigo-500/30 hover:border-violet-400/50 hover:text-violet-300 transition-all flex items-center gap-1"
          >
            <Plus size={16} />
            新建
          </button>
        </div>

        {showNewType && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="类型名称"
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-indigo-300/40 focus:outline-none focus:border-violet-500/50"
              />
              <button
                type="button"
                onClick={handleAddType}
                className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
              >
                添加
              </button>
              <button
                type="button"
                onClick={() => setShowNewType(false)}
                className="p-2 rounded-lg text-indigo-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewTypeColor(color)}
                  className={`w-8 h-8 rounded-full transition-transform ${newTypeColor === color ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-indigo-200">
            解读笔记
          </label>
          {autoFillNotes && notes !== autoFillNotes && (
            <button
              type="button"
              onClick={handleFillInterpretation}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-violet-300 bg-violet-500/15 border border-violet-500/25 hover:bg-violet-500/25 transition-all"
            >
              <Wand2 size={12} />
              填充解析
            </button>
          )}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="记录你对这个结果的解读和感悟..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-indigo-300/40 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={!result || !question.trim()}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-violet-500/30 active:scale-[0.98]"
      >
        <Save size={20} />
        保存记录
      </button>
    </form>
  );
};

export default DiceForm;
