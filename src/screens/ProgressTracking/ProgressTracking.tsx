import React, { useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { SideBar } from '../../components/SideBar';
import { CategorySchema, ExerciseTypeSchema } from '../../config/realm';
import { ProgressTrackingBtm } from './ProgressTrackingBtm';
import LoadingIndicator from '../../components/LoadingIndicator';
import { Chart } from './Chart';
import { useScreenOrientation } from '../../hooks/hooks';
import { useFocus } from '../../hooks/useFocus';
import { useMount } from '../../hooks/useMount';
import Toast from 'react-native-toast-message';
import { Navigation } from '../../components/Navigation';
import { ProgressTrackingTop } from './ProgressTrackingTop';
import { useProgressTracking } from '../../hooks/useProgressTracking';

const ProgressTracking: React.FC = () => {
  const screenOrientation = useScreenOrientation();
  const mounted = useMount();
  const focused = useFocus();

  const { state, setState, getChartData, updateChart, exercises, categories, months, allExerciseTypes, loaded } =
    useProgressTracking(mounted);

  const containsMonth = (month: number) => {
    if (!state.availableMonths) return;
    if(state.mode === "Weekly") return false
    return months?.find((e) => e.month === state.availableMonths[month]?.numerical);
  };

  const handleNext = () => {
    if (state.loading) return;
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
    if (state.loading) return;
    if (!state.lastHalf && !containsMonth(state.currentMonth - 1)) {
      return;
    }
    if (state.lastHalf) getChartData(false);
    else if (!state.lastHalf && containsMonth(state.currentMonth - 1)) {
      const newCurrentMonth = state.currentMonth - 1;
      getChartData(true, newCurrentMonth);
    }
  };

  const handleFirst = () => {
    if (state.loading) return;
    getChartData(false, 0);
  };

  const handleLast = () => {
    if (state.loading) return;
    getChartData(true, state.availableMonths.length - 1);
  };

  const onExerciseTypesChange = async (exerciseTypes: ExerciseTypeSchema[]) => {
    const newExerciseTypes = exerciseTypes.length > 0 ? allExerciseTypes.filter((e) => exerciseTypes.some((et) => et.id === e.id)) : [];
    updateChart(state.availableMonths, state.currentMonth, state.lastHalf, newExerciseTypes);
  };

  const onCategoryChange = (selectedCategories: CategorySchema[], exerciseTypes?: ExerciseTypeSchema[]) => {
    const newExerciseTypes = exerciseTypes
      ? exerciseTypes?.length > 0
        ? allExerciseTypes.filter((e) => exerciseTypes?.some((et) => et.id === e.id))
        : []
      : state.filteredExerciseTypes;
    getChartData(
      state.lastHalf,
      state.currentMonth,
      selectedCategories,
      newExerciseTypes,
      state.pr && newExerciseTypes.length !== 1 ? false : state.pr
    );
  };

  const onChangePR = () => {
    if (state.filteredExerciseTypes.length === 1)
      getChartData(state.lastHalf, state.currentMonth, state.filteredCategories, state.filteredExerciseTypes, !state.pr);
    else {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'One and only one type of exercise must be selected.',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 0,
      });
    }
  };

  const toggleChartType = () => {
    setState({ ...state, chartType: state.chartType === 'Bar' ? 'Line' : 'Bar' });
  };

  useEffect(() => {
    if (!mounted) return;
    setTimeout(() => setState({ ...state, loading: false }), 50);
  }, [state.lastHalf, state.currentMonth, state.maxExercises, state.filteredCategories, state.chartData]);

  useLayoutEffect(() => {
    if (!loaded) return;
    getChartData();
  }, [loaded, state.mode, state.metric, exercises]);

  if (!focused || !mounted) return <LoadingIndicator />;

  if (months.length === 0)
    return (
      <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
        <Text style={{ textAlign: 'center', fontFamily: 'Roboto-Bold', fontSize: 22, paddingHorizontal: 50 }}>
          No data found, add some exercises.
        </Text>
      </View>
    );

  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        justifyContent: screenOrientation.isLandscape ? 'flex-start' : 'center',
        alignItems: 'center',
        gap: 20,
        flex: 1,
      }}
    >
      <ProgressTrackingTop
        pr={state.pr}
        isLandscape={screenOrientation.isLandscape}
        numberOfExerciseTypes={state.filteredExerciseTypes.length}
        exerciseType={state?.filteredExerciseTypes[0]}
        metric={state.metric}
        onChangeMetric={() => setState({ ...state, metric: !state.metric })}
        onChangePr={onChangePR}
      />
      <View style={{ marginTop: screenOrientation.isLandscape ? 0 : 50 }}>
        <Chart
          isLandScape={screenOrientation.isLandscape}
          mode={state.mode}
          isMetric={state.metric}
          toggle
          maxExercises={state.maxExercises}
          chartData={state.chartData}
          days={state.days}
          chartType={state.chartType}
          isLoading={!mounted || state.loading}
        />
      </View>
      <View style={{ position: 'absolute', width: '100%', bottom: 75, zIndex: 821276312763 }}>
        <ProgressTrackingBtm
          mode={state.mode}
          landScapeOrientation={screenOrientation.isLandscape}
          changeMode={(newMode) => setState({ ...state, mode: newMode, loading: true })}
        />
      </View>
      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <Navigation
          textDisplay={state.mode === 'Weekly' ? !state.lastHalf ? "Q1/Q2" : "Q3/Q4" : state.availableMonths[state.currentMonth]?.name}
          firstPage={!state.lastHalf && state.currentMonth === 0}
          lastPage={state.lastHalf && state.currentMonth === state.availableMonths.length - 1}
          handleNextPage={handleNext}
          handlePrevPage={handlePrev}
          handleGoToLastPage={handleLast}
          handleGoToFirstPage={handleFirst}
          sideBtnFnc={toggleChartType}
          sideBtnTxt={state.chartType}
        />
      </View>
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
        decativatePR={() => setState({ ...state, pr: false })}
      />
      <Toast />
    </SafeAreaView>
  );
};

export default ProgressTracking