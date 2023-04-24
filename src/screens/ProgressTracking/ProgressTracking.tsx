// screens/ProgressTracking.tsx
import React, { useState } from "react";
import {SafeAreaView, View, ScrollView, RefreshControl, Dimensions, Text, StyleSheet} from "react-native";
import {LineChart, YAxis, XAxis, BarChart} from "react-native-svg-charts";
import * as shape from "d3-shape";
import {useExercises} from "../../hooks/useExercises";
import {ChartData} from "./ChartData";
import {colors} from "../../utils/util";
import {useCategories} from "../../hooks/useCategories";
import {SideBar} from "../../components/SideBar";
import {CategorySchema} from "../../config/realmConfig";
import CustomButton from "../../components/CustomButton";
import { useScreenOrientation } from "../../hooks/useScreenOrientation";

const ProgressTracking = () => {
  const {exercises, refresh} = useExercises();
  const {categories} = useCategories();
  const screenOrientation = useScreenOrientation()

  const [refreshing, setRefreshing] = React.useState(false);
  const [chartData, setChartData] = React.useState<number[]>([]);
  const [maxExercises, setMaxExercises] = React.useState(0);
  const [startDate, setStartDate] = React.useState<Date>();
  const [chartWidth, setChartWidth] = React.useState(Dimensions.get("window").width * 0.9)
  const [mode, setMode] = useState<'Weekly' | 'Daily'>('Daily')
  const [filteredCategories, setFilteredCategories] = React.useState<CategorySchema[]>([]);

  const _onRefresh = () => {
    setRefreshing(true);
    refresh();
    setRefreshing(false);
  };

  React.useLayoutEffect(() => {
    const {chartData, maxExercises, theDate} = ChartData({exercises, categories: filteredCategories, mode});
    setChartData(chartData);
    setMaxExercises(maxExercises);
    setStartDate(theDate);
  }, [exercises, filteredCategories, mode]);

  const dataPointWidth = chartWidth / (chartData?.length || 1);

  const handleFilterChange = (selectedCategories: CategorySchema[]) => {
    if (selectedCategories.length === 0) {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(categories.filter(category => selectedCategories.some(c => c.id === category.id)));
    }
  };

  return (
    <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: screenOrientation.isLandscape ? 'flex-start' : "center"}}>
      <ScrollView
        style={{paddingTop: screenOrientation.isLandscape ? 0 : 160}}
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
        <Text style={styles.legend}># of exercises</Text>
        <View style={styles.yAxis}>
          <YAxis
            data={chartData}
            style={{marginRight: 10}}
            contentInset={{top: 20, bottom: 40}}
            svg={{
              fill: "grey",
              fontSize: 10,
            }}
            numberOfTicks={maxExercises}
          />
          <BarChart
            style={{flex: 1}}
            data={chartData}
            contentInset={{top: 20, bottom: 20}}
            svg={{ fill: colors.summerBlue }} // Set the fill color for the bars
        spacingInner={0.1}
        spacingOuter={0.2}
        gridMin={0}
            curve={shape.curveBasis}></BarChart>
        </View>
        <XAxis
          style={{...styles.xAxis, width: screenOrientation.isLandscape ? 650 : 330, left: 5}}
          data={chartData}
          
          contentInset={{left: dataPointWidth / 2 + 10, right: dataPointWidth / 2}}
          svg={{fontSize: 10, fill: "grey"}}
        />
        <View style={{flexDirection: "row", gap: 100}}>
          <Text style={{...styles.legend, fontSize: 10, marginTop: 10, paddingLeft: 35}}>{startDate?.toLocaleDateString()}</Text>
          <Text style={{...styles.legend, marginTop: 10, textAlign: "center"}}>{mode}</Text>
          <Text style={{...styles.legend, fontSize: 10, marginTop: 10, paddingLeft: 35}}>{new Date().toLocaleDateString()}</Text>
        </View>
      </ScrollView>
      <View style={[styles.buttons, screenOrientation.isLandscape ? styles.buttonsLandScape : styles.buttonsNormal]}>
      <CustomButton size={screenOrientation.isLandscape ? 'S' : 'M'} title={screenOrientation.isLandscape ? 'W' : 'Weekly'} backgroundColor={colors.summerDark} titleColor={mode === 'Weekly' ? colors.summerBlue : colors.summerWhite} onPress={() => setMode('Weekly')} disabled={mode === 'Weekly'}/>
      <CustomButton size={screenOrientation.isLandscape ? 'S' : 'M'} title={screenOrientation.isLandscape ? 'D' : 'Daily'} backgroundColor={colors.summerDark} titleColor={mode === 'Daily' ? colors.summerBlue : colors.summerWhite} onPress={() => setMode('Daily')} disabled={mode === 'Daily'}/>
      </View>
      <SideBar categories={categories} onFilterChange={handleFilterChange} icon={"chart-bar"} />
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
    fontSize: 10,
    fontFamily: "Roboto-MediumItalic",
    color: colors.new,
  },
  yAxis: {
    justifyContent: "center",
    flexDirection: "row",
    padding: 20,
    flex: 2,
    maxHeight: 300,
    marginLeft: 10
  },
  xAxis: {
    marginTop: -25,
    marginLeft: 30,
    width: 350,
  },
  buttons: {
    position: 'absolute',
    gap: 10,
  },
  buttonsLandScape: {
    right: 5,
    bottom: 5,
    flexDirection: 'column'
  },
  buttonsNormal: {
    bottom: 10,
    alignSelf: "center",
    flexDirection: 'row'
  }
});

export default ProgressTracking;
