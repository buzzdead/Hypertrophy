import React, {useEffect, useState} from "react";
import {Text, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {SafeAreaView} from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import {CategorySchema} from "../../config/realmConfig";
import {useExerciseTypes} from "../../hooks/useExerciseTypes";
import {colors} from "../../utils/util";
import NewObjectModal from "../Exercise/AddExercise/Modal/NewObjectModal";
import {handleDelete, handleEdit} from "./Settings";
import {deletionStyles} from "./styles";

export function ExerciseTypes() {
  const exerciesTypes = useExerciseTypes({category: null, showAll: true});
  const [modalVisible, setModalVisible] = useState<{visible: boolean; id: number}[]>([]);

  const onEdit = (name: string, id: number, category?: CategorySchema) => {
    handleEdit(id, name, category);
    onClose(id);
  };
  const onOpen = (id: number) => {
    setModalVisible(
      modalVisible.map(m => {
        if (m.id === id) {
          return Object.assign({}, m, {visible: true});
        } else {
          return m;
        }
      }),
    );
  };

  const onClose = (id: number) => {
    setModalVisible(
      modalVisible.map(m => {
        if (m.id === id) {
          return Object.assign({}, m, {visible: false});
        } else {
          return m;
        }
      }),
    );
  };
  useEffect(() => {
    const mVisibles = exerciesTypes.map(c => {
      return {visible: false, id: c.id};
    });
    setModalVisible(mVisibles);
  }, [exerciesTypes]);
  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={deletionStyles.container}>
          {exerciesTypes.map(c => {
            const visible = modalVisible.find(m => m.id === c.id)?.visible || false;
            const onCloseCurrent = () => onClose(c.id);
            return (
              <View key={c.name} style={deletionStyles.subContainer}>
                <Text style={deletionStyles.title}>{c.name}</Text>
                <View style={{alignSelf: "center", gap: 10}}>
                <CustomButton
                    size="L"
                    fontSize={20}
                    titleColor={colors.summerWhite}
                    backgroundColor={colors.summerDark}
                    title={"Edit exercise type"}
                    onPress={() => onOpen(c.id)}
                  />
                  <CustomButton
                    size="L"
                    fontSize={20}
                    titleColor={colors.error}
                    backgroundColor={colors.summerDark}
                    title={"Delete exercise type"}
                    onPress={() => handleDelete(c)}
                  />
                </View>
                {visible && (
                  <NewObjectModal
                  name="Category"
                    visible={visible}
                    modalFunction={onEdit}
                    id={c.id}
                    objectType="Exercise Type"
                    onClose={onCloseCurrent}
                    currentCategory={c.category}
                    currentValue={c.name}
                    title={"Save"}
                  />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
