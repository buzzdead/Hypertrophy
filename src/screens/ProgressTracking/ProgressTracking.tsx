// screens/ProgressTracking.tsx
import React from "react";
import {SafeAreaView, View, ScrollView, RefreshControl, Dimensions, Text, StyleSheet, Button} from "react-native";

import {LineChart, YAxis, XAxis} from "react-native-svg-charts";
import * as shape from "d3-shape";
import {useExercises} from "../../hooks/useExercises";
import {ChartData} from "./ChartData";
import { colors } from "../../utils/util";
import { useCategories } from "../../hooks/useCategories";
import { SideBar } from "../SideBar";

const ProgressTracking = () => {
  const {exercises, refresh} = useExercises();
  const categories = useCategories()

  const [refreshing, setRefreshing] = React.useState(false);
  const [chartData, setChartData] = React.useState<number[]>([])
  const [maxExercises, setMaxExercises] = React.useState(0)
  const [filteredCategories, setFilteredCategories] = React.useState<string[]>([])

  const _onRefresh = () => {
    setRefreshing(true);
    refresh();
    setRefreshing(false);
  };

  React.useEffect(() => {
    const {chartData, maxExercises, exercisesByDate} = ChartData({exercises, categories: filteredCategories})
    setChartData(chartData)
    setMaxExercises(maxExercises)
  }, [exercises, filteredCategories])

  const chartWidth = Dimensions.get("window").width * 0.9;
  const dataPointWidth = chartWidth / (chartData?.length || 1);

  const handleFilterChange = (selectedCategories: string[]) => {
    if (selectedCategories.length === 0) {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(categories.filter(category => selectedCategories.includes(category)));
    }
  };

  return (
    <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text style={styles.header}>
        This is the graph of exercises spread out from the day you started exercising till today
      </Text>
      <ScrollView
        style={{paddingTop: 80}}
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh}
            colors={["#9Bd35A", "#689F38"]}
            progressBackgroundColor="#fff"
            tintColor="#689F38"
          />
        }>
          <Text style={styles.legend}>Days</Text>
        <View style={styles.yAxis}>
          <YAxis
            data={chartData}
            contentInset={{top: 20, bottom: 40}}
            svg={{
              fill: "grey",
              fontSize: 10,
            }}
            numberOfTicks={maxExercises}
          />

          <LineChart
            style={{flex: 1, marginLeft: 16}}
            data={chartData}
            svg={{stroke: colors.primary}}
            contentInset={{top: 20, bottom: 40}}
            curve={shape.curveCatmullRom}></LineChart>
        </View>
        <XAxis
          style={styles.xAxis}
          data={chartData}
          contentInset={{left: dataPointWidth / 2, right: dataPointWidth / 2}}
          svg={{fontSize: 10, fill: "grey"}}
        />
        <Text style={{...styles.legend, marginLeft: 40, marginTop: 10, textAlign: "center"}}>Exercises</Text>
      </ScrollView>
      <SideBar categories={categories} onFilterChange={handleFilterChange} icon={'chart-bar'} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontFamily: "Roboto-Medium",
    padding: 50,
    textAlign: "center",
  },
  legend: {
    fontSize: 10, fontFamily: "Roboto-MediumItalic", color: colors.primary
  },
  yAxis: {
    justifyContent: "center",
    flexDirection: "row",
    padding: 20,
    flex: 2,
    maxHeight: 300,
  },
  xAxis: {
    marginTop: -25,
    marginLeft: 30,
    width: 350,
  },
});

export default ProgressTracking;
