import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {SafeAreaView} from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import {CategorySchema} from "../../config/realm";
import {useCategories} from "../../hooks/useCategories";
import {colors} from "../../utils/util";
import NewObjectModal from "../Exercise/AddExercise/Modal/NewObjectModal";
import {handleDelete, handleEdit} from "./Settings";

export function Categories() {
  const {categories, refresh} = useCategories();
  const [modalVisible, setModalVisible] = useState<{visible: boolean; id: number}[]>([]);
  const validCategories = categories.filter(c => c.isValid());

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
    refresh();
  };

  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={{textAlign: "center", fontFamily: 'Roboto-Bold', fontSize: 28, color: 'black'}}>Active categories</Text>
          {validCategories.map(c => {
            const visible = modalVisible.find(m => m.id === c.id)?.visible || false;
            const onCloseCurrent = () => onClose(c.id);
            return (
              <View key={c.name} style={styles.subContainer}>
                <Text style={styles.title}>{c.name}</Text>
                <View accessibilityLabel={`change ${c.name}`} style={styles.buttonContainer}>
                  <CustomButton
                    size="L"
                    titleColor={colors.summerWhite}
                    backgroundColor={colors.summerDark}
                    fontSize={20}
                    title={"Edit category"}
                    onPress={() => onOpen(c.id)}
                  />
                  <CustomButton
                    size="L"
                    titleColor={colors.error}
                    fontSize={20}
                    backgroundColor={colors.summerDark}
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
