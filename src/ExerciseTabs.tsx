import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import ExerciseList from "./screens/ExerciseList";
import ProgressTracking from "./screens/ProgressTracking";
import Settings from "./screens/Settings";
import { colors } from "./utils/util";

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
    <Tab.Navigator>
      <Tab.Screen
        name="List"
        component={ExerciseList}
        initialParams={undefined}
        options={{title: "Exercises", headerTintColor: colors.onSecondary, headerStyle: {backgroundColor: colors.accent}}}
      />
      <Tab.Screen name="Progress" component={ProgressTracking} options={{title: "Progress", headerTintColor: colors.onSecondary, headerStyle: {backgroundColor: colors.accent}}} />
      <Tab.Screen name="Settings" component={Settings} options={{title: "Settings", headerTintColor: colors.onSecondary, headerStyle: {backgroundColor: colors.accent}}} />
    </Tab.Navigator>
  );
};

export default ExerciseTabs;
