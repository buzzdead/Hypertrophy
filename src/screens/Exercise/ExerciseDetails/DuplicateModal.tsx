import React from "react";
import {Modal, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";
import {Exercise} from "../../../../typings/types";
import CustomButton from "../../../components/CustomButton";
import { ExerciseSchema } from "../../../config/realm";
import {colors} from "../../../utils/util";

interface Props {
  visible: boolean;
  onClose: () => void;
  onPress: (exercise: ExerciseSchema) => void;
  duplicateExercises: ExerciseSchema[];
}

const DuplicateModal: React.FC<Props> = ({visible, onClose, onPress, duplicateExercises}) => {
  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContent}>
        <Text style={{fontFamily: "Roboto-Bold", color: colors.summerDark, fontSize: 16}}>
          Choose which exercise you want to edit
        </Text>
        {duplicateExercises.map(e => {
          return (
            <View key={e.id} style={{gap: 5}}>
              <CustomButton
                title={e.type?.name || ""}
                size={"L"}
                fontSize={18}
                backgroundColor={colors.summerDark}
                titleColor={colors.summerBlue}
                onPress={() => onPress(e)}
              />
              <Text style={{textAlign: "center", fontFamily: "Roboto-Black", color: colors.summerDark}}>
                Id: {e.id}
              </Text>
              <Text style={{textAlign: "center", fontFamily: "Roboto-Black", color: colors.summerDark}}>
                Sets: {e.sets} Reps: {e.reps} Weight: {e.weight}
              </Text>
            </View>
          );
        })}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 4,
    position: "absolute",
    top: "30%",
    alignItems: "center",
    left: "10%",
    gap: 20,
    right: "10%",
  },
  closeText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
});

export default DuplicateModal;
