// CategoryPicker.tsx
import React from "react";
import { View, Modal, TouchableWithoutFeedback, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

type PickerProps = {
  visible: boolean;
  items: string[];
  onSelect: (item: string) => void;
  onClose: () => void;
  picker?: boolean
};

const Picker: React.FC<PickerProps> = ({ visible, items, onSelect, onClose, picker }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={{...styles.pickerContainer, top: picker ? 200 : 100}}>
        <FlatList
          data={items.filter(item => item !== "default")}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
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
