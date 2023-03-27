// CategoryPicker.tsx
import React from "react";
import { View, Modal, TouchableWithoutFeedback, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  visible: boolean;
  categories: string[];
  onSelect: (category: string) => void;
  onClose: () => void;
};

const CategoryPicker: React.FC<Props> = ({ visible, categories, onSelect, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.pickerContainer}>
        <FlatList
          data={categories.filter(category => category !== "newcategory" && category !== "default")}
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
    top: 100,
    left: 16,
    right: 16,
    zIndex: 2,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 8,
  },
});

export default CategoryPicker;
