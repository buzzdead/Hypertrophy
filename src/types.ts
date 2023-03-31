// types.ts
export type Exercise = {
  id: number;
  name: string;
  names?: string[]
  sets: number;
  reps: number;
  date: Date;
  category: string; // Add this line
  categories?: string[]
};
