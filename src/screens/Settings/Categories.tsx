import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {SafeAreaView} from "react-native-safe-area-context";
import { useQueryClient } from "react-query";
import CustomButton from "../../components/CustomButton";
import {CategorySchema} from "../../config/realm";
import {useRealm} from "../../hooks/hooks";
import {colors} from "../../utils/util";
import NewObjectModal from "../Exercise/AddExercise/Modal/NewObjectModal";
import {handleDelete, handleEdit} from "./Settings";

export function Categories() {
  const {data: categories, refresh} = useRealm<CategorySchema>({schemaName: "Category"});
  const [modalVisible, setModalVisible] = useState<{visible: boolean; id: number}[]>([]);
  const validCategories = categories.filter(c => c.isValid());
  const qc = useQueryClient()

  const onEdit = (name: string, id: number) => {
    handleEdit(id, name);
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
    const mVisibles = validCategories.map(c => {
      return {visible: false, id: c.id};
    });
    setModalVisible(mVisibles);
  }, [categories]);

  const onDelete = async (c: CategorySchema) => {
    await handleDelete(c);
    await qc.invalidateQueries("Exercise")
    await qc.invalidateQueries("ExerciseType")
    await qc.invalidateQueries("Category")
    await qc.invalidateQueries("Plan")
    await qc.invalidateQueries("Month")
    refresh();
  };

  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps="handled">
      <Text style={{textAlign: "center", fontFamily: 'Roboto-Medium', fontSize: 28, color: colors.summerDark, paddingVertical: 20}}>Active categories</Text>
        <View style={styles.container}>
          {validCategories.map(c => {
            const visible = modalVisible.find(m => m.id === c.id)?.visible || false;
            const onCloseCurrent = () => onClose(c.id);
            return (
              <View key={c.name} style={styles.subContainer}>
                <Text style={styles.title}>{c.name}</Text>
                <View accessibilityLabel={`change ${c.name}`} style={styles.buttonContainer}>
                <CustomButton
                    size="L"
                    fontSize={18}
                    titleColor={colors.summerBlue}
                    backgroundColor={colors.summerDarkest}
                    title={"Edit " + c.name}
                    onPress={() => onOpen(c.id)}
                  />
                  <CustomButton
                    size="L"
                    fontSize={18}
                    titleColor={colors.delete}
                    backgroundColor={colors.summerDarkest}
                    title={"Delete " + c.name}
                    onPress={() => onDelete(c)}
                  />
                </View>
                {visible && (
                  <NewObjectModal
                    name="Category"
                    visible={visible}
                    modalFunction={onEdit}
                    id={c.id}
                    objectType="Category"
                    onClose={onCloseCurrent}
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
    padding: 10,
    gap: 20,
  },
  subContainer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 5,
  },
  title: {
    textDecorationLine: "underline", 
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
