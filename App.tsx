// App.tsx
import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import ExerciseDetails from "./src/screens/ExerciseDetails/ExerciseDetails";
import {createStackNavigator} from "@react-navigation/stack";
import ExerciseTabs from "./src/ExerciseTabs";
import AddExercise from "./src/screens/AddExercise/AddExercise";
import { colors } from "./src/utils/util";

type StackParamList = {
  Exercises: undefined;
  Details: {exerciseId?: number};
  AddExercise: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Exercises" component={ExerciseTabs} options={{headerShown: false}} />
        <Stack.Screen name="Details" component={ExerciseDetails} options={{title: "Exercise Details", headerTintColor: colors.onSecondary, headerStyle: {backgroundColor: colors.accent}}} />
        <Stack.Screen name="AddExercise" component={AddExercise} options={{title: "Add Exercise", headerStyle: {backgroundColor: colors.onSecondary }}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
