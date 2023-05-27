import React, { useCallback } from "react";
import {FlatList, SafeAreaView, StyleSheet, View} from "react-native";
import {colors} from "../../utils/util";
import {ExerciseWithDuplicates} from "../../../typings/types";
import {StackScreenProps} from "@react-navigation/stack";
import ExerciseItem from "./ExerciseItem";
import SkeletonItem from "./SkeletonItem";

type WeeklyExercisesProps = {
  navigation: StackScreenProps<any, "List">["navigation"];
  groupedExercises?: ExerciseWithDuplicates[]
  isLoading?: boolean
  isSwipingHorizontally?: boolean
};


const WeeklyExercises: React.FC<WeeklyExercisesProps> = ({
  navigation,
  groupedExercises,
  isSwipingHorizontally = false,
  isLoading = false
}) => {

  const renderItem = useCallback(
    ({item}: {item: ExerciseWithDuplicates}) => isLoading ? <SkeletonItem /> : <ExerciseItem item={item} navigation={navigation} />,
    [navigation, isLoading]
  );
  
  
  const validExercises = groupedExercises && groupedExercises.filter(e => e.exercise.isValid())

  const SeparatorComponent = () => <View style={{padding: 5}}></View>;


  console.log("rendering weekly")
  return (
    <SafeAreaView style={styles.container} >
      <FlatList
        data={isLoading ? Array(5).fill({}) : validExercises}
        ItemSeparatorComponent={SeparatorComponent}
        renderItem={renderItem}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        scrollEnabled={!isSwipingHorizontally}
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
});

export default React.memo(WeeklyExercises);
