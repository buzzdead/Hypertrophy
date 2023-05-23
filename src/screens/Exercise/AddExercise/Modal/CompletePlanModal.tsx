import React from "react";
import {Modal, View, Text, StyleSheet} from "react-native";
import Contingent from "../../../../components/Contingent";
import CustomButton from "../../../../components/CustomButton";
import {colors} from "../../../../utils/color";

interface Props {
  visible: boolean;
  onClose: (complete: boolean) => void;
  metExpectations: boolean
}

export const CompletePlanModal: React.FC<Props> = ({visible, onClose, metExpectations}) => {
  return (
    <Modal visible={visible} transparent onRequestClose={() => onClose(false)}>
      <View style={styles.modalContent}>
        <Text style={{textAlign: "center", fontFamily: "Roboto-Bold", fontSize: 28, color: "black"}}>Plan Modal</Text>
        <Contingent shouldRender={metExpectations}>
            <Text>Congratulations on finishing your plan! Click yes to complete it.</Text>
            <Text style={{textAlign: "center"}}>This exercise did not quite meet the expectations of the plan, complete it anyway?</Text>
        </Contingent>
        <View style={{flexDirection: 'row', gap: 50, justifyContent: 'center'}}>
        <CustomButton
          size="S"
          title={"Yes"}
          titleColor={colors.summerBlue}
          backgroundColor={colors.summerDark}
          onPress={() => onClose(true)}
        />
        <CustomButton
          size="S"
          title={"No"}
          titleColor={colors.error}
          backgroundColor={colors.summerDark}
          onPress={() => onClose(false)}
        />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 2,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
    width: "100%",
    marginHorizontal: -16,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 4,
    position: "absolute",
    top: "30%",
    left: "10%",
    gap: 25,
    right: "10%",
  },
  input: {
    borderColor: "#BDBDBD",
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  closeText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
});
