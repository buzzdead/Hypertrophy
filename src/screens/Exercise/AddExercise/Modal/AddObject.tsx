import React, {useState} from "react";
import {View, StyleSheet} from "react-native";
import { addCategory, addExerciseType, createPreset } from "../../../../api/realm";
import CustomButton from "../../../../components/CustomButton";
import { CategorySchema } from "../../../../config/realm";
import { colors } from "../../../../utils/util";
import NewObjectModal from "./NewObjectModal";
import { PresetPlanModal } from "./PresetPlanModal";

type Props = {
  isCategory: boolean;
  s: () => void
  isLandscape?: boolean
  planPresetModal?: boolean
};

const AddObject = ({isCategory, s, isLandscape=false, planPresetModal = false}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const name = isCategory ? "Exercise Type" : "Category"

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleAdd = async (name: string, isCategory: boolean, category?: Nullable<CategorySchema>) => {
    if(name === "" || !isCategory && category === undefined) return
    isCategory ? await addCategory(name) : await addExerciseType(name, category!);
    closeModal();
    s()
  };

  const handleAddPresetModal = async (name: string) => {
    await createPreset(name)
    s()
    closeModal()
  }

  return (
    <View accessibilityLabel={`modal-${name}`}>
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
      name={name === 'Category' ? 'Exercise Type' : 'Category'}
        visible={modalVisible && !planPresetModal}
        isLandscape={isLandscape}
        onClose={closeModal}
        onAdd={handleAdd}
        objectType={isCategory ? "Category" : "Exercise Type"}
      />
      <PresetPlanModal visible={modalVisible && planPresetModal} onClose={closeModal} isLandscape={isLandscape} onAdd={handleAddPresetModal} />
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
