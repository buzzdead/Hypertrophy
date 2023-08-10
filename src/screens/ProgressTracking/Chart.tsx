import React from 'react';
import { VictoryChart, VictoryAxis, VictoryGroup, VictoryBar, VictoryTheme, VictoryLine } from 'victory-native';
import { colors } from '../../utils/util';
import Contingent from '../../components/Contingent';
import { View } from 'react-native';

interface Props {
  chartData: number[] | null; // chartData can be null when loading
  days: number[] | string[];
  maxExercises: number;
  mode: 'Daily' | 'Weekly' | 'Categories';
  isLandScape: boolean;
  isLoading?: boolean;
  toggle?: boolean;
  chartType?: 'Line' | 'Bar';
  isMetric?: boolean
}

export const Chart: React.FC<Props> = ({
  chartData,
  days,
  maxExercises,
  mode,
  isLandScape,
  isLoading = false,
  toggle = false,
  isMetric = false,
  chartType = 'Bar',
}) => {
  // Dummy data for the skeleton
  const randomNum = () => Math.floor(Math.random() * 8);
  const skeletonData = Array.from({ length: 10 }, (_, i) => (i === 0 ? 0 : randomNum()));

  // If chartData is null, we're loading, so use the skeleton data
  const data = isLoading ? skeletonData : chartData || skeletonData;

  return (
    <>
      <VictoryChart height={isLandScape ? 225 : 375} width={isLandScape ? 500 : 400} theme={VictoryTheme.material}>
        <VictoryAxis
          style={{ axisLabel: { padding: 30, fontSize: 16 } }}
          tickCount={isLoading ? 8 : data.length || 1}
          tickFormat={(id) => (isLoading ? '' : days ? days[id] : id)}
          label={mode === 'Daily' ? 'Days in month' : mode === 'Weekly' ? 'Weeks' : 'Categories'}
        />
        <VictoryAxis
          style={{ axisLabel: { padding: 30, fontSize: 16 } }}
          dependentAxis
          label={isMetric ? '' : 'Exercises'}
          tickCount={isLoading ? 7 : maxExercises > 14 ? Math.ceil(maxExercises / (isLandScape ? 4 : 2)) : isLandScape ? Math.ceil(maxExercises / 2) : maxExercises === 1 ? 2 : maxExercises || 1}
          tickFormat={(i) => (isLoading ? '' : Math.round(i))}
          tickValues={maxExercises === 1 ? [0, 1] : undefined}
        />
        <VictoryGroup offset={20}>
          {chartType === 'Line' ? (
            <VictoryLine
              data={data.map((value, index) => ({ x: index, y: value }))}
              style={{
                data: {
                  stroke: isLoading ? 'grey' : colors.graphColor,
                  strokeWidth: 2,
                },
              }}
            />
          ) : (
            <VictoryBar
              data={data}
              barWidth={mode === 'Categories' ? 17.5 : 10}
              cornerRadius={mode === 'Categories' ? 10 : 5}
              style={{
                data: {
                  fill: isLoading ? 'grey' : colors.graphColor,
                  stroke: 'none', // add this line
                  
                },
              }}
            />
          )}
        </VictoryGroup>
      </VictoryChart>
    </>
  );
};
