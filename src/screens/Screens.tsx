// Screens.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from '../Tabs';
import { colors } from '../utils/util';
import AddExercise from './Exercise/AddExercise/AddExercise';
import ExerciseDetails from './Exercise/ExerciseDetails/ExerciseDetails';
import { ExerciseTypes } from './Settings/ExerciseTypes';
import { Categories } from './Settings/Categories';
import { Duplicate } from '../../typings/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { ColorScheme } from './Settings/ColorScheme';

type StackParamList = {
  Exercises: undefined;
  Details: { exerciseId?: number; duplicates?: Duplicate[] };
  AddExercise: undefined;
  ExerciseTypes: undefined;
  Categories: undefined;
  ColorScheme: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const navigationOptions = (title: string) => ({
  title,
  headerTintColor: colors.summerWhite,
  headerTitleAlign: 'center' as 'center' | 'left',
  headerTitleStyle: { fontSize: 22 },
  headerStyle: { backgroundColor: colors.summerDark },
  headerLeft: () => {
    const { goBack } = useNavigation();
    return (
      <MaterialCommunityIcons
        adjustsFontSizeToFit
        name={'hand-pointing-left'}
        onPress={() => goBack()}
        size={38}
        style={{ paddingLeft: 10 }}
        color={'white'}
      />
    );
  },
});

const Screens = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Exercises' component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name='Details' component={ExerciseDetails} options={navigationOptions('Exercise Details')} />
      <Stack.Screen name='AddExercise' component={AddExercise} options={navigationOptions('Add Exercise')} />
      <Stack.Screen name='Categories' component={Categories} options={navigationOptions('Categories')} />
      <Stack.Screen name='ExerciseTypes' component={ExerciseTypes} options={navigationOptions('Exercise Types')} />
      <Stack.Screen name='ColorScheme' component={ColorScheme} options={navigationOptions('Color Scheme')} />
    </Stack.Navigator>
  );
};

export default Screens;
