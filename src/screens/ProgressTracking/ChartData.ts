import { Exercise } from "../../../typings/types";
import { CategorySchema } from "../../config/realmConfig";

interface Props {
    exercises: Exercise[]
    categories: CategorySchema[]
}

export const ChartData = ({exercises, categories: category}: Props) => {

  const getExercisesByDate = (exercises: Exercise[], categories: CategorySchema[]) => {
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
  const exercisesByDate = getExercisesByDate(exercises, category);
  const chartDates = exercises.map(entry => new Date(entry.date));
  const startTimestamp = Math.min(...chartDates.map(date => date.getTime()));
  const startDate = new Date(startTimestamp).getTime();
  const endTimestamp = new Date().getTime();
  const numDays = Math.round((endTimestamp - startTimestamp) / (1000 * 3600 * 24)) + 1;

const dates = exercises.map(e => e.date)
dates.sort((a: Date, b: Date): number => {
  return new Date(a).getTime() - new Date(b).getTime();
});
const theDate = dates[0]

  const shouldDisplayWeekly = numDays > 21;
  const numWeeks = shouldDisplayWeekly ? Math.ceil(numDays / 7) : 0;

  const weeklyChartData = Array.from({ length: numWeeks }, (_, i) => {
    const weekStartDate = new Date(startDate + i * 7 * 24 * 3600 * 1000);
    let totalExercises = 0;
    for (let j = 0; j < 7; j++) {
      const date = new Date(weekStartDate.getTime() + j * 24 * 3600 * 1000);
      const dateString = date.toDateString();
      const index = exercisesByDate.findIndex(entry => entry.date === dateString);
      totalExercises += index !== -1 ? exercisesByDate[index].exercises.length : 0;
    }
    return totalExercises;
  });

  const chartData = shouldDisplayWeekly ? weeklyChartData : Array.from({ length: numDays }, (_, i) => {
    const date = new Date(startDate + i * 24 * 3600 * 1000);
    const dateString = date.toDateString();
    const index = exercisesByDate.findIndex(entry => entry.date === dateString);
    const numExercises = index !== -1 ? exercisesByDate[index].exercises.length : 0;
    return numExercises;
  });

  const maxExercises = exercisesByDate.reduce((max, entry) => Math.max(max, entry.exercises.length), 0);

  return {chartData, maxExercises, exercisesByDate, theDate}
}