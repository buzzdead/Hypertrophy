import React, {useReducer, useState} from "react";
import {SafeAreaView, StyleSheet, View} from "react-native";
import PickerField from "./Picker/PickerField";
import {extend} from "lodash";
import {Exercise} from "../../../../typings/types";
import {saveExercise, addExercise} from "../../../api/realmAPI";
import NumberInput from "../../../components/NumberInput";
import {useCategories} from "../../../hooks/useCategories";
import {useExerciseTypes} from "../../../hooks/useExerciseTypes";
import exerciseListReducer, {ExerciseReducerType} from "../../../Reducer";
import {colors} from "../../../utils/util";
import CustomButton from "../../../components/CustomButton";
import AddObject from "./Modal/AddObject";
import Weight from "./Weight";

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

const AddExercise: React.FC<Props> = ({navigation, previousExercise}) => {
  const newState = previousExercise
    ? extend({}, initialState, previousExercise, {
        category: previousExercise.type?.category,
        exerciseType: previousExercise.type,
      })
    : initialState;
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: "row", gap: 40}}>
        <View style={{flex: 6}}>
          <PickerField
            item={state.category}
            items={categories}
            onChange={value => dispatch({type: "setCategory", payload: value})}
          />
        </View>
        <View style={{flex: 1, justifyContent: "flex-end", paddingBottom: 15}}>
          <AddObject isCategory />
        </View>
      </View>
      <View style={{flexDirection: "row", gap: 40}}>
        <View style={{flex: 6}}>
          <PickerField
            picker={220}
            item={state.exerciseType}
            items={exerciseTypesFromCategory}
            onChange={value => dispatch({type: "setExerciseType", payload: value})}
          />
        </View>
        <View style={{flex: 1, justifyContent: "flex-end", paddingBottom: 16}}>
          <AddObject isCategory={false} />
        </View>
      </View>
      <Weight title={"Weight"} value={state.weight} onChange={value => dispatch({type: "setWeight", payload: value})} />
      <View style={{flexDirection: "row", gap: 20, alignSelf: "center"}}>
        <NumberInput
          title={"Sets"}
          value={state.sets}
          onChange={(value: any) => dispatch({type: "setSets", payload: value})}
        />
        <NumberInput
          title={"Reps"}
          value={state.reps}
          onChange={(value: any) => dispatch({type: "setReps", payload: value})}
        />
      </View>
      <View style={{paddingTop: 20, alignSelf: "center", flexDirection: "row", gap: 10}}>
        <View style={{width: 180}}>
          <CustomButton
            titleColor={colors.summerWhite}
            backgroundColor={colors.summerDark}
            disabled={!isWeightValid}
            title="Cancel"
            onPress={handleAddExercise}
          />
        </View>
        <View style={{width: 180}}>
          <CustomButton
            titleColor={colors.accent}
            backgroundColor={colors.summerDark}
            disabled={!isWeightValid}
            title="Save"
            onPress={handleAddExercise}
          />
        </View>
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
});

export default AddExercise;
