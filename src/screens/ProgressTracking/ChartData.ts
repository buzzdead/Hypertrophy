import {IGroup} from "../../../typings/types";
import {CategorySchema, ExerciseSchema} from "../../config/realm";
import {groupExercisesByWeek} from "../../utils/util";

interface Props {
  exercises: ExerciseSchema[];
  categories: CategorySchema[];
  mode: "Daily" | "Weekly";
  metric?: boolean
  pr?: boolean
  month: number;
  year: string;
  lastHalf?: boolean;
}

export const ChartData = ({exercises, categories, month, year, lastHalf = false, mode, metric = false, pr = false}: Props) => {
  const endDate = new Date(parseInt(year), month + 1, 0);

  const daysInMonth = endDate.getDate(); // Number of days in the given month
  const halfMonth = Math.floor(daysInMonth / 2); // Half of the month, rounded up
  const odd = daysInMonth % 2 === 1 && lastHalf ? 2 : 1; // Odd number of days in the given month

  const categorised =
    categories.length === 0 ? exercises : exercises.filter(e => categories.some(cat => cat.id === e.type.category.id));

  let tickValues: number[] = [];
  let chartData: number[] | IGroup[];
  if (mode === "Weekly") {
    const modifiedData = groupExercisesByWeek(categorised);
    modifiedData.unshift({
      exercises: [],
      weekNumber: 0,
    });
    chartData = modifiedData;
  } else {
    chartData = Array(halfMonth + odd)
      .fill(0)
      .map((_, index) => {
        let fixedIndex = lastHalf ? index + halfMonth : index;
        const filteredExercises = categorised.filter(e => e.date.getDate() === fixedIndex && e.date.getMonth() === month);
        tickValues.push(fixedIndex);
        if(metric) return filteredExercises.reduce((sum, exercise) => {
          let m = exercise.metric
      if(lastHalf && index === 0) return 0
      if(pr && sum > 0 && m > sum) return sum - sum + m
      if(pr && sum > 0) return sum
      return sum + m
        }, 0)
        return lastHalf && index === 0 ? 0 : filteredExercises.length || 0;
      });
  }

  if (mode === "Daily") {
    tickValues = tickValues;
  } else {
    const modifiedData = chartData.map(e => (typeof e === "number" ? e : e.weekNumber));
    tickValues = modifiedData;
  }

  return {
    chartData: mode === 'Daily' ? chartData as number[] : chartData.map(e => (typeof e === "number" ? e : metric ? e.exercises.reduce((sum, exercise) => {
      
      let metric = exercise.exercise.metric

      let dupSum = 0
      exercise.duplicates.forEach((dup) => {
        let dupMetric = dup.metric
        if(pr && dupSum > 0) return dupSum > dupMetric ? dupSum : dupMetric
        dupSum += dupMetric
      })
      if(pr && sum > 0 && metric > sum || dupSum > sum) return sum - sum + dupSum > metric ? dupSum : metric
      if(pr && sum > 0) return sum
      return sum + metric + dupSum;
  }, 0) : e.exercises.length)),
    maxExercises:
      mode === "Daily"
        ? metric ? 25 : Math.max(...(chartData as number[]))
        : Math.max(...chartData.map(e => (typeof e === "number" ? e : e.exercises.length))),
    days: tickValues,
  };
};
