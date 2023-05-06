import {useFocusEffect} from "@react-navigation/native";
import React, {useCallback, useState} from "react";
import {SafeAreaView, View, Text} from "react-native";
import LoadingIndicator from "../components/LoadingIndicator";
import {useCategories} from "../hooks/useCategories";
import {useExercises} from "../hooks/useExercises";
import {colors, getWeekNumber} from "../utils/util";
import {HomeChartData} from "./HomeChartData";
import {Chart} from "./ProgressTracking/Chart";

interface State {
  maxExercises: number;
  chartData: number[];
  days: string[];
}

export const Home = () => {
  const [state, setState] = useState<State>({maxExercises: 0, chartData: [], days: []});

  const currentDate = new Date();
  const weekNumber = getWeekNumber(currentDate);

  const {exercises, loading: exercisesLoading} = useExercises();
  const {categories, loading: categoriesLoading} = useCategories();
  const currentExercises = exercises.filter(e => e.isValid());

  useFocusEffect(
    useCallback(() => {
      if (categoriesLoading || exercisesLoading) return;
      const {maxExercises, chartData, days} = HomeChartData({exercises: currentExercises, categories});
      setState({maxExercises, chartData, days});
    }, [exercisesLoading || categoriesLoading]),
  );
  if (exercisesLoading || categoriesLoading) return <LoadingIndicator />;
  return (
    <SafeAreaView>
      <View style={{height: "100%", justifyContent: "center", gap: 50}}>
        <Text
          style={{
            paddingTop: 50,
            textAlign: "center",
            fontFamily: "Roboto-Medium",
            fontSize: 30,
            color: colors.categories.Back,
          }}>
          Progress for week: {weekNumber}
        </Text>
        <Chart
          maxExercises={state.maxExercises}
          chartData={state.chartData}
          days={state.days}
          mode="Categories"
          isLandScape={false}
        />
      </View>
    </SafeAreaView>
  );
};
