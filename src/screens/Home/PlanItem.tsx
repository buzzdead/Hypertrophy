import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Plan} from "../../../typings/types";
import {addPlan, deletePlan, editPlan} from "../../api/exercise";
import Contingent from "../../components/Contingent";
import CustomButton from "../../components/CustomButton";
import {CategorySchema, ExerciseTypeSchema} from "../../config/realm";
import { colors } from "../../utils/color";
import PlanModal from "./PlanModal";

interface Props extends Partial<Plan> {
  id?: number
  newPlan?: boolean;
  week: number;
  exerciseTypes: ExerciseTypeSchema[];
  categories: CategorySchema[];
  refresh: () => void
}

export const PlanItem: React.FC<Props> = ({reps = 1, sets = 1, weight = 0, type = null, newPlan = false, week, categories, exerciseTypes, id, refresh}) => {
  const [showModal, setShowModal] = useState(false);

  const handleSave = (data: Omit<Plan, 'week' | 'completed'>) => {
    newPlan ? addPlan({...data, week: week, completed: false}) : editPlan({...data, week: week, completed: false});
    refresh()
  };

  const handleDelete = () => {
    if(id !== undefined) deletePlan(id)
    refresh()
  }

  return (
    <Contingent style={{width: showModal ? 300 : 150, height: showModal ? 200 : 100}} shouldRender={showModal}>
      <PlanModal
        data={{reps, sets, weight, type}}
        onSave={(data) => handleSave(data)}
        onRequestClose={() => setShowModal(false)}
        visible={showModal}
        categories={categories}
        exerciseTypes={exerciseTypes}
        
      />
      <TouchableOpacity style={styles.container} onPress={() => setShowModal(true)}>
        <View style={{width: "100%"}}>
          <Contingent shouldRender={!newPlan}>
          <CustomButton title={"X"} size='S' titleColor={'green'} backgroundColor={colors.summerWhite} onPress={handleDelete} />
          </Contingent>
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
