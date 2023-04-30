// screens/ProgressTracking.tsx
import React, {useState} from "react";
import {SafeAreaView} from "react-native";
import {useCategories} from "../../hooks/useCategories";
import {SideBar} from "../../components/SideBar";
import {CategorySchema} from "../../config/realmConfig";
import {useScreenOrientation} from "../../hooks/useScreenOrientation";
import {VictoryBar, VictoryChart, VictoryAxis, VictoryGroup} from "victory-native";
import {ProgressTrackingBtm} from "./ProgressTrackingBtm";
import {colors} from "../../utils/util";
import {ChartNavigation} from "./ChartNavigation";
import LoadingIndicator from "../../components/LoadingIndicator";

export interface Chart {
  chartData: number[];
  maxExercises: number;
  days: number[];
  mode: "Daily" | "Weekly";
}

const ProgressTracking = () => {
  const {categories, loading: categoriesLoading} = useCategories();
  const screenOrientation = useScreenOrientation();
  const [mode, setMode] = useState<"Weekly" | "Daily">("Daily");
  const [filteredCategories, setFilteredCategories] = React.useState<CategorySchema[]>([]);

  const [state, setState] = useState<Chart>({
    chartData: [],
    maxExercises: 0,
    days: [],
    mode: "Daily",
  });

  

  const updateChart = (chart: Chart) => {
   setState({...chart})
  };

  const handleFilterChange = (selectedCategories: CategorySchema[]) => {
    if (selectedCategories.length === 0) {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(categories.filter(category => selectedCategories.some(c => c.id === category.id)));
    }
  };

  if (categoriesLoading) return <LoadingIndicator />;
  console.log("rendering progress")

  return (
    <SafeAreaView style={{width: "100%", height: "100%", justifyContent: "center", gap: 60}}>
      <VictoryChart>
        <VictoryAxis
          style={{axisLabel: {padding: 30, fontSize: 16}}}
          tickCount={state?.chartData.length || 1}
          tickFormat={id => (state?.days ? state.days[id] : id)}
          label={"Days in month"}
        />
        <VictoryAxis dependentAxis label={"Exercises"} tickCount={Math.ceil(state?.maxExercises / 2) || 1} />
        <VictoryGroup offset={20}>
          <VictoryBar
            data={state?.chartData}
            barWidth={15}
            style={{
              data: {
                fill: colors.primary,
              },
            }}
          />
        </VictoryGroup>
      </VictoryChart>
      <ChartNavigation
      updateChart={updateChart}
      categories={filteredCategories.length > 0 ? filteredCategories : categories}
      />
      <ProgressTrackingBtm mode={mode} landScapeOrientation={screenOrientation.isLandscape} changeMode={setMode} />
      <SideBar categories={categories} onFilterChange={handleFilterChange} icon={"chart-bar"} />
    </SafeAreaView>
  );
};

export default ProgressTracking;
