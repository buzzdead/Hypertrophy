import React, {useState, useMemo, useCallback} from "react";
import {FlatList, SafeAreaView, Text, StyleSheet, View, RefreshControl} from "react-native";
import {colors, groupExercisesByWeek} from "../../utils/util";
import {Exercise, ExerciseWithDuplicates} from "../../../typings/types";
import {StackScreenProps} from "@react-navigation/stack";
import {SideBar} from "../../components/SideBar";
import {useCategories} from "../../hooks/useCategories";
import {CategorySchema} from "../../config/realmConfig";
import CustomButton from "../../components/CustomButton";
import {usePanHandler} from "../../hooks/usePanHandler";
import ExerciseItem from "./ExerciseItem";

type WeeklyExercisesProps = {
  navigation: StackScreenProps<any, "List">["navigation"];
  exercises: Exercise[];
  onRefresh: (page: number) => void;
  refreshing?: boolean;
  page?: number;
};

const WeeklyExercises: React.FC<WeeklyExercisesProps> = ({
  navigation,
  exercises: exercises,
  onRefresh,
  refreshing = false,
  page,
}) => {
  const [currentPage, setCurrentPage] = useState(page || 0);
  const categories = useCategories();
  const validCategories = categories.filter((cat) => cat.isValid());
  const [filteredExercises, setFilteredExercises] = useState<ExerciseWithDuplicates[]>(
    exercises.map(e => {
      return {exercise: e, duplicates: []};
    }),
  );

  const groupedExercises = useMemo(() => {
    const sortedExercises = [...exercises].sort((a, b) => a.date.getTime() - b.date.getTime());
    const groups = groupExercisesByWeek(sortedExercises);
    return groups;
  }, [exercises]);

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

  const {panResponder} = usePanHandler({handlePrevPage, handleNextPage, currentPage, groupedExercises});

  const handleFilterChange = useCallback(
    (selectedCategories: Optional<CategorySchema>[]) => {
      const filtered =
        selectedCategories.length === 0
          ? groupedExercises[currentPage]?.exercises
          : groupedExercises[currentPage]?.exercises?.filter(exercise =>
              selectedCategories?.some(
                selectedCategory => selectedCategory?.id === exercise.exercise.type?.category?.id,
              ),
            );

      setFilteredExercises(filtered);
    },
    [groupedExercises, currentPage],
  );

  return (
    <SafeAreaView style={styles.container} {...panResponder?.panHandlers}>
      <SideBar categories={validCategories} onFilterChange={handleFilterChange} currentPage={currentPage} />
      <FlatList
        data={filteredExercises || groupedExercises[currentPage]?.exercises || []}
        renderItem={({item}) => <ExerciseItem item={item} navigation={navigation} />}
        keyExtractor={item => item.exercise.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh(currentPage)}
            colors={["#9Bd35A", "#689F38"]}
            progressBackgroundColor="#fff"
            tintColor="#689F38"
          />
        }
      />
      <View style={styles.pagination}>
        <CustomButton
          size="S"
          titleColor={currentPage === 0 ? colors.summerDark : colors.summerBlue}
          fontSize={26}
          backgroundColor={colors.summerWhite}
          onPress={handlePrevPage}
          title={"<"}
        />
        <Text style={{fontFamily: "Roboto-Black"}}>Week {groupedExercises[currentPage]?.weekNumber}</Text>
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
    backgroundColor: colors.summerWhite,
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
});

export default React.memo(WeeklyExercises);
