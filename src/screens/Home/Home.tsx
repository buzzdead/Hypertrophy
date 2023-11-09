import React, { useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Contingent from '../../components/Contingent';
import LoadingIndicator from '../../components/LoadingIndicator';
import { colors, getWeekNumber } from '../../utils/util';
import { HomeChartData } from './HomeChartData';
import { Chart } from '../ProgressTracking/Chart';
import { WeekPlan } from './WeekPlan';
import { useFocus, useRealm, useScreenOrientation } from '../../hooks/hooks';
import { CategorySchema, ExerciseSchema, SettingsSchema } from '../../config/realm';
import { useMount } from '../../hooks/useMount';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { Welcome } from './Welcome/Welcome';
import { setFirstTimeUser } from '../../api/exercise';

interface State {
  maxExercises: number;
  chartData: number[];
  days: string[];
  weekNumber: number;
  firstTimeUser?: boolean
}

export const Home = () => {
  const [state, setState] = useState<State>({
    maxExercises: 0,
    chartData: [],
    days: [],
    weekNumber: 0,
    firstTimeUser: false
  });

  const currentDate = new Date();
  const currentUTCDate = new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
      currentDate.getUTCHours(),
      currentDate.getUTCMinutes(),
      currentDate.getUTCSeconds()
    )
  );
  const weekNumber = getWeekNumber(currentUTCDate);
  const mounted = useMount();
  const focused = useFocus();
  const screenOrientation = useScreenOrientation()

  const { data: exercises, loading: exercisesLoading } = useRealm<ExerciseSchema>({ schemaName: 'Exercise' });
  const { data: categories, loading: categoriesLoading } = useRealm<CategorySchema>({ schemaName: 'Category' });
  const { data: settings } = useRealm<SettingsSchema>({schemaName: 'Settings'})
  const currentExercises = exercises.filter((e) => e.isValid());

  useLayoutEffect(() => {
    if (categoriesLoading || exercisesLoading) return;
    const { maxExercises, chartData, days } = HomeChartData({
      exercises: currentExercises,
      categories,
    });
    setState({ maxExercises, chartData, days, weekNumber });
  }, [exercises]);

  useFocusEffect(() => {
    if (weekNumber !== state.weekNumber && state.weekNumber > 0) {
      const { maxExercises, chartData, days } = HomeChartData({
        exercises: currentExercises,
        categories,
      });
      setState({ maxExercises, chartData, days, weekNumber });
    }
  });
  const setFirstTimeUserToLocal = async () => {
    await setFirstTimeUser()
    setState({...state, firstTimeUser: true})
  }
  useEffect(() => {
    if(settings[0]?.isFirstTimeUser) setFirstTimeUserToLocal()
  }, [settings])

  const setRead = () => {
    setState({...state, firstTimeUser: false})
  }
  if (exercisesLoading || categoriesLoading || !focused) return <LoadingIndicator />;
  if(state.firstTimeUser) return <Welcome setRead={setRead}/>
  return (
    <SafeAreaView style={{ height: '100%', width: '100%' }}>
      <ScrollView >
        <Text
          style={{
            paddingTop: 5,
            textAlign: 'center',
            fontFamily: 'Roboto-Bold',
            fontSize: 30,
            color: colors.summerDarkest,
          }}
        >
          Week {state.weekNumber || weekNumber}
        </Text>
        <MaterialCommunityIcons color='grey' name={'weight-lifter'} size={125} style={{ textAlign: 'center', paddingTop: 5 }} />

        <View style={{ paddingVertical: 20 }}>
          <WeekPlan week={state.weekNumber || weekNumber} />
        </View>
        <View style={{ width: '100%', height: '100%' }}>
          <Contingent style={{ width: '100%', height: '100%' }} shouldRender={state.maxExercises > 0}>
            <View
              style={{
                flexDirection: 'column',
                alignSelf: 'flex-end',
                justifyContent: 'center',
                width: '100%',
                alignContent: 'center',
                alignItems: 'center',
              }}
            >
              <Chart
                isLoading={!mounted}
                maxExercises={state.maxExercises} 
                chartData={state.chartData}
                days={state.days}
                mode='Categories'
                isLandScape={screenOrientation.isLandscape}
              />
            </View>
            <View style={{ width: '100%', height: '100%', paddingTop: 150 }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Roboto-Bold',
                  fontSize: 22,
                  paddingHorizontal: 50,
                }}
              >
                No data found, add some exercises.
              </Text>
            </View>
          </Contingent>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
