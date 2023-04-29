import {DefaultTheme} from 'react-native-paper'
import { Exercise, ExerciseWithDuplicates, IGroup } from '../../typings/types';
import { CategorySchema, ExerciseSchema } from '../config/realmConfig';

const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3498db',
      accent: '#42e942',
      new: "#66CDAA",
      summerDarkest: '#222831',
      summerDark: '#393E46',
      summerBlue: '#00ADB5',
      summerWhite: '#EEEEEE',
      summerButton: '#007EDA',
      sidebarColor: '#9a9e9a',
      test1: '#A9907E',
      test2: '#ABC4AA',
      test3: '#675D50',
      test4: '#19A7CE',
      test5: '#146C94',
      test6: '#000000',
      test7: '#FFBF9B',
      test8: '#B46060',
      

    }
  }

export const colors = MyTheme.colors;

export const getWeekNumber = (date: Date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const getExercisesByDate = (exercises: Exercise[], categories: CategorySchema[]) => {
  return exercises.reduce((accumulator: { date: string; exercises: Exercise[] }[], exercise) => {
    if (categories.length !== 0 && !categories.some(c => c.id === exercise.type?.category?.id)) {
      return accumulator;
    }
    const exerciseDate = exercise.date.toDateString();
    const existingEntryIndex = accumulator.findIndex(entry => entry.date === exerciseDate);
    if (existingEntryIndex !== -1) {
      accumulator[existingEntryIndex].exercises.push(exercise);
    } else {
      accumulator.push({ date: exerciseDate, exercises: [exercise] });
    }
    return accumulator;
  }, []);
}

export const groupExercisesByWeek = (sortedExercises: ExerciseSchema[]) => {
  const groups: IGroup[] = [];

    sortedExercises.forEach(exercise => {
      const weekStart = exercise?.date ? new Date(exercise.date) : new Date();
      weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
      const weekNumber = getWeekNumber(weekStart);
      const weekKey = `${weekStart.getFullYear()}-W${weekNumber}`;

      let group = groups.find(g => g.weekKey === weekKey);
      if (!group) {
        group = {weekKey, weekNumber, exercises: []};
        groups.push(group);
      }
      const duplicate = group.exercises.find(
        (other: ExerciseWithDuplicates) =>
          other.exercise.type?.id === exercise.type?.id &&
          other.exercise.date.getDay() === exercise.date.getDay() &&
          other.exercise.date.getMonth() === exercise.date.getMonth() &&
          other.exercise.date.getFullYear() === exercise.date.getFullYear(),
      );
      duplicate
        ? duplicate.duplicates.push({sets: exercise.sets, reps: exercise.reps, weight: exercise.weight})
        : group.exercises.push({exercise: exercise, duplicates: []});
    });

    return groups;
}

export type Month = {numerical: number, name: string};

const months: Month[] = [
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
  {numerical: 11, name: "December"}
];

export const getAvailableMonths = (exercises: ExerciseSchema[]): Month[] => {
  const availableMonths: Month[] = []
  exercises.forEach(e => {
    if(!availableMonths.find(m => m.numerical === e.date.getMonth())){
      const month = months.find(m => m.numerical === e.date.getMonth())
      month && availableMonths.push(month)
    }
  })
  return availableMonths
}