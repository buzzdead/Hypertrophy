import {useFocusEffect} from "@react-navigation/native";
import React, {useCallback, useState} from "react";
import {SafeAreaView, View, Text} from "react-native";
import LoadingIndicator from "../components/LoadingIndicator";
import {useCategories} from "../hooks/useCategories";
import {useExercises} from "../hooks/useExercises";
import {colors, getWeekNumber, months} from "../utils/util";
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
  const currentMonth = months.find(m => m.numerical === currentDate.getMonth())

  useFocusEffect(
    useCallback(() => {
      if (categoriesLoading || exercisesLoading) return;
      const {maxExercises, chartData, days} = HomeChartData({exercises: currentExercises, categories});
      setState({maxExercises, chartData, days});
    }, [exercisesLoading || categoriesLoading]),
  );
  if (exercisesLoading || categoriesLoading) return <LoadingIndicator />;
  return (
    <SafeAreaView style={{height: '100%'}}>
      <Text
          style={{
            paddingTop: 25,
            textAlign: "center",
            fontFamily: "Roboto-Medium",
            fontSize: 36,
            color: 'black',
            fontWeight: "800"
          }}>
          {currentMonth?.name}, 2023
        </Text>
      <Text
          style={{
            paddingTop: 25,
            textAlign: "center",
            fontFamily: "Roboto-Medium",
            fontSize: 30,
            color: colors.summerDark,
          }}>
          Week {weekNumber}
        </Text>
        <Text
          style={{
            paddingTop: 25,
            textAlign: "center",
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: colors.summerDarkest,
          }}>
          Day {currentDate.getDay()} of 7
        </Text>
      <View style={{position: 'absolute', bottom: 50}}>
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
