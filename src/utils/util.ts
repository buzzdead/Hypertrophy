import {DefaultTheme} from 'react-native-paper'
import { Exercise, ExerciseWithDuplicates, IGroup } from '../../typings/types';

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

export const groupExercisesByWeek = (sortedExercises: Exercise[]) => {
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