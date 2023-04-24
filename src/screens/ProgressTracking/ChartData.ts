import { Exercise, IGroup } from "../../../typings/types";
import { CategorySchema, ExerciseSchema } from "../../config/realmConfig";
import { getExercisesByDate, groupExercisesByWeek } from "../../utils/util";

interface Props {
    exercises: ExerciseSchema[]
    categories: CategorySchema[]
    mode?: 'Daily' | 'Weekly'
}

export const ChartData = ({exercises, categories: category, mode='Daily'}: Props) => {

  const exercisesByDate = getExercisesByDate(exercises, category);

  const chartDates = exercises.map(entry => new Date(entry.date));
  const startTimestamp = Math.min(...chartDates.map(date => date.getTime()));
  const startDate = new Date(startTimestamp).getTime();
  const endTimestamp = new Date().getTime();
  const numDays = 20 || Math.round((endTimestamp - startTimestamp) / (1000 * 3600 * 24)) + 1;

const dates = exercises.map(e => e.date)
dates.sort((a: Date, b: Date): number => {
  return new Date(a).getTime() - new Date(b).getTime();
});

const theDate = dates[0]


  const shouldDisplayWeekly = mode === 'Weekly';
  const weeklyGroupedExercises: IGroup[] = groupExercisesByWeek(exercises)

  const weeklyChartData = weeklyGroupedExercises.map(group =>
    group.exercises.reduce((acc, exercise) => acc + exercise.duplicates.length + 1, 0)
  );
  console.log(weeklyChartData)

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