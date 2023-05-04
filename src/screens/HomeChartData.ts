import {CategorySchema, ExerciseSchema} from "../config/realmConfig";
import {getWeekNumber, groupExercisesByWeek} from "../utils/util";

interface Props {
  exercises: ExerciseSchema[];
  categories: CategorySchema[];
}

export const HomeChartData = ({exercises, categories}: Props) => {
  const groupedExercisesByWeek = groupExercisesByWeek(exercises, true);
  const currentDate = new Date()
  const week = getWeekNumber(currentDate)
  const currentWeeksExercises = groupedExercisesByWeek.find(g => g.weekNumber === week);
  console.log(currentWeeksExercises)
  const cats = categories.map(e => {
    return {id: e.id, count: 0, name: e.name};
  });
  currentWeeksExercises?.exercises.forEach(e => {
    const categoryId = e.exercise?.type?.category?.id;
    const amount = 1 + e.duplicates.length;
    const cat = cats.find(c => c.id === categoryId)
    if(cat) cat.count += amount
  });
  const maxExercises = Math.max(...cats.map(c => c.count))
  const chartData = cats.map(e => e.count)
  chartData.unshift(0)
  const days = cats.map(e => e.name)
  days.unshift("")


  return {
    chartData: chartData,
    maxExercises,
    days: days
  };
};
