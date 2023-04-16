import { ExerciseSchema, ExerciseTypeSchema } from "../src/config/realmConfig";

// types.ts
export type Exercise = {
  id: number;
  type: Nullable<ExerciseTypeSchema>
  sets: number;
  reps: number;
  weight: number | string
  date: Date;
};

export type Duplicate = { sets: number; reps: number; weight: string | number }
export type ExerciseWithDuplicates = { exercise: ExerciseSchema; duplicates: Duplicate[] };
export interface IGroup {
  weekKey: string;
  weekNumber: number;
  exercises: Array<ExerciseWithDuplicates>;
}
