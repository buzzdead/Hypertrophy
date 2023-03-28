// chartDataUtils.ts
import { Exercise } from "../types";

interface GroupedExercises {
  [key: string]: Exercise[];
}

interface AggregatedDataItem {
    key: string;
    exercises: number;
    categories: Set<string>; // Add this line
  }
  

  const aggregateData = (data: Exercise[], timeFrame: string): AggregatedDataItem[] => {
    const dateCount: { [key: string]: number } = {};
    const dateCategories: { [key: string]: Set<string> } = {};
  
    data.forEach((item) => {
      const date = new Date(item.date);
      let dateKey;
  
      if (timeFrame === 'week') {
        const weekNumber = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
        dateKey = `${date.getFullYear()}-W${weekNumber}`;
      } else if (timeFrame === 'month') {
        dateKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      } else {
        dateKey = date.toISOString().split("T")[0];
      }
  
      dateCount[dateKey] = (dateCount[dateKey] || 0) + 1;
  
      if (!dateCategories[dateKey]) {
        dateCategories[dateKey] = new Set();
      }
      dateCategories[dateKey].add(item.category);
    });
  
    const aggregatedData: AggregatedDataItem[] = Object.entries(dateCount).map(([dateKey, exercises], index) => ({
      key: index.toString(),
      exercises,
      categories: dateCategories[dateKey],
    }));
  
    return aggregatedData;
  };
  

export { aggregateData };    
export type { GroupedExercises, AggregatedDataItem };

