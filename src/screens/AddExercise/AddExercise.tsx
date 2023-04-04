import React, { useEffect, useReducer, useState } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { addExercise, fetchUniqueExerciseTypes, saveExercise } from "../../api/realmAPI";
import { Exercise } from "../../types";
import NumberInput from "../../components/NumberInput";
import exerciseListReducer, { ExerciseReducerState } from "../../Reducer";
import { colors, getPreviousStateMergedWithInitialState } from "../../utils/util";
import LoadingIndicator from "../../components/LoadingIndicator";
import PickerWithLocalState from "./PickerWithLocalState";
import { useCategories } from "../../hooks/useCategories";

type Props = {
  navigation: any;
  previousExercise?: Exercise | null
};

const initialState: ExerciseReducerState = {
  name: "",
  names: [],
  weight: 0,
  sets: 1,
  reps: 10,
  category: "",
};

const AddExercise: React.FC<Props> = ({ navigation, previousExercise }) => {
  const currentState = previousExercise ? getPreviousStateMergedWithInitialState(initialState, previousExercise) : initialState
  const [state, dispatch] = useReducer(exerciseListReducer, currentState);
  const [isWeightValid, setIsWeightValid] = useState(true);
  const [loading, setLoading] = useState(false)
  const categories = useCategories()


  const handleAddExercise = async () => {
    const exercise: Exercise = {
      id: 0,
      name: state.name,
      names: state.names,
      sets: state.sets,
      reps: state.reps,
      weight: Number(state.weight),
      date: new Date(),
      category: state.category,
    };
    if (previousExercise) {
      await saveExercise({...exercise, id: previousExercise.id});
    } else {
      await addExercise(exercise);
    }
    navigation.goBack();
  };

  const loadNames = async (cat: string) => {
    !loading && setLoading(true)
    await fetchUniqueExerciseTypes(cat).then((res) => {
      if(!previousExercise && res.length > 0) dispatch({type: "setName", payload: res[0]})
      dispatch({ type: "setNames", payload: res });
    });
    setTimeout(() => setLoading(false), 200)
  };

  const renderNumberInput = (title: string, value: number, onChange: (value: number) => void) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.touchFieldLabel}>{title}</Text>
        <NumberInput value={value} onChange={onChange} />
      </View>
    )
  }

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
          <Text style={{ textAlign: "center", alignSelf: "center", fontSize: 24 }}>Kg</Text>
        </View>
        {!isWeightValid && <Text style={styles.errorText}>Weight must be a number</Text>}
      </View>
    );
  };
  

  useEffect(() => {
    if(state.category === "") return
    loadNames(state.category);
  }, [state.category])

  if(loading) return <LoadingIndicator />
  console.log("How is it looking")
  return (
    <SafeAreaView style={styles.container}>
      <PickerWithLocalState setLoading={() => setLoading(true)} item={state.category} items={categories} onChange={(value) => dispatch({type: "setCategory", payload: value})}/>
      <PickerWithLocalState item={state.name} items={state.names} onChange={(value) => dispatch({type: "setName", payload: value})}/>
      {renderWeightInput("Weight", state.weight, (value) => dispatch({ type: "setWeight", payload: value }))}
      <View style={{ flexDirection: "row", gap: 20, alignSelf: "center" }}>
        {renderNumberInput("Sets", state.sets, (value) => dispatch({ type: "setSets", payload: value }))}
        {renderNumberInput("Reps", state.reps, (value) => dispatch({ type: "setReps", payload: value }))}
      </View>
      <View style={{paddingTop: 30}}>
      <Button disabled={!isWeightValid} title="Save" onPress={handleAddExercise} />
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

const propsAreEqual = (prevProps: Props, nextProps: Props) => {
  return (
    prevProps.previousExercise === nextProps.previousExercise &&
    prevProps.navigation === nextProps.navigation
  );
};

export default React.memo(AddExercise, propsAreEqual);
