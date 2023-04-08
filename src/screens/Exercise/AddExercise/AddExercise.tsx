import React, {useReducer, useState} from "react";
import {Button, SafeAreaView, StyleSheet, Text, TextInput, View} from "react-native";
import PickerField from "./Picker/PickerField";
import { extend } from "lodash";
import { Exercise } from "../../../../typings/types";
import { saveExercise, addExercise } from "../../../api/realmAPI";
import NumberInput from "../../../components/NumberInput";
import { useCategories } from "../../../hooks/useCategories";
import { useExerciseTypes } from "../../../hooks/useExerciseTypes";
import exerciseListReducer, { ExerciseReducerType } from "../../../Reducer";
import { colors } from "../../../utils/util";
import CustomButton from "../../../components/CustomButton";

type Props = {
  navigation: any;
  previousExercise?: Exercise | null;
};

const initialState: ExerciseReducerType = {
  weight: 0,
  sets: 1,
  reps: 10,
  date: new Date(),
  category: null,
  exerciseType: null,
};

const renderNumberInput = (title: string, value: number, onChange: { (value: number): void; }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.touchFieldLabel}>{title}</Text>
      <NumberInput value={value} onChange={onChange} />
    </View>
  );
};

const AddExercise: React.FC<Props> = ({navigation, previousExercise}) => {
  const newState = previousExercise ? extend({}, initialState, previousExercise, {category: previousExercise.type?.category, exerciseType: previousExercise.type}) : initialState
  const [state, dispatch] = useReducer(exerciseListReducer, newState);
  const [isWeightValid, setIsWeightValid] = useState(true);
  const categories = useCategories();
  const exerciseTypesFromCategory = useExerciseTypes({category: state.category});

  const handleAddExercise = async () => {
    const exercise: Exercise = {
      id: 0,
      sets: state.sets,
      type: state.exerciseType,
      reps: state.reps,
      weight: Number(state.weight),
      date: new Date(),
    };
    if (previousExercise) {
      await saveExercise({...exercise, id: previousExercise.id});
    } else {
      await addExercise(exercise);
    }
    navigation.goBack();
  };

  const renderWeightInput = (title: string, value: number | string, onChange: (value: number | string) => void) => {
    const handleWeightChange = (text: string) => {
      const weight = Number(text);
      const isWeightNaN = isNaN(weight);
      setIsWeightValid(!isWeightNaN);
      onChange(text);
    };
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.touchFieldLabel}>{title}</Text>
        <View style={[styles.weightInputContainer, !isWeightValid && styles.invalidWeightInputContainer]}>
          <TextInput
            style={[styles.input, !isWeightValid && styles.invalidInput]}
            value={String(value)}
            onChangeText={handleWeightChange}
          />
          <Text style={{textAlign: "center", alignSelf: "center", fontSize: 24}}>Kg</Text>
        </View>
        {!isWeightValid && <Text style={styles.errorText}>Weight must be a number</Text>}
      </View>
    );
  };

  console.log("rendering")
  return (
    <SafeAreaView style={styles.container}>
      <PickerField
        item={state.category}
        items={categories}
        onChange={value => dispatch({type: "setCategory", payload: value})}
      />
      <PickerField
        picker={220}
        item={state.exerciseType}
        items={exerciseTypesFromCategory}
        onChange={value => dispatch({type: "setExerciseType", payload: value})}
      />
      {renderWeightInput("Weight", state.weight, value => dispatch({type: "setWeight", payload: value}))}
      <View style={{flexDirection: "row", gap: 20, alignSelf: "center"}}>
        {renderNumberInput("Sets", state.sets, (value: any) => dispatch({type: "setSets", payload: value}))}
        {renderNumberInput("Reps", state.reps, (value: any) => dispatch({type: "setReps", payload: value}))}
      </View>
      <View style={{paddingTop: 30}}>
        <CustomButton titleColor={colors.summerDarkest} backgroundColor={colors.accent} disabled={!isWeightValid} title="Save" onPress={handleAddExercise} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  inputContainer: {
    marginBottom: 16,
    flexDirection: "column",
    alignItems: "center",
    marginRight: 10,
  },
  touchFieldLabel: {
    color: colors.new,
    fontSize: 22,
    fontWeight: "800",
    padding: 6,
    paddingRight: 10,
  },
  input: {
    borderColor: "#BDBDBD",
    borderWidth: 1,
    borderRadius: 4,
    minWidth: 75,
    marginLeft: 27.5,
    textAlign: "center",
    fontFamily: "Roboto-Black",
    padding: 8,
    fontSize: 24,
  },
  weightInputContainer: {
    flexDirection: "row",
    gap: 5,
  },
  invalidWeightInputContainer: {
    borderColor: "red",
  },
  invalidInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default AddExercise;
