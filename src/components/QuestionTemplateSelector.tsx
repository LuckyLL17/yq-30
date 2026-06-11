import React, { useState } from 'react';
import { QUESTION_TEMPLATES, QuestionTemplate } from '@/utils/questionTemplates';
import { QuestionType } from '@/types';
import { MessageCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface QuestionTemplateSelectorProps {
  questionTypes: QuestionType[];
  selectedTemplateId: string | null;
  onSelectTemplate: (template: QuestionTemplate) => void;
}

const QuestionTemplateSelector: React.FC<QuestionTemplateSelectorProps> = ({
  questionTypes,
  selectedTemplateId,
  onSelectTemplate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('1');

  const filteredTemplates = QUESTION_TEMPLATES.filter(
    (t) => t.categoryId === activeCategory
  );

  const activeType = questionTypes.find((t) => t.id === activeCategory);

  return (
    <div className="rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-violet-400" />
            <span className="text-white font-medium">快速选择问题模板</span>
            {selectedTemplateId && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                已选择
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp size={18} className="text-indigo-300/60" />
          ) : (
            <ChevronDown size={18} className="text-indigo-300/60" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-white/10 pt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {questionTypes.map((type) => {
              const count = QUESTION_TEMPLATES.filter(
                (t) => t.categoryId === type.id
              ).length;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveCategory(type.id)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${activeCategory === type.id ? 'ring-2 ring-offset-1 ring-offset-indigo-950' : 'opacity-60 hover:opacity-100'}
                  `}
                  style={{
                    backgroundColor: type.color + '20',
                    color: type.color,
                    border: `1px solid ${type.color}40`,
                    boxShadow:
                      activeCategory === type.id
                        ? `0 0 12px ${type.color}30`
                        : 'none',
                  }}
                >
                  {type.name} ({count})
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template);
                  setIsExpanded(false);
                }}
                className={`
                  text-left p-3 rounded-xl transition-all group
                  ${
                    selectedTemplateId === template.id
                      ? 'bg-violet-500/20 border border-violet-500/40'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/20'
                  }
                `}
              >
                <div className="flex items-start gap-2">
                  <Sparkles
                    size={14}
                    className={`flex-shrink-0 mt-0.5 ${
                      selectedTemplateId === template.id
                        ? 'text-violet-300'
                        : 'text-indigo-400/50 group-hover:text-violet-400'
                    }`}
                  />
                  <div className="min-w-0">
                    <p
                      className={`text-sm leading-relaxed ${
                        selectedTemplateId === template.id
                          ? 'text-violet-200'
                          : 'text-indigo-200/80 group-hover:text-white'
                      }`}
                    >
                      {template.question}
                    </p>
                    <span
                      className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs"
                      style={{
                        backgroundColor: (activeType?.color || '#8b5cf6') + '15',
                        color: activeType?.color || '#8b5cf6',
                      }}
                    >
                      {template.tag}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionTemplateSelector;
