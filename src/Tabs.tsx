import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExerciseList from './screens/Exercise/ExerciseList';
import { ProgressTracking } from './screens/ProgressTracking/ProgressTracking';
import Settings from './screens/Settings/Settings';
import { colors } from './utils/util';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Home } from './screens/Home/Home';

type BottomTabParamList = {
  List: undefined;
  Progress: undefined;
  Settings: undefined;
  Home: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

type Props = {
  navigation: any;
  route: any;
};

const options = {
  tabBarStyle: { backgroundColor: colors.summerDark },
  headerTintColor: colors.summerWhite,
  headerStyle: { backgroundColor: colors.summerDark },
};

const renderIcon = (name: string, focused: boolean, size: number) => {
  return <MaterialCommunityIcons name={name} color={focused ? colors.accent : colors.summerWhite} size={size} />;
};

const Tabs: React.FC<Props> = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.accent, // set the active icon color to primary color
        headerTintColor: colors.summerWhite,
        headerStyle: { backgroundColor: colors.summerDark },
      }}
    >
      <Tab.Screen
        name='Home'
        component={Home}
        initialParams={undefined}
        options={{
          title: 'Home',
          ...options,
          tabBarIcon: ({ size, focused }) => renderIcon('home', focused, size),
        }}
      />
      <Tab.Screen
        name='List'
        component={ExerciseList}
        initialParams={undefined}
        options={{
          title: 'Exercises',
          ...options,
          tabBarIcon: ({ size, focused }) => renderIcon('dumbbell', focused, size),
        }}
      />
      <Tab.Screen
        name='Progress'
        component={ProgressTracking}
        options={{
          title: 'Progress',
          ...options,
          tabBarIcon: ({ size, focused }) => renderIcon('chart-line', focused, size),
        }}
      />
      <Tab.Screen
        name='Settings'
        component={Settings}
        options={{
          title: 'Settings',
          ...options,
          tabBarIcon: ({ size, focused }) => renderIcon('eye-settings-outline', focused, size),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
