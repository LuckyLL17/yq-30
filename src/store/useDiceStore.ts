import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DiceRecord, QuestionType, DiceResult, DailyFortune, DailyCheckInStats } from '@/types';
import { DEFAULT_QUESTION_TYPES, generateId, rollDice, generateDailyFortune, getTodayDateString, isTodayCheckedIn, calculateStreak } from '@/utils/diceData';

interface DiceState {
  records: DiceRecord[];
  questionTypes: QuestionType[];
  currentResult: DiceResult | null;
  isRolling: boolean;
  dailyFortunes: DailyFortune[];
  addRecord: (data: Omit<DiceRecord, 'id' | 'timestamp'>) => void;
  deleteRecord: (id: string) => void;
  clearAllRecords: () => void;
  addQuestionType: (type: Omit<QuestionType, 'id'>) => void;
  deleteQuestionType: (id: string) => void;
  rollTheDice: () => DiceResult;
  setRolling: (rolling: boolean) => void;
  getRecordsByType: (typeId: string) => DiceRecord[];
  searchRecords: (keyword: string) => DiceRecord[];
  checkInToday: () => DailyFortune | null;
  getTodayFortune: () => DailyFortune | null;
  getDailyCheckInStats: () => DailyCheckInStats;
  getFortuneByDate: (date: string) => DailyFortune | null;
  isTodayCheckedIn: () => boolean;
}

export const useDiceStore = create<DiceState>()(
  persist(
    (set, get) => ({
      records: [],
      questionTypes: DEFAULT_QUESTION_TYPES,
      currentResult: null,
      isRolling: false,
      dailyFortunes: [],

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

      checkInToday: () => {
        const today = getTodayDateString();
        const existing = get().dailyFortunes.find((f) => f.date === today);
        if (existing) {
          return existing;
        }
        const fortune = generateDailyFortune(today);
        set((state) => ({
          dailyFortunes: [fortune, ...state.dailyFortunes].sort((a, b) => b.date.localeCompare(a.date)),
        }));
        return fortune;
      },

      getTodayFortune: () => {
        const today = getTodayDateString();
        return get().dailyFortunes.find((f) => f.date === today) || null;
      },

      getDailyCheckInStats: (): DailyCheckInStats => {
        const records = get().dailyFortunes;
        const { currentStreak, longestStreak } = calculateStreak(records);
        const lastCheckIn = records.length > 0 ? records[0].date : null;
        return {
          currentStreak,
          longestStreak,
          totalCheckIns: records.length,
          lastCheckInDate: lastCheckIn,
        };
      },

      getFortuneByDate: (date: string) => {
        return get().dailyFortunes.find((f) => f.date === date) || null;
      },

      isTodayCheckedIn: () => {
        return isTodayCheckedIn(get().dailyFortunes);
      },
    }),
    {
      name: 'astrology-dice-storage',
    }
  )
);
