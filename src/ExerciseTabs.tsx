import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import ExerciseList from "./screens/Exercise/ExerciseList";
import ProgressTracking from "./screens/ProgressTracking/ProgressTracking";
import Settings from "./screens/Settings/Settings";
import {colors} from "./utils/util";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { View } from "react-native";

type BottomTabParamList = {
  List: undefined;
  Progress: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

type Props = {
  navigation: any;
  route: any;
};

const ExerciseTabs: React.FC<Props> = () => {
  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor: colors.accent, // set the active icon color to primary color
      headerTintColor: colors.summerWhite,
      headerStyle: { backgroundColor: colors.summerDark },
    }}>
      <Tab.Screen
        name="List"
        component={ExerciseList}
        initialParams={undefined}
        options={{
          title: "Exercises",
          tabBarStyle: {backgroundColor: colors.summerDark},
          headerTintColor: colors.accent,
          headerStyle: {backgroundColor: colors.summerDark},
          tabBarIcon: ({color, size, focused}) => <MaterialCommunityIcons name="dumbbell" color={focused ? colors.accent : colors.summerWhite} size={size} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressTracking}
        options={{
          title: "Progress",
          tabBarStyle: {backgroundColor: colors.summerDark},
          headerTintColor: colors.accent,
          headerStyle: {backgroundColor: colors.summerDark},
          tabBarIcon: ({color, size, focused}) => <MaterialCommunityIcons name="chart-line" color={focused ? colors.accent : colors.summerWhite} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: "Settings",
          tabBarStyle: {backgroundColor: colors.summerDark},
          headerTintColor: colors.accent,
          headerStyle: {backgroundColor: colors.summerDark},
          tabBarIcon: ({color, size, focused}) => (
            <MaterialCommunityIcons name="eye-settings-outline" color={focused ? colors.accent : colors.summerWhite} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ExerciseTabs;
