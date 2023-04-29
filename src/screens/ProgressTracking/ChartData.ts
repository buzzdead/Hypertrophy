import { CategorySchema, ExerciseSchema } from "../../config/realmConfig";

interface Props {
    exercises: ExerciseSchema[]
    categories: CategorySchema[]
    mode?: 'Daily' | 'Weekly'
    month: number
    year: string
    lastHalf?: boolean
}

export const ChartData = ({exercises, categories, month, year, lastHalf = false, mode='Daily'}: Props) => {
  const startDate = new Date(parseInt(year), month, 1);

const endDate = new Date(parseInt(year), month + 1, 0);

console.log("Start:", startDate.getDate() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getFullYear(), "End:", endDate.toLocaleDateString());

  const daysInMonth = endDate.getDate(); // Number of days in the given month
  const halfMonth = Math.floor(daysInMonth / 2); // Half of the month, rounded up

  let updatedLastHalf: Optional<boolean> = lastHalf

  const currentExercises = exercises.filter(e => e.date.getMonth() === month && e.date.getFullYear() === parseInt(year))


  const categorised = categories.length === 0 ? currentExercises : currentExercises.filter(e => categories.some(cat => cat.id === e.type.category.id))

  const odd = daysInMonth % 2 === 1 && lastHalf ? 2 : 1
  const tickValues: number[] = []
  let chartData = Array(halfMonth + odd).fill(0).map((_, index) => {
    let fixedIndex = lastHalf ? index + halfMonth : index
    const filteredExercises = categorised.filter(e => e.date.getDate() === fixedIndex);
    tickValues.push(fixedIndex)
    return filteredExercises.length || 0;
  });
  if(Math.max(...chartData) === 0) {
    updatedLastHalf = !lastHalf
    chartData = Array(halfMonth + odd).fill(0).map((_, index) => {
      let fixedIndex = updatedLastHalf ? index + halfMonth : index
      const filteredExercises = categorised.filter(e => e.date.getDate() === fixedIndex);
      tickValues.push(fixedIndex)
      return filteredExercises.length || 0;
    });
  }

  return { chartData, maxExercises: Math.max(...chartData), tickValues: tickValues, updatedLastHalf };
 
}