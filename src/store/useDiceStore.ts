import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DiceRecord, QuestionType, DiceResult } from '@/types';
import { DEFAULT_QUESTION_TYPES, generateId, rollDice } from '@/utils/diceData';

interface DiceState {
  records: DiceRecord[];
  questionTypes: QuestionType[];
  currentResult: DiceResult | null;
  isRolling: boolean;
  addRecord: (data: Omit<DiceRecord, 'id' | 'timestamp'>) => void;
  deleteRecord: (id: string) => void;
  clearAllRecords: () => void;
  addQuestionType: (type: Omit<QuestionType, 'id'>) => void;
  deleteQuestionType: (id: string) => void;
  rollTheDice: () => DiceResult;
  setRolling: (rolling: boolean) => void;
  getRecordsByType: (typeId: string) => DiceRecord[];
  searchRecords: (keyword: string) => DiceRecord[];
}

export const useDiceStore = create<DiceState>()(
  persist(
    (set, get) => ({
      records: [],
      questionTypes: DEFAULT_QUESTION_TYPES,
      currentResult: null,
      isRolling: false,

      rollTheDice: () => {
        const result = rollDice();
        set({ currentResult: result });
        return result;
      },

      setRolling: (rolling: boolean) => {
        set({ isRolling: rolling });
      },

      addRecord: (data) => {
        const newRecord: DiceRecord = {
          ...data,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          records: [newRecord, ...state.records],
        }));
      },

      deleteRecord: (id) => {
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        }));
      },

      clearAllRecords: () => {
        set({ records: [] });
      },

      addQuestionType: (type) => {
        const newType: QuestionType = {
          ...type,
          id: generateId(),
        };
        set((state) => ({
          questionTypes: [...state.questionTypes, newType],
        }));
      },

      deleteQuestionType: (id) => {
        set((state) => ({
          questionTypes: state.questionTypes.filter((t) => t.id !== id),
        }));
      },

      getRecordsByType: (typeId: string) => {
        return get().records.filter((r) => r.questionType === typeId);
      },

      searchRecords: (keyword: string) => {
        const lowerKeyword = keyword.toLowerCase();
        return get().records.filter(
          (r) =>
            r.question.toLowerCase().includes(lowerKeyword) ||
            r.notes.toLowerCase().includes(lowerKeyword) ||
            r.planet.includes(keyword) ||
            r.sign.includes(keyword)
        );
      },
    }),
    {
      name: 'astrology-dice-storage',
    }
  )
);
