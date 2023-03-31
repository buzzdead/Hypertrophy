// screens/ProgressTracking.tsx
import React from "react";
import { Button, SafeAreaView, Text, TouchableOpacity, View, Dimensions, FlatList, ScrollView, RefreshControl } from "react-native";

import {LineChart, Grid, YAxis, XAxis} from "react-native-svg-charts";
import * as shape from "d3-shape";
import {useExercises} from "../../hooks/useExercises";
import {aggregateData, AggregatedDataItem} from "../../utils/chartDataUtils";
type TimeFrameType = "day" | "week" | "month";

const ProgressTracking = () => {
  const [timeFrame, setTimeFrame] = React.useState<TimeFrameType>("day"); // 'week', 'month'
  const [selectedDataPoint, setSelectedDataPoint] = React.useState<Nullable<AggregatedDataItem>>(null);
  const timeFrames: TimeFrameType[] = ["day", "week", "month"];

  const {exercises, refresh} = useExercises();
  console.log(exercises)

  const [refreshing, setRefreshing] = React.useState(false);

  const _onRefresh = () => {
    setRefreshing(true);
    refresh();

    // Update your exercises data here and update your component's state.
    // Once the data updating is done, set the refreshing state to false.

    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // This is a simulation of data updating. Replace it with your own data updating logic.
  };

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth * 0.9;

  const handleChartPress = (index: number) => {
    setSelectedDataPoint(aggregatedData[index] || null);
  };

  function renderInfo(): React.ReactNode {
    if (chartData.length === 1)
      return (
        <View style={{width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
          <Text>Not enough data, try again later.</Text>
        </View>
      );
    return (
      <View style={{alignSelf: "center", top: 40, position: "absolute"}}>
        <Text>Number of exercises:{selectedDataPoint ? selectedDataPoint.exercises : ""}</Text>
        <Text>Categories: {selectedDataPoint ? Array.from(selectedDataPoint.categories).join(", ") : ""}</Text>
      </View>
    );
  }

  const aggregatedData = aggregateData(exercises, timeFrame);
  const chartData = aggregatedData.map(item => item.exercises);
  const dataPointWidth = chartWidth / (chartData.length);

  return (
    <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={_onRefresh}
          colors={["#9Bd35A", "#689F38"]}
          progressBackgroundColor="#fff"
          tintColor="#689F38"
        />
      }
    >
      <View style={{flexDirection: "row", padding: 20, flex: 1, maxHeight: 500}}>
        <YAxis
          data={chartData}
          contentInset={{top: 20, bottom: 20}}
          svg={{
            fill: "grey",
            fontSize: 10,
          }}
          numberOfTicks={10}
          formatLabel={value => `${value}`}
        />
        <TouchableOpacity
          style={{width: "90%", height: "100%"}}
          onPress={(event: {nativeEvent: {locationX: any}}) => {
            const {locationX} = event.nativeEvent;
            const index = Math.floor(locationX / dataPointWidth);
            if (index >= 0 && index < chartData.length) {
              handleChartPress(index);
            }
          }}>
          <LineChart
            style={{flex: 1, marginLeft: 16}}
            data={chartData}
            svg={{stroke: "rgb(134, 65, 244)"}}
            contentInset={{top: 20, bottom: 20}}
            curve={shape.curveBasis}></LineChart>
        </TouchableOpacity>
      </View>
      {renderInfo()}
      <XAxis
  style={{ marginTop: 10, width: chartWidth, marginLeft: 16 }}
  data={Array.from({ length: chartData.length }, (_, i) => i)}
  contentInset={{ left: dataPointWidth / 2, right: dataPointWidth / 2 }}
  svg={{ fontSize: 10, fill: "grey" }}
/>
      <View style={{flexDirection: "row", gap: 5, position: "absolute", bottom: 20}}>
        {timeFrames.map(timeFrame => {
          return (
            <View key={timeFrame} style={{minWidth: 100}}>
              <Button title={timeFrame} onPress={() => setTimeFrame(timeFrame)} />
            </View>
          );
        })}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProgressTracking;
