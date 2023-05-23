import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {UseMutationResult} from "react-query";
import {Plan} from "../../../typings/types";
import { addExercise, fetchPlanById, setPlanCompleted } from "../../api/exercise";
import Contingent from "../../components/Contingent";
import LoadingIndicator from "../../components/LoadingIndicator";
import {CategorySchema, ExerciseSchema, ExerciseTypeSchema, PlanSchema} from "../../config/realm";
import {useFocus, useMutations} from "../../hooks/hooks";
import {Mutations} from "../../hooks/useRealm";
import {colors} from "../../utils/color";
import PlanModal from "./PlanModal";

interface Props extends Partial<Plan> {
  id?: number;
  newPlan?: boolean;
  week: number;
  exerciseTypes: ExerciseTypeSchema[];
  categories: CategorySchema[];
  mutatePlan: UseMutationResult<
    void,
    unknown,
    {
      item: PlanSchema;
      action: Mutations;
    },
    () => PlanSchema[] | null
  >;
}

export const PlanItem: React.FC<Props> = ({
  reps = 1,
  sets = 1,
  weight = 0,
  type = null,
  newPlan = false,
  completed,
  week,
  categories,
  exerciseTypes,
  mutatePlan,
  id,
}) => {
  const [showModal, setShowModal] = useState(false);
  const isFocused = useFocus();
  const {mutateItem: completePlan} = useMutations("Plan", (plan: PlanSchema) => setPlanCompleted(plan))
  const {mutateItem: completeExercise} = useMutations("Exercise", (exercise: ExerciseSchema) => addExercise(exercise))
  const [loading, setLoading] = useState(false)

  const handleSave = (data: Omit<Plan, "week" | "completed">) => {
    setLoading(true)
    const plan = {...data, week: week, completed: false} as PlanSchema;
    setTimeout(() => mutatePlan.mutateAsync({item: plan, action: newPlan ? "ADD" : "SAVE"}).then(() => setLoading(false)), 50);
  };

  const handleDelete = async () => {
    setLoading(true)
    const data = {id: id, week: week, type: type, sets: sets, reps: reps, weight: weight};
    setTimeout(async () => {

      if (id !== undefined) await mutatePlan.mutateAsync({item: {...data} as PlanSchema, action: "DEL"}).then(() => setLoading(false));
    })
  };

  const handleComplete = async () => {
    if(!id) return
    setLoading(true)
    setTimeout(async () => {

    const plan = await fetchPlanById(id)

    const currentDate = new Date()
    
    const month = currentDate.getMonth()
    
    const newExercise = {date: currentDate, month: month, id: 0, week: plan.week, sets: plan.sets, reps: plan.reps, weight: plan.weight, type: plan.type} as ExerciseSchema

    await completePlan.mutateAsync({item: plan, action: "SAVE"})
    await completeExercise.mutateAsync({item: newExercise, action: "ADD"}).then(() => setLoading(false))
  }, 50)
  }

  if (!isFocused.current) return <LoadingIndicator />;

  return (
    <Contingent style={{width: showModal ? 300 : 150, height: showModal ? 200 : 100}} shouldRender={showModal}>
      <PlanModal
        data={{reps, sets, weight, type, id}}
        onSave={data => handleSave(data)}
        onRequestClose={() => setShowModal(false)}
        visible={showModal}
        categories={categories}
        exerciseTypes={exerciseTypes}
      />
      <Contingent shouldRender={!loading} >
      <TouchableOpacity style={{...styles.container, backgroundColor: completed ? colors.accent : colors.summerWhite}} onPress={() => setShowModal(true)}>
        <Contingent shouldRender={!newPlan} style={{position: "absolute", bottom: 5, left: 5, zIndex: 123}}>
        <MaterialCommunityIcons
            adjustsFontSizeToFit
            name={"close-outline"}
            size={22}
            color={"red"}
            onPress={handleDelete}
          />
        </Contingent>
        <Contingent shouldRender={!newPlan && !completed} style={{position: "absolute", bottom: 5, right: 5, zIndex: 123}}>
        <MaterialCommunityIcons
            adjustsFontSizeToFit
            name={"check-outline"}
            size={22}
            color={"green"}
            onPress={handleComplete}
          />
        </Contingent>
        <View style={{width: "100%"}}>
          <Text style={{textAlign: "center", fontSize: newPlan ? 48 : 20, paddingVertical: newPlan ? 15 : 5}}>{newPlan ? "+" : type?.name}</Text>
          <Contingent shouldRender={!newPlan}>
            <View style={{flexDirection: "row", width: "100%", justifyContent: "center"}}>
              <Text>{sets + " x "}</Text>
              <Text>{reps + " x "}</Text>
              <Text>{weight + "kg"}</Text>
            </View>
          </Contingent>
        </View>
      </TouchableOpacity>
      <View style={{width: '100%', height: '100%'}}>
      <LoadingIndicator />
      </View>
      </Contingent>
    </Contingent>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 5,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "grey",
    width: 150,
    height: 100,
  },
});

export default PlanItem;
