import React from "react";
import {FlatList, SafeAreaView, StyleSheet, View} from "react-native";
import {colors} from "../../utils/util";
import {ExerciseWithDuplicates} from "../../../typings/types";
import {StackScreenProps} from "@react-navigation/stack";
import ExerciseItem from "./ExerciseItem";

type WeeklyExercisesProps = {
  navigation: StackScreenProps<any, "List">["navigation"];
  groupedExercises: ExerciseWithDuplicates[]
};

const WeeklyExercises: React.FC<WeeklyExercisesProps> = ({
  navigation,
  groupedExercises
}) => {
  
  const validExercises = groupedExercises.filter(e => e.exercise.isValid())
  
  console.log("rendering weekly")
  return (
    <SafeAreaView style={styles.container} >
      <FlatList
        data={validExercises || []}
        style={{gap: 10}}
        ItemSeparatorComponent={() => <View style={{padding: 5}}></View>}
        renderItem={({item}) => <ExerciseItem item={item} navigation={navigation} />}
        keyExtractor={item => item.exercise.id.toString()}  
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.summerWhite,
    paddingTop: 5,
  },
  button: {
    fontSize: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: "Roboto-Bold",
  },
});

export default React.memo(WeeklyExercises);
