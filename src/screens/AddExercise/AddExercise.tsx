import React, { useEffect, useReducer } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { addExercise, fetchUniqueCategories, fetchUniqueExerciseTypes } from "../../api/realmAPI";
import { Exercise } from "../../types";
import NumberInput from "../../components/NumberInput";
import PickerInput from "./PickerInput";
import Picker from "./Picker";
import exerciseListReducer from "./Reducer";
import { colors } from "../../utils/util";

type Props = {
  navigation: any;
};

const initialState = {
  name: "",
  names: [],
  sets: 1,
  reps: 1,
  category: "",
  categories: [],
  pickerVisible: false,
  namePickerVisible: false
};

const AddExercise: React.FC<Props> = ({ navigation }) => {
  const [state, dispatch] = useReducer(exerciseListReducer, initialState);

  const handleAddExercise = async () => {
    const exercise: Exercise = {
      id: 0,
      name: state.name,
      names: state.names,
      sets: state.sets,
      reps: state.reps,
      date: new Date(),
      category: state.category,
      categories: state.categories
    };
    await addExercise(exercise);
    navigation.goBack();
  };

  const loadCategories = async () => {
    const uniqueCategories = await fetchUniqueCategories();
    dispatch({ type: "setCategories", payload: uniqueCategories });
  };

  const loadNames = async (cat: string) => {
    const uniqueExerciseTypes = await fetchUniqueExerciseTypes(cat);
    dispatch({ type: "setNames", payload: uniqueExerciseTypes });
  };
  

  const togglePicker = () => {
    dispatch({ type: "togglePicker" });
  };
  const toggleNamePicker = () => {
    dispatch({ type: "toggleNamePicker" })
  }

  const renderNumberInput = (title: string, value: number, onChange: (value: number) => void) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.touchFieldLabel}>{title}</Text>
        <NumberInput value={value} onChange={onChange} />
      </View>
    )
  }

  useEffect(() => {
    loadCategories();
  }, []);
  useEffect(() => {
    if(state.category === "") return
    loadNames(state.category);
  }, [state.category])
  useEffect(() => {
    if(state.names.length > 0)
      dispatch({type: "setName", payload: state.names[0]})
  }, [state.names])

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginBottom: 16 }}>
        <Text style={styles.textFieldLabel}>Category:</Text>
        <PickerInput value={state.category} onChangeText={(value) => dispatch({ type: "setCategory", payload: value })} onPickerToggle={togglePicker} placeholder="Category" />
      </View>
      <View style={{ marginBottom: 16 }}>
        <Text style={styles.textFieldLabel}>Type:</Text>
        <PickerInput value={state.name} onChangeText={(value) => dispatch({ type: "setName", payload: value })} onPickerToggle={toggleNamePicker} placeholder="Name" />
      </View>
      <View style={{ flexDirection: "row", gap: 20, alignSelf: "center" }}>
        {renderNumberInput("Sets", state.sets, (value) => dispatch({ type: "setSets", payload: value }))}
        {renderNumberInput("Reps", state.reps, (value) => dispatch({ type: "setReps", payload: value }))}
      </View>
      <View style={{paddingTop: 30}}>
      <Button title="Add" onPress={handleAddExercise} />
      </View>
      <Picker visible={state.pickerVisible} items={state.categories} onSelect={(value) => dispatch({ type: "setCategory", payload: value })} onClose={togglePicker} />
      <Picker picker visible={state.namePickerVisible} items={state.names} onSelect={(value) => dispatch({ type: "setName", payload: value })} onClose={toggleNamePicker} />
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
  textFieldLabel: {
    fontWeight: "bold",
    marginBottom: 4,
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
    padding: 8,
  },
});

export default AddExercise;
