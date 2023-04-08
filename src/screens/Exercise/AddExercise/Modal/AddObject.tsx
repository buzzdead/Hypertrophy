import React, {useState} from "react";
import {View, TouchableOpacity, Text, StyleSheet} from "react-native";
import { addCategory, addExerciseType } from "../../../../api/realmAPI";
import { CategorySchema } from "../../../../config/realmConfig";
import { colors } from "../../../../utils/util";
import NewObjectModal from "./NewObjectModal";

type Props = {
  isCategory: boolean;
};

const AddObject = ({isCategory}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleAdd = (name: string, isCategory: boolean, category?: CategorySchema) => {
    isCategory ? addCategory(name) : addExerciseType(name, category!);
    closeModal();
  };

  return (
    <View>
      <TouchableOpacity style={styles.addButton} onPress={openModal}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <NewObjectModal
        visible={modalVisible}
        onClose={closeModal}
        onAdd={handleAdd}
        objectType={isCategory ? "Category" : "Exercise Type"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    width: 25,
    height: 25,
    backgroundColor: colors.summerDark,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.summerBlue,
    lineHeight: 22,
    textAlign: "center",
  },
});

export default AddObject;
