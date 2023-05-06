// screens/ProgressTracking.tsx
import React, {useLayoutEffect, useState} from "react";
import {SafeAreaView, Text, View} from "react-native";
import {useCategories} from "../../hooks/useCategories";
import {SideBar} from "../../components/SideBar";
import {CategorySchema} from "../../config/realm";
import {useScreenOrientation} from "../../hooks/useScreenOrientation";
import {ProgressTrackingBtm} from "./ProgressTrackingBtm";
import {ChartNavigation} from "./ChartNavigation";
import LoadingIndicator from "../../components/LoadingIndicator";
import { Chart } from "./Chart";
import { useMonths } from "../../hooks/useMonths";
import { fetchExercises } from "../../api/realm";
import { ChartData } from "./ChartData";
import { IGroup } from "../../../typings/types";
import Contingent from "../../components/Contingent";

export interface Chart {
  chartData: number[] | IGroup[];
  maxExercises: number;
  days: number[];
  currentMonth: number;
  lastHalf: boolean;
  filteredCategories: CategorySchema[]
}

const ProgressTracking = () => {
  const {categories, refresh, loading: categoriesLoading} = useCategories();
  const screenOrientation = useScreenOrientation();
  const [mode, setMode] = useState<"Weekly" | "Daily">("Daily");
  const {months, loading: monthsLoading, availableMonths} = useMonths();

  const [state, setState] = useState<Chart>({
    chartData: [],
    maxExercises: 0,
    days: [],
    currentMonth: 0,
    lastHalf: false,
    filteredCategories: []
  });

  const containsMonth = (month: number) => {
    if (!availableMonths) return;
    return months?.find(e => e.month === availableMonths[month]?.numerical);
  };

  const handleNext = async () => {
    if (!state.lastHalf) getChartData(true)
    else if (state.lastHalf && containsMonth(state.currentMonth + 1)) {
      const newCurrentMonth = state.currentMonth + 1;
      getChartData(false, newCurrentMonth)
    }
  };

  const handlePrev = async () => {
    if (state.lastHalf) getChartData(false)
    else if (!state.lastHalf && containsMonth(state.currentMonth - 1)) {
      const newCurrentMonth = state.currentMonth - 1;
      getChartData(true, newCurrentMonth)
    }
  };

  const getChartData = async (lh?: boolean, cm?: number) => {
    const newLastHalf = lh !== undefined ? lh : state.lastHalf
    const newCurrentMonth = cm !== undefined ? cm : state.currentMonth

    const newExercises = mode === 'Daily' ? await fetchExercises({by: "Month", when: availableMonths[newCurrentMonth]?.numerical}) : await fetchExercises()
    const {chartData, maxExercises, days} = ChartData({
      exercises: newExercises,
      categories: state.filteredCategories,
      month: availableMonths[newCurrentMonth]?.numerical,
      year: "2023",
      lastHalf: newLastHalf,
      mode: mode,
    });
    setState({...state, chartData: chartData, maxExercises: maxExercises, days: days, currentMonth: newCurrentMonth, lastHalf: newLastHalf});
  };

  const getChartData2 = async (selectedCategories: CategorySchema[]) => {

    const newCategories = selectedCategories.length === 0 ? categories : categories.filter(category => selectedCategories.some(c => c.id === category.id))
    const newExercises = mode === 'Daily' ? await fetchExercises({by: "Month", when: availableMonths[state.currentMonth]?.numerical}) : await fetchExercises()
    const {chartData, maxExercises, days} = ChartData({
      exercises: newExercises,
      categories: newCategories,
      month: availableMonths[state.currentMonth]?.numerical,
      year: "2023",
      lastHalf: state.lastHalf,
      mode: mode,
    });
    setState({...state, chartData: chartData, maxExercises: maxExercises, days: days, filteredCategories: newCategories});
  };

  useLayoutEffect(() => {
    if (categoriesLoading) return
    if (availableMonths.length === 0) return;
    getChartData();
  }, [availableMonths, mode]);

  const handleFilterChange = (selectedCategories: CategorySchema[]) => {
    getChartData2(selectedCategories)
  };
  
  if (categoriesLoading || monthsLoading) return <View style={{width: '100%', height: '100%'}}><LoadingIndicator /></View>;
  console.log("rendering progress")

  if(state.chartData.length === 0 || availableMonths.length === 0) return <View style={{justifyContent: 'center', width: '100%', height: '100%', alignItems: 'center'}}><Text>No data found, add some exercises</Text></View>
  console.log("rendering real progress")
  return (
    <SafeAreaView style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", gap: 20}}>
      <Chart isLandScape={screenOrientation.isLandscape} mode={mode} maxExercises={state.maxExercises} chartData={state.chartData} days={state.days} />
      <Contingent shouldRender={mode === 'Daily'}>
      <ChartNavigation
      isLandScape={screenOrientation.isLandscape}
      handleNext={handleNext}
      handlePrev={handlePrev}
      monthTitle={availableMonths[state.currentMonth].name}
      firstPage={!state.lastHalf && state.currentMonth === 0}
      lastPage={state.lastHalf && state.currentMonth === availableMonths.length - 1}
      />
      </Contingent>
      <ProgressTrackingBtm mode={mode} landScapeOrientation={screenOrientation.isLandscape} changeMode={setMode} />
      <SideBar isLandScape={screenOrientation.isLandscape} categories={categories} onFilterChange={handleFilterChange} icon={"chart-bar"} />
    </SafeAreaView>
  );
};

export default ProgressTracking;
