import React, {useState} from "react";
import {View, StyleSheet} from "react-native";
import { addCategory, addExerciseType } from "../../../../api/realmAPI";
import CustomButton from "../../../../components/CustomButton";
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

  const handleAdd = (name: string, isCategory: boolean, category?: Nullable<CategorySchema>) => {
    isCategory ? addCategory(name) : addExerciseType(name, category!);
    closeModal();
  };

  return (
    <View>
      <View style={styles.addButton}>
       <CustomButton
          title="+"
          fontSize={24}
          titleColor={colors.summerBlue}
          backgroundColor={colors.summerDark}
          onPress={openModal}
        />
        </View>
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
