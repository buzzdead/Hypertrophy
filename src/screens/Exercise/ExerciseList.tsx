import React, {useState} from "react";
import {SafeAreaView, StyleSheet, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {Exercise} from "../../../typings/types";
import {colors} from "../../utils/util";
import {useExercises} from "../../hooks/useExercises";
import {SideBar} from "../../components/SideBar";
import {useCategories} from "../../hooks/useCategories";
import {CategorySchema} from "../../config/realmConfig";
import CustomButton from "../../components/CustomButton";
import WeeklyExercises from "./WeeklyExercises";

type Props = StackScreenProps<
  {
    List: undefined;
    Details: {exerciseId?: number};
    AddExercise: {previousExercise: Exercise | null};
  },
  "List"
>;

const ExerciseList: React.FC<Props> = ({navigation}) => {
  const {exercises, refresh} = useExercises();
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>();
  const categories = useCategories();
  const [refreshing, setRefreshing] = useState(false);

  const handleFilterChange = (selectedCategories: Optional<CategorySchema>[]) => {
    const filtered = selectedCategories.length === 0
      ? exercises
      : exercises.filter(exercise =>
          selectedCategories?.some(selectedCategory => selectedCategory?.id === exercise.type?.category?.id),
        );

    setFilteredExercises(filtered);
  };

  console.log("rendering exerciselist")

  return (
    <SafeAreaView style={styles.container}>
      <WeeklyExercises navigation={navigation} filteredExercises={filteredExercises || exercises} />
      <View style={{width: "10%", bottom: 3, right: -3, position: "absolute"}}>
        <CustomButton
          title="+"
          fontSize={24}
          titleColor={colors.accent}
          backgroundColor={colors.summerDark}
          onPress={() => navigation.navigate("AddExercise", {previousExercise: null})}
        />
      </View>
      <SideBar categories={categories} onFilterChange={handleFilterChange} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ExerciseList;
