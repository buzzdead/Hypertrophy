// App.tsx
import React, { useEffect, useState } from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Tabs from "./src/Tabs";
import {colors} from "./src/utils/util";
import AddExercise from "./src/screens/Exercise/AddExercise/AddExercise";
import ExerciseDetails from "./src/screens/Exercise/ExerciseDetails/ExerciseDetails";
import { ExerciseTypes } from "./src/screens/Settings/ExerciseTypes";
import { Categories } from "./src/screens/Settings/Categories";
import { Duplicate } from "./typings/types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import SplashScreen from 'react-native-splash-screen';
import { QueryClient, QueryClientProvider } from 'react-query';

type StackParamList = {
  Exercises: undefined;
  Details: {exerciseId?: number, duplicates?: Duplicate[]};
  AddExercise: undefined;
  ExerciseTypes: undefined;
  Categories: undefined
};

const Stack = createStackNavigator<StackParamList>();

const queryClient = new QueryClient();

const App = () => {
 
  useEffect(() => {
    SplashScreen.hide()
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Exercises" component={Tabs} options={{headerShown: false}} />
        <Stack.Screen
          name="Details"
          component={ExerciseDetails}
          
          options={{
            title: "Exercise Details",
            headerTintColor: colors.summerWhite,
            headerTitleAlign: "center",
            headerTitleStyle: {fontSize: 22},
            headerStyle: {backgroundColor: colors.summerDark},
            headerLeft: () => {
              const { goBack } = useNavigation();
              return (
              <MaterialCommunityIcons
            adjustsFontSizeToFit
            name={'hand-pointing-left'}
            onPress={() => goBack()}
            size={38}
            style={{paddingLeft: 10}}
            color={'white'}
          />
              )
            }
          }}
        />
        <Stack.Screen
          name="AddExercise"
          component={AddExercise}
          options={{
            title: "Add Exercise",
            headerTintColor: colors.summerWhite,
            headerTitleAlign: "center",
            headerTitleStyle: {fontSize: 22},
            headerStyle: {backgroundColor: colors.summerDark},
            headerLeft: () => {
              const { goBack } = useNavigation();
              return (
              <MaterialCommunityIcons
            adjustsFontSizeToFit
            name={'hand-pointing-left'}
            onPress={() => goBack()}
            size={38}
            style={{paddingLeft: 10}}
            color={'white'}
          />
              )
            }
          }}
        />
        <Stack.Screen
          name="Categories"
          component={Categories}
          options={{
            title: "Categories",
            headerTintColor: colors.summerWhite,
            
            headerTitleAlign: "center",
            headerTitleStyle: {fontSize: 22},
            headerStyle: {backgroundColor: colors.summerDarkest},
            headerLeft: () => {
              const { goBack } = useNavigation();
              return (
              <MaterialCommunityIcons
            adjustsFontSizeToFit
            name={'hand-pointing-left'}
            onPress={() => goBack()}
            size={38}
            style={{paddingLeft: 10}}
            color={'white'}
          />
              )
            }
          }}
        />
        <Stack.Screen
          name="ExerciseTypes"
          component={ExerciseTypes}
          options={{
            title: "ExerciseTypes",
            headerTintColor: colors.summerWhite,
            
            headerTitleAlign: "center",
            headerTitleStyle: {fontSize: 22},
            headerStyle: {backgroundColor: colors.summerDarkest},
            headerLeft: () => {
              const { goBack } = useNavigation();
              return (
              <MaterialCommunityIcons
            adjustsFontSizeToFit
            name={'hand-pointing-left'}
            onPress={() => goBack()}
            size={38}
            style={{paddingLeft: 10}}
            color={'white'}
          />
              )
            }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'column'
  },
});

export default App;
