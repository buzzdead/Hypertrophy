import React, {useState, useMemo} from "react";
import {FlatList, SafeAreaView, Text, StyleSheet, View, TouchableOpacity} from "react-native";
import {colors, getWeekNumber} from "../../utils/util";
import {Exercise} from "../../../typings/types";
import { StackScreenProps } from "@react-navigation/stack";

type WeeklyExercisesProps = {
    navigation: StackScreenProps<any, "List">["navigation"];
    filteredExercises: Exercise[];
  };

const WeeklyExercises: React.FC<WeeklyExercisesProps> = ({navigation, filteredExercises}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const groupedExercises = useMemo(() => {
    const sortedExercises = [...filteredExercises].sort((a, b) => a.date.getTime() - b.date.getTime());
    const groups: any[] = [];

    sortedExercises.forEach(exercise => {
      const weekStart = exercise?.date ? new Date(exercise.date) : new Date();
      weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
      const weekNumber = getWeekNumber(weekStart)
      const weekKey = `${weekStart.getFullYear()}-W${weekNumber}`;

      let group = groups.find(g => g.weekKey === weekKey);
      if (!group) {
        group = {weekKey, weekNumber, exercises: []};
        groups.push(group);
      }

      group.exercises.push(exercise);
    });

    return groups;
  }, [filteredExercises]);

  const handleNextPage = () => {
    if (currentPage < groupedExercises.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
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
            <Text style={{...styles.itemText, fontSize: 18, color: colors.test6}}>{item.type?.name}</Text>
            <Text style={{fontStyle: "italic", color: colors.test6}}>{item.date.toLocaleDateString()}</Text>
          </View>
          <Text style={[styles.itemText, {color: colors.summerDarkest}]}>
            Category: <Text style={styles.itemText2}>{item.type?.category?.name}</Text>
          </Text>
          <Text style={styles.itemText2}>
            <Text style={{color: colors.test6}}>Sets: </Text>
            {item.sets} <Text style={{color: colors.test6}}>Reps: </Text>
            {item.reps} <Text style={{color: colors.test6}}>Weight: </Text>
            {item.weight} kg
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  console.log("rendering weeklyexercises")

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={groupedExercises[currentPage]?.exercises || []}
        renderItem={item => renderItem(item, navigation)}
        keyExtractor={item => item.id.toString()}
      />
      <View style={styles.pagination}>
        <Text style={[styles.button, {color: currentPage === 0 ? colors.summerDark : colors.summerBlue}]} onPress={handlePrevPage}>
          {"<"}
        </Text>
        <Text>Week{groupedExercises[currentPage]?.weekNumber}</Text>
        <Text style={[styles.button, {color: currentPage === groupedExercises.length - 1 ? colors.summerDark : colors.summerBlue}]} onPress={handleNextPage}>
          {">"}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
    width: "100%",
  },
  button: {
    fontSize: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: "Roboto-Bold",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
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
});

export default WeeklyExercises;
