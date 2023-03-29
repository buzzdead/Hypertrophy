// screens/ProgressTracking.tsx
import React, {useEffect, useRef} from "react";
import {Button, SafeAreaView, Text, TouchableOpacity, View, Dimensions} from "react-native";
import {LineChart, Grid, YAxis, XAxis} from "react-native-svg-charts";
import * as shape from "d3-shape";
import {useExercises} from "../../hooks/useExercises";
import {aggregateData, AggregatedDataItem} from "../../utils/chartDataUtils";

const ProgressTracking = () => {
  const [timeFrame, setTimeFrame] = React.useState("day"); // 'week', 'month'
  const [selectedDataPoint, setSelectedDataPoint] = React.useState<Nullable<AggregatedDataItem>>(null);

  const exercises = useExercises();

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth * 0.9;

  const handleChartPress = (index: number) => {
    setSelectedDataPoint(aggregatedData[index] || null);
  };

  const aggregatedData = aggregateData(exercises, timeFrame);
  const chartData = aggregatedData.map(item => item.exercises);
  const dataPointWidth = chartWidth / (chartData.length + 1);

  return (
    <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
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
      <View style={{alignSelf: "center", top: 40, position: "absolute"}}>
        <Text>Number of exercises:{selectedDataPoint ? selectedDataPoint.exercises : ""}</Text>
        <Text>Categories: {selectedDataPoint ? Array.from(selectedDataPoint.categories).join(", ") : ""}</Text>
      </View>
      <XAxis
        style={{marginHorizontal: -10, marginTop: 10, width: "100%"}}
        data={chartData}
        contentInset={{left: 100, right: 100}}
        svg={{fontSize: 10, fill: "grey"}}
      />
      <View style={{flexDirection: "row", gap: 5, position: "absolute", bottom: 20}}>
        <Button title="Day" onPress={() => setTimeFrame("day")} />
        <Button title="Week" onPress={() => setTimeFrame("week")} />
        <Button title="Month" onPress={() => setTimeFrame("month")} />
      </View>
    </SafeAreaView>
  );
};

export default ProgressTracking;
