import { Exercise } from "../types";

interface AggregatedDataItem {
  key: string;
  exercises: number;
  categories: Set<string>;
}

function generateDateRange(startDate: Date, endDate: Date, timeFrame: string): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  const incrementDate = (date: Date) => {
    const newDate = new Date(date); // Create a copy of the date
    if (timeFrame === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else if (timeFrame === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    return newDate;
  };

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate = incrementDate(currentDate); // Assign the incremented date
  }

  return dates;
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function aggregateData(data: Exercise[], timeFrame: string): AggregatedDataItem[] {
  const dateCount: { [key: string]: number } = {};
  const dateCategories: { [key: string]: Set<string> } = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    let dateKey;

    if (timeFrame === "week") {
      const weekNumber = getWeekNumber(date);
      dateKey = `${date.getFullYear()}-W${weekNumber}`;
    } else if (timeFrame === "month") {
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
  const dateRange = generateDateRange(startDate, endDate, timeFrame);

  return dateRange.map((date, index) => {
    let dateKey;
    if (timeFrame === "week") {
      const weekNumber = getWeekNumber(date);
      dateKey = `${date.getFullYear()}-W${weekNumber}`;
    } else if (timeFrame === "month") {
      dateKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    } else {
      dateKey = date.toISOString().split("T")[0];
    }

    return {
      key: index.toString(),
      exercises: dateCount[dateKey] || 0,
      categories: dateCategories[dateKey] || new Set(),
    };
  });
}

export { aggregateData };
export type { AggregatedDataItem };
