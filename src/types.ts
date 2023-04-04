// types.ts
export type Exercise = {
  id: number;
  name: string;
  names?: string[]
  sets: number;
  reps: number;
  weight: number | string
  date: Date;
  category: string; // Add this line
};
