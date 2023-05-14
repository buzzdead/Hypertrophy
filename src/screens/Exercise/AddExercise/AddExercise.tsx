import React, {useEffect, useReducer, useRef} from "react";
import {SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import PickerField from "./Picker/PickerField";
import {extend} from "lodash";
import {Exercise} from "../../../../typings/types";
import {saveExercise, addExercise, fetchExerciseTypesByCategory} from "../../../api/realm";
import NumberInput from "../../../components/NumberInput";
import exerciseListReducer, {ExerciseReducerType} from "../../../Reducer";
import {colors} from "../../../utils/util";
import CustomButton from "../../../components/CustomButton";
import AddObject from "./Modal/AddObject";
import Weight from "./Weight";
import LoadingIndicator from "../../../components/LoadingIndicator";
import { useRealm } from "../../../hooks/useRealm";
import { CategorySchema } from "../../../config/realm";

type Props = {
  navigation: any;
  previousExercise?: Exercise | null;
};

const initialState: ExerciseReducerType = {
  weight: 5,
  sets: 1,
  reps: 10,
  date: new Date(),
  category: null,
  exerciseType: null,
  validWeight: true,
  exerciseTypes: []
};

const AddExercise: React.FC<Props> = ({navigation, previousExercise}) => {
  const newState = previousExercise
    ? extend({}, initialState, previousExercise, {
        category: previousExercise.type?.category,
        exerciseType: previousExercise.type,
      })
    : initialState;

  const [state, dispatch] = useReducer(exerciseListReducer, newState);
  const {data: categories, refresh, loading: categoriesLoading} = useRealm<CategorySchema>("Category");
  const categoryRef = useRef(-1)

  const _refresh = async () => {
    await refresh()
    onCategoryChange(state.category?.id || 1)
  }

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

  const onCategoryChange = async (categoryId: number) => {
    if(categories[categoryId - 1] === undefined) {console.log(categories); return}
    const exerciseTypes = await fetchExerciseTypesByCategory(categories[categoryId - 1].id)
    dispatch({type: "setItAll", payload: {exerciseType: exerciseTypes[0], exerciseTypes: exerciseTypes, category: categories[categoryId - 1]}})
    categoryRef.current = categoryId
  }

  const onWeightChange = (value: number | string, validWeight: boolean) => {
    dispatch({type: "setWeight", payload: {value, validWeight}});
  };

  useEffect(() => {
    if(categoriesLoading) return
    if(previousExercise) {
      if(state.category && state.category.id !== previousExercise?.type?.category.id) onCategoryChange(state.category ? state.category.id : 1)
      return
    }
    if (categories.length > 0 && categoryRef.current !== state?.category?.id) onCategoryChange(state.category?.id || 1)
  }, [categoriesLoading, state.category]);

  if(categoriesLoading) return <LoadingIndicator />
  

  console.log("renderinga dd exercise")

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style={{flexDirection: "row", gap: 40}}>
        <View style={{flex: 6}}>
          <PickerField
            item={state.category}
            name={"Category"}
            maxWidth={275}
            items={categories}
            onChange={value => dispatch({type: "setCategory", payload: value})}
          />
        </View>
        <View style={{justifyContent: "flex-end", paddingBottom: 12, paddingRight: 12}}>
          <AddObject isCategory s={refresh} />
        </View>
      </View>
      <View style={{flexDirection: "row", gap: 40, paddingBottom: 55}}>
        <View style={{flex: 6}}>
          <PickerField
            name={"Exercise Type"}
            maxWidth={275}
            picker={220}
            item={state.exerciseType}
            items={state.exerciseTypes}
            onChange={value => dispatch({type: "setExerciseType", payload: value})}
          />
        </View>
        <View style={{justifyContent: "flex-end", paddingBottom: 12, paddingRight: 12}}>
          <AddObject isCategory={false} s={_refresh}/>
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
