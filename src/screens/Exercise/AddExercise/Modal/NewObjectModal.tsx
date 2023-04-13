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
import {CategorySchema, ExerciseTypeSchema} from "../../../../config/realmConfig";
import {useCategories} from "../../../../hooks/useCategories";
import PickerField from "../Picker/PickerField";

type NewObjectModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd?: (name: string, isCategory: boolean, category?: Nullable<CategorySchema>) => void;
  modalFunction?: (name: string, id: number, category?: CategorySchema) => void;
  id?: number;
  currentValue?: string;
  currentCategory?: CategorySchema;
  title?: string
  objectType: "Category" | "Exercise Type";
  name: "Exercise Type" | "Category"
};

const NewObjectModal = ({
  visible,
  onClose,
  onAdd,
  objectType,
  modalFunction,
  id,
  currentValue,
  currentCategory,
  title,
  name
}: NewObjectModalProps) => {
  const [objectName, setObjectName] = useState(currentValue || "");
  const {categories} = useCategories()
  const [category, setCategory] = useState<Optional<CategorySchema>>(currentCategory);

  const handleAdd = () => {
    modalFunction && id
      ? modalFunction(objectName, id, category)
      : onAdd && onAdd(objectName, objectType === "Category", category);
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
        {objectType === "Exercise Type" && (
          <PickerField
          name={name}
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
            <Button title={title || "Add"} onPress={handleAdd} />
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
    gap: 10,
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
