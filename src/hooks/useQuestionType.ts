import { useDiceStore } from '@/store/useDiceStore';
import { QuestionType } from '@/types';

export const useQuestionType = (typeId: string): QuestionType | null => {
  const questionTypes = useDiceStore((state) => state.questionTypes);
  return questionTypes.find((t) => t.id === typeId) || null;
};

export const useQuestionTypes = (): QuestionType[] => {
  return useDiceStore((state) => state.questionTypes);
};

export default useQuestionType;
