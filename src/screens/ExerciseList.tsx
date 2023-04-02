import React, {useRef, useState} from "react";
import {Button, FlatList, SafeAreaView, Text, TouchableOpacity, StyleSheet, View, ColorValue , RefreshControl} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {Exercise} from "../types";
import {colors} from "../utils/util";
import {useExercises} from "../hooks/useExercises";
import {SideBar} from "./SideBar";
import {useCategories} from "../hooks/useCategories";

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
  
  const _onRefresh = () => {
    setRefreshing(true);

    // Fetch your data here, and update your component's state.
    // Once the data fetching is done, set the refreshing state to false.

    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // This is a simulation of data fetching. Replace it with your own data fetching logic.
  };
  
  const handleFilterChange = (selectedCategories: string[]) => {
    if (selectedCategories.length === 0) {
      setFilteredExercises(exercises);
    } else {
      setFilteredExercises(exercises.filter(exercise => selectedCategories.includes(exercise.category)));
    }
  };

  const renderItem = (
    {item}: {item: Exercise; index: number},
    navigation: StackScreenProps<any, "List">["navigation"],
  ) => {
    if (!item) {
      return null;
    }
    return (
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("Details", {exerciseId: item.id})}>
        <View style={{flexDirection: "column", width: "100%", gap: 15}}>
          <View style={{justifyContent: "space-between", flexDirection: "row"}}>
            <Text style={{...styles.itemText, color: colors.accent}}>{item.name.toUpperCase()}</Text>
            <Text style={{fontStyle: "italic", color: colors.secondary}}>{item.date.toLocaleDateString()}</Text>
          </View>
          <Text style={styles.itemText}>Category: <Text style={styles.itemText2}>{item.category}</Text></Text>
          <Text style={styles.itemText}>
            Result: <Text style={styles.itemText2}>{item.sets} sets x {item.reps} reps</Text>
          </Text> 
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredExercises || exercises}
        renderItem={item => renderItem(item, navigation)}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh}
            colors={['#9Bd35A', '#689F38']}
            progressBackgroundColor="#fff"
            tintColor="#689F38"
          />} />
      <Button title="New Exercise" onPress={() => navigation.navigate("AddExercise", { previousExercise: null })} />

      <SideBar categories={categories} onFilterChange={handleFilterChange} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    width: "100%",
  },
  itemText: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
  itemText2: {
    fontSize: 14,
    fontFamily: "Roboto-Medium",
    color: colors.tertiary,
  }
});

export default ExerciseList;
