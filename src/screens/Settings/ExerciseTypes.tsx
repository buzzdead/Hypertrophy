import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {SafeAreaView} from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import {CategorySchema, ExerciseTypeSchema} from "../../config/realm";
import {useRealm} from "../../hooks/hooks";
import {colors, validateSchema} from "../../utils/util";
import NewObjectModal from "../Exercise/AddExercise/Modal/NewObjectModal";
import {handleDelete, handleEdit} from "./Settings";

// Add pagination
export function ExerciseTypes() {
  const {data: exerciseTypes, refresh} = useRealm<ExerciseTypeSchema>({schemaName: "ExerciseType"});
  const validExerciseTypes = validateSchema(exerciseTypes)
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
  }, [exerciseTypes]);
  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps="handled">
      <Text style={{textAlign: "center", fontFamily: 'Roboto-Medium', fontSize: 28, color: 'black', paddingTop: 20}}>Active exercise types</Text>
        <View style={styles.container}>
          {validExerciseTypes.map(c => {
            const visible = modalVisible.find(m => m.id === c.id)?.visible || false;
            const onCloseCurrent = () => onClose(c.id);
            return (
              <View key={c.name + '-' + c.id.toString()} style={styles.subContainer}>
                <Text style={styles.title}>{c.name}</Text>
                <View style={styles.buttonContainer}>
                  <CustomButton
                    size="L"
                    fontSize={16}
                    titleColor={colors.accent}
                    backgroundColor={colors.summerDarkest}
                    title={"Edit " + c.name}
                    onPress={() => onOpen(c.id)}
                  />
                  <CustomButton
                    size="L"
                    fontSize={16}
                    titleColor={colors.error}
                    backgroundColor={colors.summerDarkest}
                    title={"Delete " + c.name}
                    onPress={() => onDelete(c)}
                  />
                </View>
                {visible && (
                  <NewObjectModal
                    name="Exercise Type"
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
