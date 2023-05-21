import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {UseMutationResult} from "react-query";
import {Plan} from "../../../typings/types";
import Contingent from "../../components/Contingent";
import CustomButton from "../../components/CustomButton";
import LoadingIndicator from "../../components/LoadingIndicator";
import {CategorySchema, ExerciseTypeSchema, PlanSchema} from "../../config/realm";
import {useFocus} from "../../hooks/useFocus";
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
  week,
  categories,
  exerciseTypes,
  mutatePlan,
  id,
}) => {
  const [showModal, setShowModal] = useState(false);
  const isFocused = useFocus();

  const handleSave = (data: Omit<Plan, "week" | "completed">) => {
    const plan = {...data, week: week, completed: false} as PlanSchema;
    mutatePlan.mutateAsync({item: plan, action: newPlan ? "ADD" : "SAVE"});
  };

  const handleDelete = () => {
    const data = {id: id, week: week, type: type, sets: sets, reps: reps, weight: weight};
    if (id !== undefined) mutatePlan.mutateAsync({item: {...data} as PlanSchema, action: "DEL"});
  };

  if (!isFocused.current) return <LoadingIndicator />;

  return (
    <Contingent style={{width: showModal ? 300 : 150, height: showModal ? 200 : 100}} shouldRender={showModal}>
      <PlanModal
        data={{reps, sets, weight, type}}
        onSave={data => handleSave(data)}
        onRequestClose={() => setShowModal(false)}
        visible={showModal}
        categories={categories}
        exerciseTypes={exerciseTypes}
      />
      <TouchableOpacity style={styles.container} onPress={() => setShowModal(true)}>
        <Contingent shouldRender={!newPlan} style={{position: "absolute", top: -12.5, right: -12.5}}>
          <CustomButton
            title={"x"}
            size="S"
            fontSize={26}
            titleColor={colors.summerBlue}
            backgroundColor={""}
            onPress={handleDelete}
          />
        </Contingent>
        <View style={{width: "100%"}}>
          <Text style={{textAlign: "center", fontSize: newPlan ? 48 : 24}}>{newPlan ? "+" : type?.name}</Text>
          <Contingent shouldRender={!newPlan}>
            <View style={{flexDirection: "row", width: "100%", justifyContent: "center"}}>
              <Text>{sets + " x "}</Text>
              <Text>{reps + " x "}</Text>
              <Text>{weight + "kg"}</Text>
            </View>
          </Contingent>
        </View>
      </TouchableOpacity>
    </Contingent>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "grey",
    width: 150,
    height: 100,
  },
});

export default PlanItem;
