import { z } from 'zod';

const DiceVisualStyleSchema = z.object({
  gradientFrom: z.string(),
  gradientTo: z.string(),
  borderColor: z.string(),
  glowColor: z.string(),
  symbolColor: z.string(),
});

const DiceAnimationPresetSchema = z.object({
  id: z.string(),
  name: z.string(),
  animationName: z.string(),
  duration: z.number(),
  easing: z.string(),
  description: z.string(),
});

const SoundEffectSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['sine', 'square', 'sawtooth', 'triangle']),
  frequencyStart: z.number(),
  frequencyEnd: z.number(),
  duration: z.number(),
  volume: z.number(),
  description: z.string(),
});

const DiceSetSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDefault: z.boolean(),
  planetStyle: DiceVisualStyleSchema,
  signStyle: DiceVisualStyleSchema,
  houseStyle: DiceVisualStyleSchema,
  animationPreset: DiceAnimationPresetSchema,
  rollSound: SoundEffectSchema,
  stopSound: SoundEffectSchema,
  size: z.enum(['sm', 'md', 'lg']),
});

const DiceRecordSchema = z.object({
  id: z.string(),
  planet: z.string(),
  sign: z.string(),
  house: z.number().int().min(1).max(12),
  question: z.string(),
  questionType: z.string(),
  notes: z.string(),
  timestamp: z.string(),
});

const QuestionTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

const PlanetSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  meaning: z.string(),
});

const SignSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  element: z.string(),
  modality: z.string(),
  meaning: z.string(),
});

const HouseSchema = z.object({
  number: z.number().int().min(1).max(12),
  name: z.string(),
  meaning: z.string(),
});

const DiceResultSchema = z.object({
  planet: PlanetSchema,
  sign: SignSchema,
  house: HouseSchema,
});

const DailyFortuneSchema = z.object({
  id: z.string(),
  date: z.string(),
  planet: z.string(),
  sign: z.string(),
  house: z.number().int().min(1).max(12),
  keyword: z.string(),
  advice: z.string(),
  luckyIndex: z.number(),
  luckyColor: z.string(),
  luckyNumber: z.number(),
  timestamp: z.string(),
});

const CollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  color: z.string(),
  recordIds: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const PersistedStateSchema = z.object({
  records: z.array(DiceRecordSchema),
  questionTypes: z.array(QuestionTypeSchema),
  currentResult: DiceResultSchema.nullable(),
  isRolling: z.boolean(),
  dailyFortunes: z.array(DailyFortuneSchema),
  diceSets: z.array(DiceSetSchema),
  currentDiceSetId: z.string().nullable(),
  collections: z.array(CollectionSchema),
});

export type PersistedState = z.infer<typeof PersistedStateSchema>;

export function validatePersistedState(data: unknown): PersistedState | null {
  const result = PersistedStateSchema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  console.error('[Zod] localStorage data validation failed:', result.error);
  return null;
}
