import React, {useState} from "react";
import {Modal, StyleSheet, View, TouchableOpacity, Text} from "react-native";
import {Plan} from "../../../typings/types";
import NumberInput from "../../components/NumberInput";
import { CategorySchema, ExerciseTypeSchema } from "../../config/realm";
import PickerField from "../Exercise/AddExercise/Picker/PickerField";
import Weight from "../Exercise/AddExercise/Weight";

interface PlanModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onSave: (data: Omit<Plan, 'week' | 'completed'>) => void;
  data: Omit<Plan, 'week' | 'completed'>;
  exerciseTypes: ExerciseTypeSchema[]
  categories: CategorySchema[]
}

export const PlanModal: React.FC<PlanModalProps> = ({visible, onRequestClose, onSave, data, exerciseTypes, categories}) => {
  const [state, setState] = useState({
    reps: data.reps,
    sets: data.sets,
    id: data.id,
    weight: data.weight,
    category: categories[0],
    exerciseType: data.type,
    exerciseTypes: exerciseTypes,
    categories: categories
  });

  const handleSave = () => {
    const d = {reps: state.reps, sets: state.sets, weight: state.weight, type: state.exerciseType, id: state.id}
    onSave(d);
    onRequestClose()
  };

  return (
    <Modal visible={visible} onRequestClose={onRequestClose} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.content}>
        <PickerField
            item={state.category || state.categories[0]}
            name={"Category"}
            maxWidth={275}
            items={state.categories}
            onChange={value => setState({...state, category: value})}
          />
          <PickerField
            name={"Exercise Type"}
            maxWidth={275}
            picker={220}
            item={state.exerciseType}
            items={state.exerciseTypes.filter(e => e.category.id === state.category.id)}
            onChange={value => setState({...state, exerciseType: value})}
          />
          <View style={{paddingTop: 100}}>
          <Weight title={'Add weight'} value={state.weight} onChange={(value: any) => setState({...state, weight: value})} />
          <NumberInput title={"Sets"} value={data.sets} onChange={(value: any) => setState({...state, sets: value})} />
          <NumberInput title={"Reps"} value={data.reps} onChange={(value: any) => setState({...state, reps: value})} />
          <View style={styles.buttons}>
            <TouchableOpacity onPress={onRequestClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>
        
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    height: '100%'
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
});

export default PlanModal;
