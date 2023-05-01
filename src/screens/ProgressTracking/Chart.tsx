import React from "react"
import { VictoryChart, VictoryAxis, VictoryGroup, VictoryBar } from "victory-native"
import { colors } from "../../utils/util"

interface Props {
    chartData: number[]
    days: number[]
    maxExercises: number
}

export const Chart: React.FC<Props> = ({chartData, days, maxExercises}) => {
    return (
        <VictoryChart>
        <VictoryAxis
          style={{axisLabel: {padding: 30, fontSize: 16}}}
          tickCount={chartData.length || 1}
          tickFormat={id => (days ? days[id] : id)}
          label={"Days in month"}
        />
        <VictoryAxis dependentAxis label={"Exercises"} tickCount={maxExercises || 1} tickFormat={(i) => Math.round(i)}/>
        <VictoryGroup offset={20}>
          <VictoryBar 
            data={chartData}
            barWidth={15}
            style={{
              data: {
                fill: colors.primary,
              },
            }}
          />
        </VictoryGroup>
      </VictoryChart>
    )
}