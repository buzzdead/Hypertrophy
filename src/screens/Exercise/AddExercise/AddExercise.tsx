import React, {useEffect, useReducer} from "react";
import {SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
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
import LoadingIndicator from "../../../components/LoadingIndicator";

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
  validWeight: true,
};

const AddExercise: React.FC<Props> = ({navigation, previousExercise}) => {
  const newState = previousExercise
    ? extend({}, initialState, previousExercise, {
        category: previousExercise.type?.category,
        exerciseType: previousExercise.type,
      })
    : initialState;

  const [state, dispatch] = useReducer(exerciseListReducer, newState);
  const {categories, loading: categoriesLoading} = useCategories();
  const {memoizedExerciseTypes: exerciseTypesFromCategory} = useExerciseTypes({category: state.category});

  useEffect(() => {
    if (!previousExercise) dispatch({type: "setCategory", payload: categories[0]});
  }, [categories]);
  useEffect(() => {
    if (previousExercise && previousExercise.type?.category.id === state.category?.id) return;
    dispatch({type: "setExerciseType", payload: exerciseTypesFromCategory[0]});
  }, [exerciseTypesFromCategory]);

  const handleAddExercise = async () => {
    const exercise: Exercise = {
      id: 0,
      sets: state.sets,
      type: state.exerciseType,
      reps: state.reps,
      weight: Number(state.weight),
      date: previousExercise?.date || new Date(),
    };
    if (previousExercise) {
      await saveExercise({...exercise, id: previousExercise.id});
    } else {
      await addExercise(exercise);
    }
    navigation.goBack();
  };

  const onWeightChange = (value: number | string, validWeight: boolean) => {
    dispatch({type: "setWeight", payload: {value, validWeight}});
  };

  if(categoriesLoading) return <LoadingIndicator />
  console.log("rendering add exercise")

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style={{flexDirection: "row", gap: 40}}>
        <View style={{flex: 6}}>
          <PickerField
            item={state.category}
            name={"Category"}
            items={categories}
            onChange={value => dispatch({type: "setCategory", payload: value})}
          />
        </View>
        <View style={{flex: 1, justifyContent: "flex-end", paddingBottom: 11}}>
          <AddObject isCategory />
        </View>
      </View>
      <View style={{flexDirection: "row", gap: 40, paddingBottom: 55}}>
        <View style={{flex: 6}}>
          <PickerField
            name={"Exercise Type"}
            picker={220}
            item={state.exerciseType}
            items={exerciseTypesFromCategory}
            onChange={value => dispatch({type: "setExerciseType", payload: value})}
          />
        </View>
        <View style={{flex: 1, justifyContent: "flex-end", paddingBottom: 11}}>
          <AddObject isCategory={false} />
        </View>
      </View>
      <Weight
        title={"Weight"}
        value={state.weight}
        onChange={(value: string | number, validWeight: boolean) => onWeightChange(value, validWeight)}
      />
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
            size="M"
            backgroundColor={colors.summerDark}
            title="Cancel"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={{width: 180}}>
          <CustomButton
            titleColor={state.validWeight ? colors.accent : colors.summerWhite}
            size="M"
            backgroundColor={colors.summerDark}
            disabled={!state.validWeight}
            title="Save"
            onPress={handleAddExercise}
          />
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    paddingTop: 20,
    alignSelf: 'center'
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
