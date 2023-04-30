import React, {useEffect, useState} from "react";
import {Text, View} from "react-native";
import { fetchExercises, fetchMonths } from "../../api/realmAPI";
import CustomButton from "../../components/CustomButton";
import LoadingIndicator from "../../components/LoadingIndicator";
import {CategorySchema, ExerciseSchema, MonthSchema} from "../../config/realmConfig";
import {useExercises} from "../../hooks/useExercises";
import {colors, getAvailableMonths, Month} from "../../utils/util";
import {ChartData} from "./ChartData";
import {Chart} from "./ProgressTracking";

interface Props {
  updateChart: (chart: Chart) => void;
  categories: CategorySchema[];
}

interface State {
  currentMonth: number;
  lastHalf: boolean;
  availableMonths: Month[];
  exercises: ExerciseSchema[]
  months: MonthSchema[]
}

export const ChartNavigation: React.FC<Props> = ({updateChart, categories}) => {
  const [state, setState] = useState<State>({currentMonth: 0, lastHalf: false, availableMonths: [], exercises: [], months: []});


  const handleNext = async () => {
    if (!state.lastHalf) setState({...state, lastHalf: true});
    else if (state.lastHalf && containsMonth(state.currentMonth + 1)) {
      const newCurrentMonth = state.currentMonth + 1;
      const newExercises = await fetchExercises({by: "Month", when: state.availableMonths[newCurrentMonth].numerical})
      setState({...state, currentMonth: newCurrentMonth, lastHalf: false, exercises: newExercises});
    }
  };

  const loadMonths = async () => {
    const months2 = await fetchMonths()
    try {
      if(months2.length === 0) return
      const availableMonths = getAvailableMonths(months2);
      const newExercises = await fetchExercises({by: "Month", when: availableMonths[0]?.numerical})
      setState({...state, months: months2, availableMonths: availableMonths, exercises: newExercises.length > 0 ? newExercises : []});
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadMonths()
  }, [])

  const containsMonth = (month: number) => {
    return state.months.find(e => e.month === state.availableMonths[month]?.numerical)
  }

  const handlePrev = async () => {
    if (state.lastHalf) setState({...state, lastHalf: false});
    else if (!state.lastHalf && containsMonth(state.currentMonth - 1)) {
      const newCurrentMonth = state.currentMonth - 1;
      const newExercises = await fetchExercises({by: "Month", when: state.availableMonths[newCurrentMonth].numerical})
      setState({...state, currentMonth: newCurrentMonth, lastHalf: true, exercises: newExercises});
    }
  };

  useEffect(() => {
    if (state.availableMonths.length === 0) return;
    const {chartData, maxExercises, days} = ChartData({
      exercises: state.exercises,
      categories: categories,
      month: state.availableMonths[state.currentMonth]?.numerical,
      year: "2023",
      lastHalf: state.lastHalf,
      mode: "Daily",
    });
    updateChart({chartData: chartData, maxExercises: maxExercises, days: days, mode: "Daily"});
  }, [state.lastHalf, state.currentMonth, categories]);

  console.log("rendering navigation");

  return (
    <View style={{flexDirection: "row", justifyContent: "center", gap: 10}}>
      <CustomButton
        size="S"
        titleColor={state.currentMonth === 0 && !state.lastHalf ? colors.summerDark : colors.summerBlue}
        fontSize={30}
        backgroundColor={colors.test6}
        onPress={handlePrev}
        title={"<"}
      />
      <Text
        style={{
          textAlignVertical: "center",
          minWidth: 100,
          textAlign: "center",
          fontFamily: "Roboto-Medium",
          fontSize: 20,
        }}>
        {state.availableMonths[state.currentMonth]?.name}
      </Text>
      <CustomButton
        titleColor={
          state.currentMonth === state.availableMonths.length - 1 && state.lastHalf
            ? colors.summerDark
            : colors.summerBlue
        }
        onPress={handleNext}
        backgroundColor={colors.test6}
        size="S"
        fontSize={30}
        title={">"}
      />
    </View>
  );
};
