import React from "react";
import {VictoryChart, VictoryAxis, VictoryGroup, VictoryBar, VictoryTheme} from "victory-native";
import {colors} from "../../utils/util";

interface Props {
  chartData: number[]
  days: number[] | string[];
  maxExercises: number;
  mode: "Daily" | "Weekly" | "Categories";
  isLandScape: boolean;
}

export const Chart: React.FC<Props> = ({chartData, days, maxExercises, mode, isLandScape}) => {
  return (
    <VictoryChart height={isLandScape ? 300 : 375} width={isLandScape ? 500 : 400} theme={VictoryTheme.material}>
      <VictoryAxis
        style={{axisLabel: {padding: 30, fontSize: 16}}}
        tickCount={chartData.length || 1}
        tickFormat={id => (days ? days[id] : id)}
        label={mode === "Daily" ? "Days in month" : mode === "Weekly" ? "Weeks" : "Categories"}
      />
      <VictoryAxis
        style={{axisLabel: {padding: 30, fontSize: 16}}}
        dependentAxis
        label={"Exercises"}
        tickCount={maxExercises > 14 ? Math.ceil(maxExercises / 2) : maxExercises || 1}
        tickFormat={i => Math.round(i)}
      />
      <VictoryGroup offset={20}>
        <VictoryBar
          data={chartData}
          barWidth={10}
          cornerRadius={5}
          style={{
            data: {
              fill: colors.graphColor,
              fillOpacity: 0.85,
            },
          }}
        />
      </VictoryGroup>
    </VictoryChart>
  );
};
