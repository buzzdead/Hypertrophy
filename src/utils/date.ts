import {Exercise, ExerciseWithDuplicates, IGroup} from "../../typings/types";
import {CategorySchema, ExerciseSchema, MonthSchema} from "../config/realm";
import { validateSchema } from "./util";

export const getWeekNumber = (date: Date) => {
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const getExercisesByDate = (exercises: Exercise[], categories: CategorySchema[]) => {
  return exercises.reduce((accumulator: {date: string; exercises: Exercise[]}[], exercise) => {
    if (categories.length !== 0 && !categories.some(c => c.id === exercise.type?.category?.id)) {
      return accumulator;
    }
    const exerciseDate = exercise.date.toDateString();
    const existingEntryIndex = accumulator.findIndex(entry => entry.date === exerciseDate);
    if (existingEntryIndex !== -1) {
      accumulator[existingEntryIndex].exercises.push(exercise);
    } else {
      accumulator.push({date: exerciseDate, exercises: [exercise]});
    }
    return accumulator;
  }, []);
};

export const groupExercisesByWeek = (exercises: ExerciseSchema[], needValidation?: boolean) => {
  const groups: IGroup[] = [];
  const groupsByWeekKey: {[weekKey: string]: IGroup} = {};
  const validExercises = needValidation ? validateSchema(exercises) : exercises;

  validExercises.forEach(exercise => {
    const weekStart = exercise?.date ? new Date(exercise.date) : new Date();
    const weekNumber = getWeekNumber(weekStart);
    const weekKey = `${weekStart.getFullYear()}-W${weekNumber}`;

    let group = groupsByWeekKey[weekKey];
    if (!group) {
      group = {weekKey, weekNumber, exercises: []};
      groupsByWeekKey[weekKey] = group;
      groups.push(group);
    }

    const duplicate = group.exercises.find(
      (other: ExerciseWithDuplicates) =>
        other.exercise.type?.id === exercise.type?.id &&
        other.exercise.date.getDay() === exercise.date.getDay()
    );
    duplicate
      ? duplicate.duplicates.push({sets: exercise.sets, reps: exercise.reps, weight: exercise.weight})
      : group.exercises.push({exercise: exercise, duplicates: []});
  });

  return groups;
};

export type Month = {numerical: number; name: string};

export const months: Month[] = [
  {numerical: 0, name: "January"},
  {numerical: 1, name: "February"},
  {numerical: 2, name: "March"},
  {numerical: 3, name: "April"},
  {numerical: 4, name: "May"},
  {numerical: 5, name: "June"},
  {numerical: 6, name: "July"},
  {numerical: 7, name: "August"},
  {numerical: 8, name: "September"},
  {numerical: 9, name: "October"},
  {numerical: 10, name: "November"},
  {numerical: 11, name: "December"},
];

export const getAvailableMonths = (storedMonths: MonthSchema[]): Month[] => {
  const availableMonths: Month[] = [];
  storedMonths.forEach(e => {
    if (!availableMonths.find(m => m.numerical === e.month)) {
      const month = months.find(m => m.numerical === e.month);
      month && availableMonths.push(month);
    }
  });
  return availableMonths;
};
