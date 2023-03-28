// screens/ProgressTracking.tsx
import React, { useEffect, useRef } from "react";
import {Button, SafeAreaView, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { useLoadExercises } from "../hooks/useLoadExercises";
import { Exercise } from "../types";

interface GroupedExercises {
  [key: string]: Exercise[];
}

interface AggregatedDataItem {
  key: string;
  exercises: number;
}

const ProgressTracking = () => {
  const [timeFrame, setTimeFrame] = React.useState('day'); // 'week', 'month'
const [selectedDataPoint, setSelectedDataPoint] = React.useState<Nullable<AggregatedDataItem>>(null);

  const exercises = useLoadExercises();

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth * 0.9; // or whatever percentage you want to use


  const handleChartPress = (index: number) => {
    setSelectedDataPoint(aggregatedData[index] || null);
  };

  if (!exercises.length) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No exercises found.</Text>
      </SafeAreaView>
    );
  }

  const startDate = new Date(exercises[0].date)
  const endDate = new Date()
  const dateRange: Date[] = []

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dateRange.push(new Date(d));
  }

  const groupBy = (data: Exercise[], timeFrame: string) => {
    const groups: {[key: string]: Exercise[]} = {};
  
    data.forEach((item) => {
      const date = new Date(item.date);
      let key;
  
      if (timeFrame === 'week') {
        const weekNumber = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
        key = `${date.getFullYear()}-W${weekNumber}`;
      } else if (timeFrame === 'month') {
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      } else {
        key = item.date.toISOString().split("T")[0];
      }
  
      if (!groups[key]) {
        groups[key] = [];
      }
  
      groups[key].push(item);
    });
  
    return groups;
  };
  
  const aggregateData = (data: Exercise[], timeFrame: string): AggregatedDataItem[] => {
    const groups = groupBy(data, timeFrame);
    const aggregatedData: AggregatedDataItem[] = [];
  
    for (const key in groups) {
      const exercises = groups[key].length;
      aggregatedData.push({
        key,
        exercises,
      });
    }

    return aggregatedData;
  };
  const aggregatedData = aggregateData(exercises, timeFrame);
  const chartData = aggregatedData.map((item) => item.exercises);
  const chartLabels = aggregatedData.map((item) => item.key);
  console.log(chartLabels)

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ flexDirection: "row", padding: 20, flex: 1 }}>
        <YAxis
          data={chartData}
          contentInset={{ top: 20, bottom: 20 }}
          svg={{
            fill: "grey",
            fontSize: 10,
          }}
          numberOfTicks={10}
          formatLabel={(value) => `${value}`}
        />
        <TouchableOpacity style={{width: "90%", height: "100%"}} onPress={(event: { nativeEvent: { locationX: any; }; }) => {
            const { locationX } = event.nativeEvent;
            const width = chartWidth; // or whatever your width is
            const index = Math.round((locationX / width) * chartData.length);
            if (index >= 0 && index < chartData.length) {
              handleChartPress(index);
            }
          }}>
        <LineChart
          style={{ flex: 1, marginLeft: 16 }}
          data={chartData}
          svg={{ stroke: "rgb(134, 65, 244)" }}
          contentInset={{ top: 20, bottom: 20 }}
          curve={shape.curveBasis}
        >
          <Grid />
        </LineChart>
        </TouchableOpacity>
        
      </View>
        <View style={{right: 200, top: 20, position: 'absolute'}}><Text>Number of exercises:{selectedDataPoint ? selectedDataPoint.exercises : ''}</Text></View>
        <XAxis
          style={{ marginHorizontal: -10, marginTop: 10, width: '100%' }}
          data={chartLabels}
          xAccessor={({ index }) => index}
          formatLabel={(index) => chartLabels[index]}
          contentInset={{ left: 100, right: 100 }}
          svg={{ fontSize: 10, fill: "grey" }}
          
        />
      <View style={{flexDirection: 'row', gap: 10}}>
        <Button title="Day" onPress={() => setTimeFrame('day')} />
        <Button title="Week" onPress={() => setTimeFrame('week')} />
        <Button title="Month" onPress={() => setTimeFrame('month')} />
      </View>
    </SafeAreaView>
  );
        }  

export default ProgressTracking;
