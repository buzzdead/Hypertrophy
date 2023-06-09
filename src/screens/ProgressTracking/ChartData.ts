import {IGroup} from "../../../typings/types";
import {CategorySchema, ExerciseSchema} from "../../config/realm";
import {groupExercisesByWeek} from "../../utils/util";

interface Props {
  exercises: ExerciseSchema[];
  categories: CategorySchema[];
  mode: "Daily" | "Weekly";
  month: number;
  year: string;
  lastHalf?: boolean;
}

export const ChartData = ({exercises, categories, month, year, lastHalf = false, mode}: Props) => {
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
        const filteredExercises = categorised.filter(e => e.date.getDate() === fixedIndex);
        tickValues.push(fixedIndex);
        return lastHalf && index === 0 ? 0 : filteredExercises.length || 0;
      });
  }

  if (mode === "Daily" && typeof chartData[0] === "number") {
    tickValues = tickValues;
  } else {
    const modifiedData = chartData.map(e => (typeof e === "number" ? e : e.weekNumber));
    tickValues = modifiedData;
  }

  return {
    chartData: mode === 'Daily' ? chartData as number[] : chartData.map(e => (typeof e === "number" ? e : e.exercises.length)),
    maxExercises:
      mode === "Daily"
        ? Math.max(...(chartData as number[]))
        : Math.max(...chartData.map(e => (typeof e === "number" ? e : e.exercises.length))),
    days: tickValues,
  };
};
