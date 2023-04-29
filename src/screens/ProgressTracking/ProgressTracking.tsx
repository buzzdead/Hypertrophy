// screens/ProgressTracking.tsx
import React, {useState} from "react";
import {SafeAreaView} from "react-native";
import {useExercises} from "../../hooks/useExercises";
import {ChartData} from "./ChartData";
import {useCategories} from "../../hooks/useCategories";
import {SideBar} from "../../components/SideBar";
import {CategorySchema} from "../../config/realmConfig";
import {useScreenOrientation} from "../../hooks/useScreenOrientation";
import {VictoryBar, VictoryChart, VictoryAxis, VictoryGroup} from "victory-native";
import {ProgressTrackingBtm} from "./ProgressTrackingBtm";
import {colors, getAvailableMonths, Month} from "../../utils/util";
import {ChartNavigation} from "./ChartNavigation";
import LoadingIndicator from "../../components/LoadingIndicator";

interface Chart {
  chartData: number[];
  maxExercises: number;
  days: number[];
  currentMonth: number;
  lastHalf: boolean;
  mode: "Daily" | "Weekly";
}

const ProgressTracking = () => {
  const {exercises, refresh, loading: exercisesLoading} = useExercises();
  const [availableMonths, setAvailableMonths] = useState<Month[]>([]);
  const {categories, loading: categoriesLoading} = useCategories();
  const screenOrientation = useScreenOrientation();
  const [mode, setMode] = useState<"Weekly" | "Daily">("Daily");
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [filteredCategories, setFilteredCategories] = React.useState<CategorySchema[]>([]);
  const [chart, setChart] = useState<Chart>({
    chartData: [],
    maxExercises: 0,
    days: [],
    currentMonth: 0,
    lastHalf: false,
    mode: "Daily",
  });

  const handleNext = () => {
    if (!chart.lastHalf) setChart({...chart, lastHalf: true});
    else if (chart.lastHalf && chart.currentMonth !== availableMonths.length - 1) {
      const newCurrentMonth = chart.currentMonth + 1;
      setChart({...chart, currentMonth: newCurrentMonth, lastHalf: false});
    }
    setTriggerUpdate(true);
  };

  const handlePrev = () => {
    if (chart.lastHalf) setChart({...chart, lastHalf: false});
    else if (!chart.lastHalf && chart.currentMonth !== 0) {
      const newCurrentMonth = chart.currentMonth - 1;
      setChart({...chart, currentMonth: newCurrentMonth, lastHalf: true});
    }
    setTriggerUpdate(true);
  };

  const updateChart = () => {
    if (!triggerUpdate) return;
    console.log("asdf");
    const {chartData, maxExercises, tickValues, updatedLastHalf} = ChartData({
      exercises,
      categories: filteredCategories,
      month: availableMonths[chart.currentMonth].numerical,
      year: "2023",
      lastHalf: chart.lastHalf,
      mode,
    });
    setChart({
      ...chart,
      chartData: chartData,
      maxExercises: maxExercises,
      days: tickValues,
      lastHalf: updatedLastHalf !== undefined ? updatedLastHalf : chart.lastHalf,
    });
    setTriggerUpdate(false);
  };

  React.useLayoutEffect(() => {
    if (!availableMonths[chart.currentMonth]) return;
    updateChart();
  }, [handleNext, handlePrev, filteredCategories]);

  React.useLayoutEffect(() => {
    const am = getAvailableMonths(exercises);
    setAvailableMonths(am);
    setTriggerUpdate(true);
  }, [exercises]);

  const handleFilterChange = (selectedCategories: CategorySchema[]) => {
    if (selectedCategories.length === 0) {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(categories.filter(category => selectedCategories.some(c => c.id === category.id)));
    }
    setTriggerUpdate(true)
  };

  if (categoriesLoading || exercisesLoading) return <LoadingIndicator />;

  console.log("rendering")

  return (
    <SafeAreaView style={{width: "100%", height: "100%", justifyContent: "center", gap: 60}}>
      <VictoryChart>
        <VictoryAxis
          style={{axisLabel: {padding: 30, fontSize: 16}}}
          tickCount={chart?.chartData.length}
          tickFormat={id => (chart?.days ? chart.days[id] : id)}
          label={"Days in month"}
        />
        <VictoryAxis dependentAxis label={"Exercises"} tickCount={Math.ceil(chart?.maxExercises / 2)} />
        <VictoryGroup offset={20}>
          <VictoryBar
            data={chart?.chartData}
            barWidth={15}
            style={{
              data: {
                fill: colors.primary,
              },
            }}
          />
        </VictoryGroup>
      </VictoryChart>
      <ChartNavigation
        month={availableMonths[chart.currentMonth].name}
        handleNext={handleNext}
        handlePrev={handlePrev}
        lastPage={chart.currentMonth === availableMonths.length - 1 && chart.lastHalf}
        firstPage={chart.currentMonth === 0 && !chart.lastHalf}
      />
      <ProgressTrackingBtm mode={mode} landScapeOrientation={screenOrientation.isLandscape} changeMode={setMode} />
      <SideBar categories={categories} onFilterChange={handleFilterChange} icon={"chart-bar"} />
    </SafeAreaView>
  );
};

export default ProgressTracking;
