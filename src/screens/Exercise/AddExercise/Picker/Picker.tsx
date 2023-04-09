// CategoryPicker.tsx
import React from "react";
import { View, Modal, TouchableWithoutFeedback, TouchableHighlight, FlatList, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { CategorySchema, ExerciseTypeSchema } from "../../../../config/realmConfig";
import { colors } from "../../../../utils/util";

type PickerProps = {
  visible: boolean;
  items: (CategorySchema | ExerciseTypeSchema)[];
  onSelect: (item: CategorySchema | ExerciseTypeSchema) => void;
  onClose: () => void;
  picker?: number
  maxWidth?: number
};

const Picker: React.FC<PickerProps> = ({ visible, items, onSelect, onClose, picker, maxWidth }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={{...styles.pickerContainer, top: picker ? picker : 140, maxWidth: maxWidth, left: maxWidth ? 55 : 16}}>
        <FlatList
          data={items.filter(item => item.name !== "default")}
          renderItem={({ item }) => (
            <TouchableHighlight
            underlayColor={colors.summerBlue}
              style={{ padding: 8 }}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
             
            >
              <Text>{item.name}</Text>
            </TouchableHighlight>
          )}
          keyExtractor={item => item.name}
        />
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
  },
});

export default Picker;
