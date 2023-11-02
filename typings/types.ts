import{ ExerciseSchema, ExerciseTypeSchema, MonthSchema, CategorySchema, PlanSchema, PlanPresetSchema, SettingsSchema } from "../src/config/realm";

export type Schema = {
  Exercise: ExerciseSchema,
  ExerciseType: ExerciseTypeSchema,
  Month: MonthSchema,
  Category: CategorySchema,
  Plan: PlanSchema,
  PlanPreset: PlanPresetSchema
  Settings: SettingsSchema
};


// types.ts
export type Exercise = {
  id: number;
  type: Nullable<ExerciseTypeSchema>
  sets: number;
  reps: number;
  weight: number | string
  date: Date;
  month: number;
  week: number;
  exceptional: boolean
  metric: number
};

export type Plan = {
  id?: number
  type: Nullable<ExerciseTypeSchema>
  sets: number;
  reps: number;
  weight: number
  week: number
  completed: boolean
  exceptional: boolean
}

export type Duplicate = { sets: number; reps: number; weight: string | number; exceptional: boolean; metric: number }

export type ExerciseWithDuplicates = { exercise: ExerciseSchema; duplicates: Duplicate[] };
export interface IGroup {
  weekNumber: number;
  exercises: Array<ExerciseWithDuplicates>;
}