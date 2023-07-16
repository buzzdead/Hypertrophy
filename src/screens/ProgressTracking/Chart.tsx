import React, { useState } from 'react';
import { VictoryChart, VictoryAxis, VictoryGroup, VictoryBar, VictoryTheme, VictoryLine } from 'victory-native';
import { colors } from '../../utils/util';
import Contingent from '../../components/Contingent';
import CustomButton from '../../components/CustomButton';
import { View } from 'react-native';

interface Props {
  chartData: number[] | null; // chartData can be null when loading
  days: number[] | string[];
  maxExercises: number;
  mode: 'Daily' | 'Weekly' | 'Categories';
  isLandScape: boolean;
  isLoading?: boolean;
  toggle?: boolean
}

export const Chart: React.FC<Props> = ({ chartData, days, maxExercises, mode, isLandScape, isLoading = false, toggle = false }) => {
  // Dummy data for the skeleton
  const skeletonData = [0, 0, 2, 4, 6, 7, 6, 5, 0, 0];
  const [chartType, setChartType] = useState<'Bar' | 'Line'>('Bar');

  // If chartData is null, we're loading, so use the skeleton data
  const data = isLoading ? skeletonData : chartData || skeletonData;
  
  const toggleChartType = () => {
    setChartType((prevChartType) => (prevChartType === 'Bar' ? 'Line' : 'Bar'));
  };
  return (
    <>
    <Contingent style={{width: '100%', zIndex: 18723812738127381723}} shouldRender={toggle}>
      <View style={{alignSelf: 'flex-start', top: -25, position: 'absolute'}}>
      <CustomButton
        backgroundColor={colors.summerWhite}
        titleColor={colors.summerBlue}
        title={`${chartType === 'Bar' ? 'Line' : 'Bar'}`}
        onPress={toggleChartType}
      />
      </View>
      </Contingent>
      <VictoryChart height={isLandScape ? 275 : 375} width={isLandScape ? 500 : 400} theme={VictoryTheme.material}>
        <VictoryAxis
          style={{ axisLabel: { padding: 30, fontSize: 16 } }}
          tickCount={isLoading ? 8 : data.length || 1}
          tickFormat={(id) => (isLoading ? '' : days ? days[id] : id)}
          label={mode === 'Daily' ? 'Days in month' : mode === 'Weekly' ? 'Weeks' : 'Categories'}
        />
        <VictoryAxis
          style={{ axisLabel: { padding: 30, fontSize: 16 } }}
          dependentAxis
          label={'Exercises'}
          tickCount={isLoading ? 7 : maxExercises > 14 ? Math.ceil(maxExercises / 2) : maxExercises || 1}
          tickFormat={(i) => (isLoading ? '' : Math.round(i))}
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
