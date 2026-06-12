import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DiceRecord, QuestionType, DiceResult, DailyFortune, DailyCheckInStats, DiceSet, Collection, CollectionSortBy } from '@/types';
import { DEFAULT_QUESTION_TYPES, generateId, rollDice, generateDailyFortune, getTodayDateString, isTodayCheckedIn, calculateStreak } from '@/utils/diceData';
import { DEFAULT_DICE_SETS } from '@/utils/diceSetPresets';

interface DiceState {
  records: DiceRecord[];
  questionTypes: QuestionType[];
  currentResult: DiceResult | null;
  isRolling: boolean;
  dailyFortunes: DailyFortune[];
  diceSets: DiceSet[];
  currentDiceSetId: string | null;
  collections: Collection[];
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
  getCurrentDiceSet: () => DiceSet;
  addDiceSet: (diceSet: Omit<DiceSet, 'id' | 'createdAt' | 'updatedAt' | 'isDefault'>) => DiceSet;
  updateDiceSet: (id: string, updates: Partial<DiceSet>) => void;
  deleteDiceSet: (id: string) => void;
  setCurrentDiceSet: (id: string) => void;
  addCollection: (data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt' | 'recordIds'>) => Collection;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addRecordToCollection: (collectionId: string, recordId: string) => void;
  removeRecordFromCollection: (collectionId: string, recordId: string) => void;
  reorderRecordsInCollection: (collectionId: string, recordIds: string[]) => void;
  getCollectionRecords: (collectionId: string, sortBy?: CollectionSortBy) => DiceRecord[];
  getCollectionsForRecord: (recordId: string) => Collection[];
}

export const useDiceStore = create<DiceState>()(
  persist(
    (set, get) => ({
      records: [],
      questionTypes: DEFAULT_QUESTION_TYPES,
      currentResult: null,
      isRolling: false,
      dailyFortunes: [],
      diceSets: DEFAULT_DICE_SETS,
      currentDiceSetId: 'set-classic',
      collections: [],

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

      getCurrentDiceSet: () => {
        const state = get();
        const current = state.diceSets.find((d) => d.id === state.currentDiceSetId);
        if (current) return current;
        return state.diceSets.find((d) => d.isDefault) || state.diceSets[0] || DEFAULT_DICE_SETS[0];
      },

      addDiceSet: (diceSet) => {
        const now = new Date().toISOString();
        const newSet: DiceSet = {
          ...diceSet,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          isDefault: false,
        };
        set((state) => ({
          diceSets: [...state.diceSets, newSet],
        }));
        return newSet;
      },

      updateDiceSet: (id, updates) => {
        set((state) => ({
          diceSets: state.diceSets.map((d) =>
            d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
          ),
        }));
      },

      deleteDiceSet: (id) => {
        const target = get().diceSets.find((d) => d.id === id);
        if (target && target.isDefault) return;
        set((state) => {
          const newSets = state.diceSets.filter((d) => d.id !== id);
          const newCurrentId = state.currentDiceSetId === id
            ? (newSets.find((d) => d.isDefault)?.id || newSets[0]?.id || 'set-classic')
            : state.currentDiceSetId;
          return {
            diceSets: newSets,
            currentDiceSetId: newCurrentId,
          };
        });
      },

      setCurrentDiceSet: (id) => {
        set({ currentDiceSetId: id });
      },

      addCollection: (data) => {
        const now = new Date().toISOString();
        const newCollection: Collection = {
          ...data,
          id: generateId(),
          recordIds: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          collections: [newCollection, ...state.collections],
        }));
        return newCollection;
      },

      updateCollection: (id, updates) => {
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      deleteCollection: (id) => {
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        }));
      },

      addRecordToCollection: (collectionId, recordId) => {
        set((state) => ({
          collections: state.collections.map((c) => {
            if (c.id !== collectionId) return c;
            if (c.recordIds.includes(recordId)) return c;
            return {
              ...c,
              recordIds: [...c.recordIds, recordId],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      removeRecordFromCollection: (collectionId, recordId) => {
        set((state) => ({
          collections: state.collections.map((c) => {
            if (c.id !== collectionId) return c;
            return {
              ...c,
              recordIds: c.recordIds.filter((id) => id !== recordId),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      reorderRecordsInCollection: (collectionId, recordIds) => {
        set((state) => ({
          collections: state.collections.map((c) => {
            if (c.id !== collectionId) return c;
            return {
              ...c,
              recordIds,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      getCollectionRecords: (collectionId, sortBy = 'custom') => {
        const state = get();
        const collection = state.collections.find((c) => c.id === collectionId);
        if (!collection) return [];

        const records = collection.recordIds
          .map((id) => state.records.find((r) => r.id === id))
          .filter((r): r is DiceRecord => r !== undefined);

        switch (sortBy) {
          case 'time-desc':
            return [...records].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
          case 'time-asc':
            return [...records].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
          case 'planet':
            return [...records].sort((a, b) => a.planet.localeCompare(b.planet));
          case 'sign':
            return [...records].sort((a, b) => a.sign.localeCompare(b.sign));
          case 'house':
            return [...records].sort((a, b) => a.house - b.house);
          case 'custom':
          default:
            return records;
        }
      },

      getCollectionsForRecord: (recordId) => {
        return get().collections.filter((c) => c.recordIds.includes(recordId));
      },
    }),
    {
      name: 'astrology-dice-storage',
    }
  )
);
