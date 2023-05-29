// screens/ProgressTracking.tsx
import React, {useEffect, useLayoutEffect, useState} from "react";
import {SafeAreaView, Text, View} from "react-native";
import {SideBar} from "../../components/SideBar";
import {CategorySchema, MonthSchema} from "../../config/realm";
import {ProgressTrackingBtm} from "./ProgressTrackingBtm";
import {ChartNavigation} from "./ChartNavigation";
import LoadingIndicator from "../../components/LoadingIndicator";
import {Chart} from "./Chart";
import {useRealm, useScreenOrientation} from "../../hooks/hooks";
import {fetchExercises} from "../../api/realm";
import {ChartData} from "./ChartData";
import Contingent from "../../components/Contingent";
import {getAvailableMonths, Month} from "../../utils/util";
import {useFocus} from "../../hooks/useFocus";
import {useFocus2} from "../../hooks/useFocus2";

interface Chart {
  chartData: number[];
  maxExercises: number;
  days: number[];
  currentMonth: number;
  availableMonths: Month[];
  lastHalf: boolean;
  filteredCategories: CategorySchema[];
  mode: "Weekly" | "Daily";
  loading?: boolean;
}

export const ProgressTracking = () => {
  const {data: categories, loading: categoriesLoading} = useRealm<CategorySchema>({schemaName: "Category"});
  const {data: months, loading: monthsLoading, refresh} = useRealm<MonthSchema>({schemaName: "Month"});
  const screenOrientation = useScreenOrientation();
  const mounted = useFocus2();
  const focused = useFocus();

  const [state, setState] = useState<Chart>({
    chartData: [],
    maxExercises: 0,
    days: [],
    currentMonth: 0,
    lastHalf: false,
    filteredCategories: [],
    availableMonths: [],
    mode: "Daily",
    loading: false,
  });

  const containsMonth = (month: number) => {
    if (!state.availableMonths) return;
    return months?.find(e => e.month === state.availableMonths[month]?.numerical);
  };

  const handleNext = () => {
    if (state.lastHalf && !containsMonth(state.currentMonth + 1)) {
      return;
    }
    if (!state.lastHalf) getChartData(true);
    else if (state.lastHalf && containsMonth(state.currentMonth + 1)) {
      const newCurrentMonth = state.currentMonth + 1;
      getChartData(false, newCurrentMonth);
    }
  };

  const handlePrev = async () => {
    if (!state.lastHalf && !containsMonth(state.currentMonth - 1)) {
      return;
    }
    if (state.lastHalf) getChartData(false);
    else if (!state.lastHalf && containsMonth(state.currentMonth - 1)) {
      const newCurrentMonth = state.currentMonth - 1;
      getChartData(true, newCurrentMonth);
    }
  };

  const getChartData = async (lh?: boolean, cm?: number) => {
   
    let newLastHalf = lh !== undefined ? lh : state.lastHalf;
    const newCurrentMonth = cm !== undefined ? cm : state.currentMonth;

    const availableMonths = state.availableMonths.length === 0 ? getAvailableMonths(months) : state.availableMonths;
    if(availableMonths.length === 0) return

    const newExercises =
      state.mode === "Daily"
        ? await fetchExercises({by: "Month", when: availableMonths[newCurrentMonth]?.numerical})
        : await fetchExercises();
    let {chartData, maxExercises, days} = ChartData({
      exercises: newExercises,
      categories: state.filteredCategories,
      month: availableMonths[newCurrentMonth]?.numerical,
      year: "2023",
      lastHalf: newLastHalf,
      mode: state.mode,
    });

    setState({
      ...state,
      chartData: chartData,
      maxExercises: maxExercises,
      days: days,
      currentMonth: state.mode === 'Weekly' ? 0 : newCurrentMonth,
      lastHalf: state.mode === 'Weekly' ? false : newLastHalf,
      availableMonths: availableMonths,
      loading: mounted && true,
    });
  };

  useEffect(() => {
    if (!mounted) return;
    setTimeout(() => setState({...state, loading: false}), 50);
  }, [state.lastHalf, state.currentMonth, state.maxExercises]);

  const getChartData2 = async (selectedCategories: CategorySchema[]) => {
    if(state.availableMonths.length === 0) return
    const newCategories =
      selectedCategories.length === 0
        ? categories
        : categories.filter(category => selectedCategories.some(c => c.id === category.id));
    const newExercises =
      state.mode === "Daily"
        ? state.availableMonths.length > 0 ? await fetchExercises({by: "Month", when: state.availableMonths[state.currentMonth]?.numerical}) : []
        : await fetchExercises();
    const {chartData, maxExercises, days} = ChartData({
      exercises: newExercises,
      categories: newCategories,
      month: state.availableMonths[state.currentMonth]?.numerical,
      year: "2023",
      lastHalf: state.lastHalf,
      mode: state.mode,
    });
    setState({
      ...state,
      chartData: chartData,
      maxExercises: maxExercises,
      days: days,
      filteredCategories: selectedCategories,
    });
  };

  useLayoutEffect(() => {
    if (categoriesLoading) return;
    if (monthsLoading) return;
    getChartData();
  }, [monthsLoading, state.mode]);

  const handleFilterChange = (selectedCategories: CategorySchema[]) => {
    getChartData2(selectedCategories);
  };

  if (!focused) return <LoadingIndicator />;

  if(months.length === 0) return <View style={{width: "100%", height: '100%', justifyContent: "center"}}>
  <Text style={{textAlign: "center", fontFamily: "Roboto-Bold", fontSize: 22, paddingHorizontal: 50}}>
    No data found, add some exercises.
  </Text>
</View>

  return (
    <SafeAreaView style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", gap: 20}}>
      <Chart
        isLandScape={screenOrientation.isLandscape}
        mode={state.mode}
        maxExercises={state.maxExercises}
        chartData={state.chartData}
        days={state.days}
        isLoading={!mounted || state.loading}
      />
      <Contingent style={{paddingTop: 30}} shouldRender={state.mode === "Daily"}>
        <ChartNavigation
          isLandScape={screenOrientation.isLandscape}
          handleNext={handleNext}
          handlePrev={handlePrev}
          monthTitle={state.availableMonths[state.currentMonth]?.name}
          firstPage={!state.lastHalf && state.currentMonth === 0}
          lastPage={state.lastHalf && state.currentMonth === state.availableMonths.length - 1}
        />
      </Contingent>
      <ProgressTrackingBtm
        mode={state.mode}
        landScapeOrientation={screenOrientation.isLandscape}
        changeMode={newMode => setState({...state, mode: newMode, loading: true})}
      />
      <SideBar
        isLandScape={screenOrientation.isLandscape}
        categories={categories}
        onFilterChange={handleFilterChange}
        icon={"chart-bar"}
        prevSelectedCat={state.filteredCategories}
      />
    </SafeAreaView>
  );
};
