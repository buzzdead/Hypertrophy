import React, {useCallback, useMemo, useState} from "react";
import {SafeAreaView, StyleSheet} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {Exercise, ExerciseWithDuplicates, IGroup} from "../../../typings/types";
import {groupExercisesByWeek} from "../../utils/util";
import {useExercises} from "../../hooks/useExercises";
import WeeklyExercises from "./WeeklyExercises";
import LoadingIndicator from "../../components/LoadingIndicator";
import {useCategories} from "../../hooks/useCategories";
import {SideBar} from "../../components/SideBar";
import {CategorySchema} from "../../config/realmConfig";
import {usePanHandler} from "../../hooks/usePanHandler";
import {ExerciseListUI} from "./ExerciseListUI";

type ExeciseListProps = StackScreenProps<
  {
    List: undefined;
    Details: {exerciseId?: number};
    AddExercise: {previousExercise: Exercise | null};
  },
  "List"
>;

const ExerciseList: React.FC<ExeciseListProps> = ({navigation}) => {
  const {categories, refresh: categoriesRefresh, loading: categoriesLoading} = useCategories();
  const {exercises, refresh: exercisesRefresh, loading: exercisesLoading} = useExercises();

  const [filterExercises, setFilteredExercises] = useState<ExerciseWithDuplicates[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const _onRefresh = () => {
    categoriesRefresh();
    exercisesRefresh();
  };

  const groupedExercises: IGroup[] = useMemo(() => {
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

  const {panResponder} = usePanHandler({handlePrevPage, handleNextPage, currentPage, groupedExercises});

  if (categoriesLoading || exercisesLoading) return <LoadingIndicator />;
  console.log("rendering exerciselist123");
  return (
    <SafeAreaView style={styles.container} {...panResponder?.panHandlers}>
      <SideBar categories={categories} onFilterChange={handleFilterChange} currentPage={currentPage} />
      <WeeklyExercises
        navigation={navigation}
        onRefresh={_onRefresh}
        refreshing={exercisesLoading || categoriesLoading}
        groupedExercises={filterExercises}
      />
      <ExerciseListUI
        currentWeek={groupedExercises[currentPage]?.weekNumber}
        currentPage={currentPage}
        maxPage={groupedExercises.length - 1}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagination: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 5,
  },
});

export default ExerciseList;
