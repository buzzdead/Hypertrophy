import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import ExerciseList from "./screens/ExerciseList";
import ProgressTracking from "./screens/ProgressTracking";
import Settings from "./screens/Settings";

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
        options={{title: "Exercises"}}
      />
      <Tab.Screen name="Progress" component={ProgressTracking} options={{title: "Progress"}} />
      <Tab.Screen name="Settings" component={Settings} options={{title: "Settings"}} />
    </Tab.Navigator>
  );
};

export default ExerciseTabs;
