import { Schema } from "../../typings/types";
import { ExerciseSchema, PlanSchema } from "../config/realm";
import Toast from 'react-native-toast-message';

export * from "./date";
export * from "./color";

export const validateSchema = <T extends Schema[keyof Schema]>(schema: T[]): T[] => {
    return schema.filter((s): s is T => s.isValid());
  }
  
export const PlanToExercise = (p: PlanSchema, date: Date, month: number, id: 0): ExerciseSchema => {
  return {
    date: date,
    month: month,
    id: 0,
    week: p.week,
    sets: p.sets,
    reps: p.reps,
    weight: p.weight,
    type: p.type,
    exceptional: p.exceptional,
  } as ExerciseSchema;
}

export const withLoading = async (
  callback: () => Promise<void | boolean> | Promise<void | boolean>[],
  setLoading: (loading: boolean) => void,
  delay = 50
) => {
  setLoading(true);
  setTimeout(() => {
    const result = callback();
    const promises = Array.isArray(result) ? result : [result];
    Promise.all(promises)
      .then(() => setLoading(false))
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, delay);
};

export const showToast = (text1: string, text2: string) => {
  Toast.show({
    type: 'error',
    position: 'top',
    text1: text1,
    text2: text2,
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 0,
  });
};