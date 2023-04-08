import React from "react";
import {Button, Text, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {SafeAreaView} from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import {useCategories} from "../../hooks/useCategories";
import {colors} from "../../utils/util";
import {handleDelete} from "./Settings";
import {deletionStyles} from "./styles";

export function Categories() {
  const categories = useCategories();
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={deletionStyles.container}>
          {categories.map(c => {
            return (
              <View style={deletionStyles.subContainer}>
                <Text style={deletionStyles.title}>{c.name}</Text>
                <CustomButton
                  titleColor={colors.error}
                  backgroundColor={colors.summerDark}
                  title={"Delete category"}
                  onPress={() => handleDelete(c)}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
