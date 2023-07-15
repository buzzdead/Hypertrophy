import React, {useEffect, useReducer, useRef, useState} from "react";
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import PickerField from "./Picker/PickerField";
import {extend} from "lodash";
import {Exercise} from "../../../../typings/types";
import {saveExercise, addExercise, fetchExerciseTypesByCategory, setPlanCompleted} from "../../../api/realm";
import NumberInput from "../../../components/NumberInput";
import exerciseListReducer, {ExerciseReducerType} from "../../../Reducer";
import {colors, getWeekNumber} from "../../../utils/util";
import CustomButton from "../../../components/CustomButton";
import AddObject from "./Modal/AddObject";
import Weight from "./Weight";
import LoadingIndicator from "../../../components/LoadingIndicator";
import {CategorySchema, ExerciseSchema, PlanSchema} from "../../../config/realm";
import {useFocus} from "../../../hooks/useFocus";
import {useRealm, useMutations} from "../../../hooks/hooks";
import {CompletePlanModal} from "./Modal/CompletePlanModal";
import {CheckBox} from "../../../components/Checkbox";
import Toast from 'react-native-toast-message';

type Props = {
  navigation: any;
  previousExercise?: Exercise | null;
  onClose?: () => void;
};

const initialState: ExerciseReducerType = {
  weight: 5,
  sets: 1,
  reps: 10,
  date: new Date(),
  category: null,
  exerciseType: null,
  validWeight: true,
  exerciseTypes: [],
  exceptional: false,
};

