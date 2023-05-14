import {CategorySchema, ExerciseSchema} from "../../config/realm";
import {getWeekNumber, groupExercisesByWeek, validateSchema} from "../../utils/util";

interface Props {
  exercises: ExerciseSchema[];
  categories: CategorySchema[];
}

export const HomeChartData = ({exercises, categories}: Props) => {
  const groupedExercisesByWeek = groupExercisesByWeek(exercises, true);
  const validCategories = validateSchema(categories)
  const weekNumber = getWeekNumber(new Date());
  const currentWeeksExercises = groupedExercisesByWeek.find(g => g.weekNumber === weekNumber);

  const cats = validCategories.map(e => {
    return {id: e.id, count: 0, name: e.name};
  });

  currentWeeksExercises?.exercises.forEach(e => {
    const categoryId = e.exercise?.type?.category?.id;
    const amount = 1 + e.duplicates.length;
    const cat = cats.find(c => c.id === categoryId);
    if (cat) cat.count += amount;
  });

  const chartData = cats.map(e => e.count);
  chartData.unshift(0);
  const days = cats.map(e => e.name);
  days.unshift("");

  return {
    chartData: chartData,
    maxExercises: Math.max(...cats.map(c => c.count)),
    days: days,
  };
};
