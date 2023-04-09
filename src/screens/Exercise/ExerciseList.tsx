import React, {useState} from "react";
import {FlatList, SafeAreaView, Text, TouchableOpacity, StyleSheet, View, RefreshControl} from "react-native";
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
      <View style={{width: "15%", padding: 5, bottom: 0, alignSelf: "flex-end", position: "absolute"}}>
        <CustomButton
          title="+"
          fontSize={22}
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
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.test3,
    width: "100%",
  },
  itemText: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
  itemText2: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: colors.test5,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
    opacity: 0.75,
  },
});

export default ExerciseList;
