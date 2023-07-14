// screens/ProgressTracking.tsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { SideBar } from '../../components/SideBar';
import { CategorySchema, ExerciseSchema, ExerciseTypeSchema, MonthSchema } from '../../config/realm';
import { ProgressTrackingBtm } from './ProgressTrackingBtm';
import { ChartNavigation } from './ChartNavigation';
import LoadingIndicator from '../../components/LoadingIndicator';
import { Chart } from './Chart';
import { useRealm, useScreenOrientation } from '../../hooks/hooks';
import { ChartData } from './ChartData';
import Contingent from '../../components/Contingent';
import { getAvailableMonths, Month } from '../../utils/util';
import { useFocus } from '../../hooks/useFocus';
import { useMount } from '../../hooks/useMount';
import CustomButton from '../../components/CustomButton';
import { CheckBox } from '../../components/Checkbox';

interface Chart {
  chartData: number[];
  maxExercises: number;
  days: number[];
  currentMonth: number;
  availableMonths: Month[];
  lastHalf: boolean;
  filteredCategories: CategorySchema[];
  filteredExerciseTypes: ExerciseTypeSchema[]
  mode: 'Weekly' | 'Daily';
  loading: boolean;
  metric: boolean
  pr: boolean
}

export const ProgressTracking = () => {
  const { data: categories, loading: categoriesLoading } = useRealm<CategorySchema>({ schemaName: 'Category' });
  const { data: months, loading: monthsLoading, refresh } = useRealm<MonthSchema>({ schemaName: 'Month' });
  const { data: allExerciseTypes, loading: exerciseTypesLoading } = useRealm<ExerciseTypeSchema>({ schemaName: 'ExerciseType' });
  const { data: exercises, loading: exercisesLoading } = useRealm<ExerciseSchema>({ schemaName: 'Exercise' });
  const screenOrientation = useScreenOrientation();
  const mounted = useMount();
  const focused = useFocus();

  const [state, setState] = useState<Chart>({
    chartData: [],
    maxExercises: 0,
    days: [],
    currentMonth: 0,
    lastHalf: false,
    filteredCategories: [],
    filteredExerciseTypes: [],
    availableMonths: [],
    mode: 'Daily',
    loading: false,
    metric: false,
    pr: false,
  });

  const containsMonth = (month: number) => {
    if (!state.availableMonths) return;
    return months?.find((e) => e.month === state.availableMonths[month]?.numerical);
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

  const updateChart = (
    availableMonths: Month[],
    newCurrentMonth: number,
    lh: boolean,
    filteredExerciseTypes: ExerciseTypeSchema[],
    newCategories?: CategorySchema[],
    selectedCategories?: CategorySchema[]
  ) => {
    const exc = state.mode === 'Daily' ? exercises.filter((e) => e.month === availableMonths[newCurrentMonth]?.numerical) : exercises;

    const filteredExercises = filteredExerciseTypes.length === 0 ? exc : exc.filter(e => filteredExerciseTypes.some((et) => et.id === e.type.id))

    let { chartData, maxExercises, days } = ChartData({
      exercises: filteredExercises,
      categories: newCategories || state.filteredCategories,
      month: availableMonths[newCurrentMonth]?.numerical,
      year: '2023',
      metric: state.metric,
      lastHalf: lh,
      pr: state.pr,
      mode: state.mode,
    });

    setState({
      ...state,
      chartData: chartData,
      maxExercises: maxExercises,
      days: days,
      currentMonth: state.mode === 'Weekly' ? 0 : newCurrentMonth,
      lastHalf: state.mode === 'Weekly' ? false : lh,
      availableMonths: availableMonths,
      loading: mounted && true,
      filteredExerciseTypes: filteredExerciseTypes,
      filteredCategories: selectedCategories || state.filteredCategories,
    });
  };

  const getChartData = async (lh?: boolean, cm?: number, selectedCategories?: CategorySchema[], newExerciseTypes?: ExerciseTypeSchema[]) => {
    const newLastHalf = lh !== undefined ? lh : state.lastHalf;
    const newCurrentMonth = cm !== undefined ? cm : state.currentMonth;
    const newCategories =
      selectedCategories?.length === 0
        ? categories
        : categories.filter((category) => selectedCategories?.some((c) => c.id === category.id));

    const availableMonths = state.availableMonths.length === 0 ? getAvailableMonths(months) : state.availableMonths;
    if (availableMonths.length === 0) return;

    updateChart(availableMonths, newCurrentMonth, newLastHalf, newExerciseTypes || state.filteredExerciseTypes, newCategories, selectedCategories);
  };

  const onExerciseTypesChange = async (exerciseTypes: ExerciseTypeSchema[]) => {
    const newExerciseTypes =
      exerciseTypes.length > 0 ? allExerciseTypes.filter((e) => exerciseTypes.some((et) => et.id === e.id)) : [];

    updateChart(
      state.availableMonths,
      state.currentMonth,
      state.lastHalf,
      newExerciseTypes
    );
  };

  const onCategoryChange = (selectedCategories: CategorySchema[], exerciseTypes?: ExerciseTypeSchema[]) => {
    const newExerciseTypes =
      exerciseTypes ? exerciseTypes?.length > 0 ? allExerciseTypes.filter((e) => exerciseTypes?.some((et) => et.id === e.id)) : [] : state.filteredExerciseTypes
    getChartData(state.lastHalf, state.currentMonth, selectedCategories, newExerciseTypes);
  };

  useEffect(() => {
    if (!mounted) return;
    setTimeout(() => setState({ ...state, loading: false }), 50);
  }, [state.lastHalf, state.currentMonth, state.maxExercises, state.filteredCategories, state.chartData]);

  useLayoutEffect(() => {
    if (categoriesLoading) return;
    if (monthsLoading) return;
    else getChartData();
  }, [monthsLoading, state.mode, state.metric, state.pr]);

  if (!focused) return <LoadingIndicator />;

  if (months.length === 0)
    return (
      <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
        <Text style={{ textAlign: 'center', fontFamily: 'Roboto-Bold', fontSize: 22, paddingHorizontal: 50 }}>
          No data found, add some exercises.
        </Text>
      </View>
    );

  const onChangePR = () => {
    if(state.filteredExerciseTypes.length === 1)
      setState({...state, pr: !state.pr})
  }

  return (
    <SafeAreaView style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
      <View style={{flexDirection: 'row'}}>
      <CustomButton size={"SM"} title={state.metric ? "Exercises" : "Metric"} onPress={() => setState({...state, metric: !state.metric})} />
        <Text style={{textAlignVertical: 'center', fontFamily: 'Roboto-Bold', fontSize: 20, marginHorizontal: 10, paddingLeft: 10}}>Show PR</Text>
        <CheckBox disabled={state.filteredExerciseTypes.length !== 1} isSelected={state.pr} onSelection={onChangePR}/>
      </View>
      <Chart
        isLandScape={screenOrientation.isLandscape}
        mode={state.mode}
        toggle
        maxExercises={state.maxExercises}
        chartData={state.chartData}
        days={state.days}
        isLoading={!mounted || state.loading}
      />
      <Contingent style={{ paddingTop: 30 }} shouldRender={state.mode === 'Daily'}>
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
        changeMode={(newMode) => setState({ ...state, mode: newMode, loading: true })}
      />
      <SideBar
        isLandScape={screenOrientation.isLandscape}
        categories={categories}
        onCategoriesChange={onCategoryChange}
        onExerciseTypesChange={(e: ExerciseTypeSchema[]) => onExerciseTypesChange(e)}
        exerciseTypes={allExerciseTypes}
        icon={'chart-bar'}
        prevSelectedCat={state.filteredCategories}
        subCategories={state.filteredExerciseTypes}
        pr={state.pr}
        decativatePR={() => setState({...state, pr: false})}
      />
    </SafeAreaView>
  );
};
