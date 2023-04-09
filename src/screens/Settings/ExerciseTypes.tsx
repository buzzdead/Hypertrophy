import React from "react";
import {Text, View} from "react-native";
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
              <View key={c.name} style={deletionStyles.subContainer}>
                <Text style={deletionStyles.title}>{c.name}</Text>
                <View style={{alignSelf: "center"}}>
                <CustomButton
                size="L"
                  titleColor={colors.summerBlue}
                  backgroundColor={colors.summerDark}
                  title={"Delete exercise type"}
                  onPress={() => handleDelete(c)}
                />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
