import {useFocusEffect, useIsFocused} from "@react-navigation/native";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {SafeAreaView, View, Text} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Contingent from "../../components/Contingent";
import LoadingIndicator from "../../components/LoadingIndicator";
import {colors, getWeekNumber, months} from "../../utils/util";
import {HomeChartData} from "./HomeChartData";
import {Chart} from "../ProgressTracking/Chart";
import { WeekPlan } from "./WeekPlan";
import { useRealm } from "../../hooks/hooks";
import { CategorySchema, ExerciseSchema } from "../../config/realm";
import { useFocus } from "../../hooks/useFocus";

interface State {
  maxExercises: number;
  chartData: number[];
  days: string[];
}

export const Home = () => {
  const [state, setState] = useState<State>({maxExercises: 0, chartData: [], days: []});

  const currentDate = new Date();
  const currentUTCDate = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds()));
  const weekNumber = getWeekNumber(currentUTCDate);
  const isFocused = useFocus()

  const {data: exercises, loading: exercisesLoading} = useRealm<ExerciseSchema>({schemaName: "Exercise"});
  const {data: categories, loading: categoriesLoading} = useRealm<CategorySchema>({schemaName: "Category"});
  const currentExercises = exercises.filter(e => e.isValid());
  

  useFocusEffect(
    useCallback(() => {
      if (categoriesLoading || exercisesLoading || !isFocused.current) return;
      const {maxExercises, chartData, days} = HomeChartData({exercises: currentExercises, categories});
      setState({maxExercises, chartData, days});
    }, [exercisesLoading || categoriesLoading || exercises]),
  );

  if (exercisesLoading || categoriesLoading || !isFocused.current) return <LoadingIndicator />;
  
  return (
    <SafeAreaView style={{height: '100%', width: '100%'}}>
      <Text
          style={{
            paddingTop: 5,
            textAlign: "center",
            fontFamily: "Roboto-Medium",
            fontSize: 30,
            color: colors.summerDark,
          }}>
          Week {weekNumber}
        </Text>
        <MaterialCommunityIcons
            name={"weight-lifter"}
            size={100}
            style={{textAlign: 'center', paddingTop: 5}}
            
          />
        <Text
          style={{
            paddingTop: 5,
            textAlign: "center",
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: colors.summerDarkest,
          }}>
          Day {currentDate.getUTCDay()} of 7
        </Text>
        <WeekPlan week={weekNumber}/>
      <View style={{width: '100%', height: '100%'}}>
        <Contingent style={{width: '100%', height: '100%'}} shouldRender={state.maxExercises !== 0}>
          <View style={{flexDirection: 'column', alignSelf: 'flex-end'}}>
        <Chart
          maxExercises={state.maxExercises}
          chartData={state.chartData}
          days={state.days}
          mode="Categories"
          isLandScape={false}
        />
        </View>
        <View style={{width: '100%', justifyContent: 'center', height: '100%'}}><Text style={{textAlign: 'center', fontFamily: 'Roboto-Bold'}}>No data found, add some exercises.</Text></View>
        </Contingent>
      </View>
    </SafeAreaView>
  );
};
