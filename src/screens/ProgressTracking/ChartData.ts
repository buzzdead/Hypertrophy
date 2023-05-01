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

  const endDate = new Date(parseInt(year), month + 1, 0);

  const daysInMonth = endDate.getDate(); // Number of days in the given month
  const halfMonth = Math.floor(daysInMonth / 2); // Half of the month, rounded up

  const categorised = categories.length === 0 ? exercises : exercises.filter(e => categories.some(cat => cat.id === e.type.category.id))

  const odd = daysInMonth % 2 === 1 && lastHalf ? 2 : 1
  console.log(halfMonth + odd)
  const tickValues: number[] = []
  let chartData = Array(halfMonth + odd).fill(0).map((_, index) => {
    let fixedIndex = lastHalf ? index + halfMonth : index
    const filteredExercises = categorised.filter(e => e.date.getDate() === fixedIndex);
    tickValues.push(fixedIndex)
    return lastHalf && index === 0 ? 0 : filteredExercises.length || 0;
  });
  

  return { chartData, maxExercises: Math.max(...chartData), days: tickValues };
 
}