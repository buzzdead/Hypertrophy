import React, {useState, useMemo, useCallback, useEffect} from "react";
import {FlatList, SafeAreaView, Text, StyleSheet, View, TouchableOpacity, RefreshControl, PanResponder, PanResponderInstance} from "react-native";
import {colors, getWeekNumber} from "../../utils/util";
import {Duplicate, Exercise, Exercises} from "../../../typings/types";
import {StackScreenProps} from "@react-navigation/stack";
import { SideBar } from "../../components/SideBar";
import { useCategories } from "../../hooks/useCategories";
import { CategorySchema } from "../../config/realmConfig";
import CustomButton from "../../components/CustomButton";

type WeeklyExercisesProps = {
  navigation: StackScreenProps<any, "List">["navigation"];
  exercises: Exercise[];
  onRefresh: (page: number) => void
  refreshing?: boolean
  page?: number
};

interface IGroup {
  weekKey: string;
  weekNumber: number;
  exercises: Array<Exercises>;
}

const WeeklyExercises: React.FC<WeeklyExercisesProps> = ({navigation, exercises: exercises, onRefresh, refreshing = false, page}) => {
  const [currentPage, setCurrentPage] = useState(page || 0);
  const categories = useCategories();
  const [panResponder, setPanResponder] = useState<PanResponderInstance>()
  const [filteredExercises, setFilteredExercises] = useState<Exercises[]>(exercises.map(e => {return {exercise: e, duplicates: []}}));
  const groupedExercises = useMemo(() => {
    console.log("using memo", exercises[exercises.length - 1])
    const sortedExercises = [...exercises].sort((a, b) => a.date.getTime() - b.date.getTime());
    const groups: IGroup[] = [];

    sortedExercises.forEach(exercise => {
      const weekStart = exercise?.date ? new Date(exercise.date) : new Date();
      weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
      const weekNumber = getWeekNumber(weekStart);
      const weekKey = `${weekStart.getFullYear()}-W${weekNumber}`;

      let group = groups.find(g => g.weekKey === weekKey);
      if (!group) {
        group = {weekKey, weekNumber, exercises: []};
        groups.push(group);
      }
      const duplicate = group.exercises.find(
        (other: Exercises) =>
          other.exercise.type?.id === exercise.type?.id &&
          other.exercise.date.getDay() === exercise.date.getDay() &&
          other.exercise.date.getMonth() === exercise.date.getMonth() &&
          other.exercise.date.getFullYear() === exercise.date.getFullYear(),
      );
      duplicate
        ? duplicate.duplicates.push({sets: exercise.sets, reps: exercise.reps, weight: exercise.weight})
        : group.exercises.push({exercise: exercise, duplicates: []});
    });

    return groups;
  }, [exercises]);

  const handleFilterChange = useCallback((selectedCategories: Optional<CategorySchema>[]) => {
    console.log("filtering")
    const filtered = selectedCategories.length === 0
      ? groupedExercises[currentPage]?.exercises
      : groupedExercises[currentPage]?.exercises?.filter(exercise =>
          selectedCategories?.some(selectedCategory => selectedCategory?.id === exercise.exercise.type?.category?.id),
        );
  
    setFilteredExercises(filtered);
  }, [groupedExercises, currentPage]);


  const handleNextPage = () => {
    if (currentPage < groupedExercises.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    console.log(currentPage)
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderDuplicate = (duplicate: Duplicate) => {
    return (
      <Text style={styles.itemText2}>
        <Text style={{color: colors.test6}}>Sets: </Text>
        {duplicate.sets} <Text style={{color: colors.test6}}>Reps: </Text>
        {duplicate.reps} <Text style={{color: colors.test6}}>Weight: </Text>
        {duplicate.weight} kg
      </Text>
    );
  };

  const renderItem = (
    {item}: {item: Exercises; index: number},
    navigation: StackScreenProps<any, "List">["navigation"],
  ) => {
    if (!item) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Details", {exerciseId: item.exercise.id, duplicates: item.duplicates})}>
        <View style={{flexDirection: "column", width: "100%"}}>
          <View style={{justifyContent: "space-between", flexDirection: "row"}}>
            <Text style={{...styles.itemText, fontSize: 18, color: colors.test6}}>{item.exercise.type?.name}</Text>
            <Text style={{fontStyle: "italic", color: colors.test6}}>{item.exercise.date.toLocaleDateString()}</Text>
          </View>
          <Text style={[styles.itemText, {color: colors.summerDarkest, marginBottom: 15, marginTop: 15}]}>
            Category: <Text style={styles.itemText2}>{item.exercise.type?.category?.name}</Text>
          </Text>
          <Text style={styles.itemText2}>
            <Text style={{color: colors.test6}}>Sets: </Text>
            {item.exercise.sets} <Text style={{color: colors.test6}}>Reps: </Text>
            {item.exercise.reps} <Text style={{color: colors.test6}}>Weight: </Text>
            {item.exercise.weight} kg
          </Text>
          <FlatList
            data={item.duplicates || []}
            renderItem={({item}) => renderDuplicate(item)}
            keyExtractor={(item, id) => id.toString()}
          />
        </View>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    console.log("setting the thing")
    const responder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const {dx, dy} = gestureState;
        return Math.abs(dx) > 20 && Math.abs(dx) > Math.abs(dy)
      },
      onPanResponderEnd: (event, gestureState) => {
        console.log("asdfiajsdfaisdjf")
        if (gestureState.dx > 50 && gestureState.vx > 0.5) {
          handlePrevPage();
        } else if (gestureState.dx < -50 && gestureState.vx < -0.5) {
          handleNextPage();
        }
      },
    });
    setPanResponder(responder);
  }, [currentPage, groupedExercises]);
  
  console.log("rendering weekly")
  return (
    <SafeAreaView style={styles.container} {...panResponder?.panHandlers}>
      <SideBar categories={categories} onFilterChange={handleFilterChange} currentPage={currentPage} />
      <FlatList
        data={filteredExercises || groupedExercises[currentPage]?.exercises || []}
        renderItem={item => renderItem(item, navigation)}
        keyExtractor={item => item.exercise.id.toString()}
        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={() => onRefresh(currentPage)}
          colors={["#9Bd35A", "#689F38"]}
          progressBackgroundColor="#fff"
          tintColor="#689F38"
        />}
      />
      <View style={styles.pagination}>
        <CustomButton 
        size="S"
        titleColor={currentPage === 0 ? colors.summerDark : colors.summerBlue}
        fontSize={26}
        backgroundColor={colors.summerWhite}
        onPress={handlePrevPage}
        title={"<"}/>
        <Text style={{fontFamily: 'Roboto-Black'}}>Week {groupedExercises[currentPage]?.weekNumber}</Text>
        <CustomButton
        titleColor={currentPage === groupedExercises.length - 1 ? colors.summerDark : colors.summerBlue}
        onPress={handleNextPage}
        backgroundColor={colors.summerWhite}
        size="S"
        fontSize={26}
        title={">"}
        />
        
           </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.summerWhite
  },
  pagination: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 5,
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
  swipeContainer: {
    flex: 1,
    width: "100%",
    height: '100%'
  },
});

export default React.memo(WeeklyExercises);
