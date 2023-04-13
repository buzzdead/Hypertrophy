import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {SafeAreaView} from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import {CategorySchema, ExerciseTypeSchema} from "../../config/realmConfig";
import {useExerciseTypes} from "../../hooks/useExerciseTypes";
import {colors} from "../../utils/util";
import NewObjectModal from "../Exercise/AddExercise/Modal/NewObjectModal";
import {handleDelete, handleEdit} from "./Settings";

export function ExerciseTypes() {
  const {memoizedExerciseTypes, refresh} = useExerciseTypes({category: null, showAll: true});
  const validExerciseTypes = memoizedExerciseTypes.filter(e => e.isValid());
  const [modalVisible, setModalVisible] = useState<{visible: boolean; id: number}[]>([]);

  const onEdit = (name: string, id: number, category?: CategorySchema) => {
    handleEdit(id, name, category);
    onClose(id);
  };
  const onDelete = async (exerciseType: ExerciseTypeSchema) => {
    await handleDelete(exerciseType);
    refresh();
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
    const mVisibles = validExerciseTypes.map(c => {
      return {visible: false, id: c.id};
    });
    setModalVisible(mVisibles);
  }, [memoizedExerciseTypes]);
  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {validExerciseTypes.map(c => {
            const visible = modalVisible.find(m => m.id === c.id)?.visible || false;
            const onCloseCurrent = () => onClose(c.id);
            return (
              <View key={c.name} style={styles.subContainer}>
                <Text style={styles.title}>{c.name}</Text>
                <View style={styles.buttonContainer}>
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
                    onPress={() => onDelete(c)}
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

export const styles = StyleSheet.create({
  container: {
    padding: 50,
    gap: 20,
  },
  subContainer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 5,
  },
  title: {
    textAlign: "center",
    minWidth: 175,
    fontFamily: "Roboto-Bold",
    fontSize: 22,
    color: colors.summerDarkest,
    marginBottom: 10,
  },
  buttonContainer: {
    alignSelf: "center",
    gap: 10,
  },
});
