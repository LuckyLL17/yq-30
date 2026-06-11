export interface QuestionTemplate {
  id: string;
  categoryId: string;
  question: string;
  tag: string;
}

export const QUESTION_TEMPLATES: QuestionTemplate[] = [
  {
    id: 'love-1',
    categoryId: '1',
    question: '我和他/她之间的关系会如何发展？',
    tag: '关系走向',
  },
  {
    id: 'love-2',
    categoryId: '1',
    question: '我近期的桃花运如何？',
    tag: '桃花运',
  },
  {
    id: 'love-3',
    categoryId: '1',
    question: '我们之间还有复合的可能吗？',
    tag: '复合可能',
  },
  {
    id: 'love-4',
    categoryId: '1',
    question: '我什么时候能遇到对的人？',
    tag: '正缘时机',
  },
  {
    id: 'love-5',
    categoryId: '1',
    question: '他/她对我的真实想法是什么？',
    tag: '对方心意',
  },
  {
    id: 'love-6',
    categoryId: '1',
    question: '这段感情值得我继续坚持吗？',
    tag: '感情抉择',
  },
  {
    id: 'career-1',
    categoryId: '2',
    question: '我的事业近期会有转机吗？',
    tag: '事业转机',
  },
  {
    id: 'career-2',
    categoryId: '2',
    question: '我应该换工作还是留在原地？',
    tag: '职业抉择',
  },
  {
    id: 'career-3',
    categoryId: '2',
    question: '这次晋升的机会大吗？',
    tag: '晋升机会',
  },
  {
    id: 'career-4',
    categoryId: '2',
    question: '我适合创业吗？',
    tag: '创业适宜',
  },
  {
    id: 'career-5',
    categoryId: '2',
    question: '我的职场人际需要注意什么？',
    tag: '职场人际',
  },
  {
    id: 'career-6',
    categoryId: '2',
    question: '目前的工作方向是对的吗？',
    tag: '方向确认',
  },
  {
    id: 'wealth-1',
    categoryId: '3',
    question: '我近期的财运如何？',
    tag: '近期财运',
  },
  {
    id: 'wealth-2',
    categoryId: '3',
    question: '这次投资会有回报吗？',
    tag: '投资回报',
  },
  {
    id: 'wealth-3',
    categoryId: '3',
    question: '我的收入近期会有提升吗？',
    tag: '收入提升',
  },
  {
    id: 'wealth-4',
    categoryId: '3',
    question: '我近期能否攒下钱？',
    tag: '储蓄前景',
  },
  {
    id: 'wealth-5',
    categoryId: '3',
    question: '最近有大笔支出的风险吗？',
    tag: '支出风险',
  },
  {
    id: 'health-1',
    categoryId: '4',
    question: '我的身体状况近期如何？',
    tag: '身体状况',
  },
  {
    id: 'health-2',
    categoryId: '4',
    question: '我需要注意哪些健康问题？',
    tag: '健康提醒',
  },
  {
    id: 'health-3',
    categoryId: '4',
    question: '我的精力和状态会恢复吗？',
    tag: '精力恢复',
  },
  {
    id: 'health-4',
    categoryId: '4',
    question: '适合我的养生方式是什么？',
    tag: '养生建议',
  },
  {
    id: 'social-1',
    categoryId: '5',
    question: '我和朋友之间的误会能化解吗？',
    tag: '友情修复',
  },
  {
    id: 'social-2',
    categoryId: '5',
    question: '我近期的人际关系会改善吗？',
    tag: '人际改善',
  },
  {
    id: 'social-3',
    categoryId: '5',
    question: '这个人值得我深交吗？',
    tag: '交友判断',
  },
  {
    id: 'social-4',
    categoryId: '5',
    question: '我的社交圈会有新的变化吗？',
    tag: '社交变化',
  },
  {
    id: 'social-5',
    categoryId: '5',
    question: '如何改善我和家人之间的关系？',
    tag: '家庭关系',
  },
  {
    id: 'other-1',
    categoryId: '6',
    question: '我最近的整体运势如何？',
    tag: '整体运势',
  },
  {
    id: 'other-2',
    categoryId: '6',
    question: '我该不该做这个决定？',
    tag: '决策指引',
  },
  {
    id: 'other-3',
    categoryId: '6',
    question: '这件事最终会有好结果吗？',
    tag: '结果预判',
  },
  {
    id: 'other-4',
    categoryId: '6',
    question: '我近期的学业/考试运如何？',
    tag: '学业运势',
  },
  {
    id: 'other-5',
    categoryId: '6',
    question: '这次旅行会顺利吗？',
    tag: '出行运势',
  },
  {
    id: 'other-6',
    categoryId: '6',
    question: '我内心真正的渴望是什么？',
    tag: '内心探索',
  },
];
