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

  const generateDateRange = (startDate: Date, endDate: Date): Date[] => {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  };
  
  

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
  
    const startDate = data.reduce((earliest, exercise) => {
      return new Date(exercise.date) < new Date(earliest) ? new Date(exercise.date) : new Date(earliest);
    }, new Date());
  
    const endDate = new Date();
    const dateRange = generateDateRange(startDate, endDate);
  
    const aggregatedData: AggregatedDataItem[] = dateRange.map((date, index) => {
      const dateKey = date.toISOString().split("T")[0];
  
      return {
        key: index.toString(),
        exercises: dateCount[dateKey] || 0,
        categories: dateCategories[dateKey] || new Set(),
      };
    });
  
    return aggregatedData;
  };
  
  

export { aggregateData };    
export type { GroupedExercises, AggregatedDataItem };

