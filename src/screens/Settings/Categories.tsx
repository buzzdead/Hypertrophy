import React, {useEffect, useState} from "react";
import {Text, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {SafeAreaView} from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import {useCategories} from "../../hooks/useCategories";
import {colors} from "../../utils/util";
import NewObjectModal from "../Exercise/AddExercise/Modal/NewObjectModal";
import {handleDelete, handleEdit} from "./Settings";
import {deletionStyles} from "./styles";

export function Categories() {
  const categories = useCategories();
  const [modalVisible, setModalVisible] = useState<{visible: boolean; id: number}[]>([]);

  const onEdit = (name: string, id: number) => {
    handleEdit(id, name);
    onClose(id);
  };
  const onOpen = (id: number) => {
    console.log(id);
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
    const mVisibles = categories.map(c => {
      return {visible: false, id: c.id};
    });
    setModalVisible(mVisibles);
  }, [categories]);

  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={deletionStyles.container}>
          {categories.map(c => {
            const visible = modalVisible.find(m => m.id === c.id)?.visible || false;
            const onCloseCurrent = () => onClose(c.id);
            return (
              <View key={c.name} style={deletionStyles.subContainer}>
                <Text style={deletionStyles.title}>{c.name}</Text>
                <View style={{alignSelf: "center", gap: 10}}>
                <CustomButton
                    size="L"
                    titleColor={colors.summerWhite}
                    backgroundColor={colors.summerDark}
                    title={"Edit category"}
                    onPress={() => onOpen(c.id)}
                  />
                  <CustomButton
                    size="L"
                    titleColor={colors.summerBlue}
                    backgroundColor={colors.summerDark}
                    title={"Delete category"}
                    onPress={() => handleDelete(c)}
                  />
                </View>
                {visible && (
                  <NewObjectModal
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
