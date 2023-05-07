import React, {useState} from "react";
import {View, StyleSheet} from "react-native";
import { addCategory, addExerciseType } from "../../../../api/realm";
import CustomButton from "../../../../components/CustomButton";
import { CategorySchema } from "../../../../config/realm";
import { colors } from "../../../../utils/util";
import NewObjectModal from "./NewObjectModal";

type Props = {
  isCategory: boolean;
  s: () => void
};

const AddObject = ({isCategory, s}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const name = isCategory ? "Exercise Type" : "Category"

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleAdd = async (name: string, isCategory: boolean, category?: Nullable<CategorySchema>) => {
    isCategory ? await addCategory(name) : await addExerciseType(name, category!);
    closeModal();
    s()
  };

  return (
    <View>
      <View style={styles.addButton}>
       <CustomButton
          title="+"
          fontSize={32}
          titleColor={colors.accent}
          backgroundColor={colors.summerDark}
          onPress={openModal}
        />
        </View>
      <NewObjectModal
      name={name}
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
    paddingBottom: 5
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
