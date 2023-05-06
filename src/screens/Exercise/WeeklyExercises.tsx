import React, { useEffect, useState } from "react";
import {FlatList, SafeAreaView, StyleSheet, RefreshControl, View} from "react-native";
import {colors} from "../../utils/util";
import {ExerciseWithDuplicates} from "../../../typings/types";
import {StackScreenProps} from "@react-navigation/stack";
import ExerciseItem from "./ExerciseItem";

type WeeklyExercisesProps = {
  navigation: StackScreenProps<any, "List">["navigation"];
  onRefresh: () => void;
  refreshing?: boolean;
  groupedExercises: ExerciseWithDuplicates[]
};

const WeeklyExercises: React.FC<WeeklyExercisesProps> = ({
  navigation,
  onRefresh,
  refreshing = false,
  groupedExercises
}) => {
  
  const [currentExercises, setCurrentExercises] = useState<ExerciseWithDuplicates[]>([])

  useEffect(() => {
    if(!groupedExercises || groupedExercises === undefined) {
      const newExercises = currentExercises.filter(e => e.exercise.isValid())
      setCurrentExercises(newExercises)
    }
    setCurrentExercises(groupedExercises?.filter(e => e.exercise.isValid()))
  }, [groupedExercises])


  return (
    <SafeAreaView style={styles.container} >
      <FlatList
        data={currentExercises || []}
        style={{gap: 10}}
        ItemSeparatorComponent={() => <View style={{padding: 5}}></View>}
        renderItem={({item}) => <ExerciseItem item={item} navigation={navigation} />}
        keyExtractor={item => item.exercise.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
            colors={["#9Bd35A", "#689F38"]}
            progressBackgroundColor="#fff"
            tintColor="#689F38"
          />
        }
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
