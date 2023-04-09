import React, {useState} from "react";
import {
  Modal,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import {CategorySchema} from "../../../../config/realmConfig";
import {useCategories} from "../../../../hooks/useCategories";
import PickerField from "../Picker/PickerField";

type NewObjectModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, isCategory: boolean, category?: Nullable<CategorySchema>) => void;
  objectType: "Category" | "Exercise Type";
};

const NewObjectModal = ({visible, onClose, onAdd, objectType}: NewObjectModalProps) => {
  const [objectName, setObjectName] = useState("");
  const categories = objectType === "Exercise Type" ? useCategories() : null;
  const [category, setCategory] = useState<Nullable<CategorySchema>>();

  const handleAdd = () => {
    onAdd(objectName, objectType === "Category", category);
  };

  const handleOnChange = (value: CategorySchema) => {
    setCategory(value);
  };

  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContent}>
        <TextInput
          value={objectName}
          onChangeText={setObjectName}
          placeholder={`${objectType} Name`}
          style={styles.input}
        />
        {categories && (
          <PickerField
            item={category!}
            items={categories}
            onChange={value => handleOnChange(value)}
            picker={380}
            maxWidth={300}
          />
        )}
        <View style={{flexDirection: "row"}}>
          <TouchableOpacity style={{flex: 1}} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <Button title="Add" onPress={handleAdd} />
          </View>
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
    right: "10%",
  },
  input: {
    borderColor: "#BDBDBD",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  closeText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
});

export default NewObjectModal;
