import{ ExerciseSchema, ExerciseTypeSchema, MonthSchema, CategorySchema, PlanSchema } from "../src/config/realm";

export type Schema = {
  Exercise: ExerciseSchema,
  ExerciseType: ExerciseTypeSchema,
  Month: MonthSchema,
  Category: CategorySchema,
  Plan: PlanSchema,
};


// types.ts
export type Exercise = {
  id: number;
  type: Nullable<ExerciseTypeSchema>
  sets: number;
  reps: number;
  weight: number | string
  date: Date;
};

export type Plan = {
  id?: number
  type: Nullable<ExerciseTypeSchema>
  sets: number;
  reps: number;
  weight: number
  week: number
  completed: boolean
}

export type Duplicate = { sets: number; reps: number; weight: string | number }
export type ExerciseWithDuplicates = { exercise: ExerciseSchema; duplicates: Duplicate[] };
export interface IGroup {
  weekKey: string;
  weekNumber: number;
  exercises: Array<ExerciseWithDuplicates>;
}
