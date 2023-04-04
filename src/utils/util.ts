import {DefaultTheme} from 'react-native-paper'
import { ExerciseReducerState } from '../Reducer';
import { Exercise } from '../types';

const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3498db',
      accent: '#2ecc71',
      new: "#66CDAA",
      test: "#F5FFFA",
      test2: "#48D1CC",
    }
  }

export const colors = MyTheme.colors;

export const getPreviousStateMergedWithInitialState = (initialState: ExerciseReducerState, previousExercise: Exercise) => {
  const newState = {...initialState}
  newState.name = previousExercise.name
  newState.sets = previousExercise.sets
  newState.category = previousExercise.category
  newState.reps = previousExercise.reps
  newState.weight = Number(previousExercise.weight);
  return newState
}