import React from "react";
import {Button, Text, View} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {SafeAreaView} from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import {useExerciseTypes} from "../../hooks/useExerciseTypes";
import { colors } from "../../utils/util";
import {handleDelete} from "./Settings";
import { deletionStyles } from "./styles";

export function ExerciseTypes() {
  const exerciesTypes = useExerciseTypes({category: null, showAll: true});
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={deletionStyles.container}>
          {exerciesTypes.map(c => {
            return (
              <View style={deletionStyles.subContainer}>
                <Text style={deletionStyles.title}>{c.name}</Text>
                <CustomButton
                  titleColor={colors.error}
                  backgroundColor={colors.summerDark}
                  title={"Delete exercise type"}
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
