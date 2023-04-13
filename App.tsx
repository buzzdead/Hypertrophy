// App.tsx
import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Tabs from "./src/Tabs";
import {colors} from "./src/utils/util";
import AddExercise from "./src/screens/Exercise/AddExercise/AddExercise";
import ExerciseDetails from "./src/screens/Exercise/ExerciseDetails/ExerciseDetails";
import { ExerciseTypes } from "./src/screens/Settings/ExerciseTypes";
import { Categories } from "./src/screens/Settings/Categories";
import { Duplicate } from "./typings/types";

type StackParamList = {
  Exercises: undefined;
  Details: {exerciseId?: number, duplicates?: Duplicate[]};
  AddExercise: undefined;
  ExerciseTypes: undefined;
  Categories: undefined
};

const Stack = createStackNavigator<StackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Exercises" component={Tabs} options={{headerShown: false}} />
        <Stack.Screen
          name="Details"
          component={ExerciseDetails}
          options={{
            title: "Exercise Details",
            headerTintColor: colors.summerWhite,
            headerStyle: {backgroundColor: colors.summerDark},
          }}
        />
        <Stack.Screen
          name="AddExercise"
          component={AddExercise}
          options={{
            title: "Add Exercise",
            headerTintColor: colors.summerWhite,
            headerStyle: {backgroundColor: colors.summerDark},
          }}
        />
        <Stack.Screen
          name="Categories"
          component={Categories}
          options={{
            title: "Categories",
            headerTintColor: colors.summerWhite,
            headerStyle: {backgroundColor: colors.summerDarkest},
          }}
        />
        <Stack.Screen
          name="ExerciseTypes"
          component={ExerciseTypes}
          options={{
            title: "ExerciseTypes",
            headerTintColor: colors.summerWhite,
            headerStyle: {backgroundColor: colors.summerDarkest},
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