const AddExercise: React.FC<Props> = ({navigation, previousExercise, onClose}) => {
  const newState = previousExercise
    ? extend({}, initialState, previousExercise, {
        category: previousExercise.type?.category,
        exerciseType: previousExercise.type,
        exceptional: previousExercise.exceptional,
      })
    : initialState;

  const [state, dispatch] = useReducer(exerciseListReducer, newState);
  const [planState, setPlanState] = useState<{
    showPlanModal: boolean;
    metPlanExpectations: boolean;
    plan: Optional<PlanSchema>;
  }>({showPlanModal: false, metPlanExpectations: false, plan: undefined});
  const {data: categories, refresh, loading: categoriesLoading} = useRealm<CategorySchema>({schemaName: "Category"});
  const {
    data: plans,
    loading: plansLoading,
    mutateItem: mutatePlan,
  } = useRealm({schemaName: "Plan", mutateFunction: (plan: PlanSchema) => setPlanCompleted(plan)});

  const {mutateItem} = useMutations<ExerciseSchema>("Exercise", (exercise: ExerciseSchema) =>
    previousExercise ? saveExercise(exercise) : addExercise(exercise),
  );
  const [loading, setLoading] = useState(false);
  const categoryRef = useRef(-1);
  const isFocused = useFocus();

  const _refresh = async () => {
    await refresh();
    onCategoryChange(state.category?.id || 1);
  };

  const handleAddExercise = async () => {
    const currentDate = new Date();
    const currentUTCDate = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        currentDate.getUTCHours(),
        currentDate.getUTCMinutes(),
        currentDate.getUTCSeconds(),
      ),
    );
    const weekNumber = getWeekNumber(currentUTCDate);
    const month = currentUTCDate.getMonth();
    const exercise: Exercise = {
      id: previousExercise?.id || 0,
      sets: state.sets,
      type: state.exerciseType,
      reps: state.reps,
      weight: Number(state.weight),
      week: previousExercise?.week || weekNumber,
      month: previousExercise?.month || month,
      date: previousExercise?.date || new Date(),
      exceptional: state.exceptional,
      metric: state.sets * state.reps * (state.weight as number)
    };
    if(exercise.type?.id === undefined) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Not a valid Exercise Type, check category \ exercise type.',
        visibilityTime: 4000,
        topOffset: -100,
        autoHide: true,
      });
      return;
    }
    setLoading(true);
    const newExercise = exercise as ExerciseSchema;
    setTimeout(
      async () =>
        await mutateItem.mutateAsync({item: newExercise, action: previousExercise ? "ADD" : "SAVE"}).then(async () => {
          const planFound = plans.find(
            p =>
              !p.completed && p.type.id === newExercise.type.id && p.type.category.id === newExercise.type.category.id,
          );
          if (planFound) {
            const metExpectations = planFound.sets * planFound.reps * planFound.weight;
            const exerciseTotal = newExercise.reps * newExercise.sets * newExercise.weight;
            setPlanState({plan: planFound, showPlanModal: true, metPlanExpectations: metExpectations <= exerciseTotal});
          } else navigation.goBack();
        }),
      10,
    );
  };

  const onCategoryChange = async (categoryId: number) => {
    if (categories[categoryId - 1] === undefined) {
      return;
    }
    const exerciseTypes = await fetchExerciseTypesByCategory(categories[categoryId - 1].id);
    dispatch({
      type: "setItAll",
      payload: {exerciseType: exerciseTypes[0], exerciseTypes: exerciseTypes, category: categories[categoryId - 1]},
    });
    categoryRef.current = categoryId;
  };

  const onWeightChange = (value: number | string, validWeight: boolean) => {
    dispatch({type: "setWeight", payload: {value, validWeight}});
  };

  useEffect(() => {
    if (categoriesLoading) return;
    if (previousExercise) {
      if (state.category && state.category.id !== previousExercise?.type?.category.id)
        onCategoryChange(state.category ? state.category.id : 1);
      return;
    }
    if (categories.length > 0 && categoryRef.current !== state?.category?.id) onCategoryChange(state.category?.id || 1);
  }, [categoriesLoading, state.category]);

  const handleOnComplete = async (complete: boolean) => {
    if (complete && planState.plan) await mutatePlan.mutateAsync({item: planState.plan, action: "SAVE"});
    navigation.goBack();
  };

  if (planState.showPlanModal)
    return (
      <CompletePlanModal
        metExpectations={planState.metPlanExpectations}
        visible={planState.showPlanModal}
        onClose={(complete: boolean) => handleOnComplete(complete)}
      />
    );
  if (categoriesLoading || !isFocused || loading) return <LoadingIndicator />;

  return (
    <SafeAreaView style={styles.container}>
      
      <Toast />
      <ScrollView>
        <View style={{flexDirection: "row", gap: 40}}>
          <View style={{flex: 6}}>
            <PickerField
              item={state.category}
              name={"Category"}
              picker={200}
              left={20}
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
              picker={300}
              left={20}
              item={state.exerciseType}
              items={state.exerciseTypes}
              onChange={value => dispatch({type: "setExerciseType", payload: value})}
            />
          </View>
          <View style={{justifyContent: "flex-end", paddingBottom: 12, paddingRight: 12}}>
            <AddObject isCategory={false} s={_refresh} />
          </View>
        </View>
        <View style={{paddingTop: 20}}>
          <Weight
            title={"Weight"}
            value={state.weight}
            onChange={(value: string | number, validWeight: boolean) => onWeightChange(value, validWeight)}
          />
        </View>
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
        <View style={{flexDirection: "row", justifyContent: "center", paddingVertical: 25, gap: 25}}>
          <Text
            style={{textAlignVertical: "center", fontSize: 26, fontFamily: "Roboto-Bold", color: colors.summerDark}}>
            Exceptional exercise:{" "}
          </Text>
          <CheckBox
            isSelected={state.exceptional}
            size="S"
            color={colors.summerDark}
            onSelection={(b: boolean) => dispatch({type: "setExceptional", payload: b})}
          />
        </View>
        <View style={{paddingTop: 20, alignSelf: "center", flexDirection: "row", gap: 10}}>
          <View style={{width: 180}}>
            <CustomButton
              titleColor={colors.summerWhite}
              size="M"
              backgroundColor={colors.summerDark}
              title="Cancel"
              onPress={() => (onClose ? onClose() : navigation.goBack())}
            />
          </View>
          <View style={{width: 180}}>
            <CustomButton
              titleColor={state.validWeight ? colors.accent : colors.summerWhite}
              size="M"
              backgroundColor={colors.summerDark}
              disabled={!state.validWeight}
              title="Save"
              loading={loading}
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
    paddingVertical: 50,
    alignSelf: "center",
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
