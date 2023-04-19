import React, {useCallback, useEffect, useState} from "react";
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
import {ExerciseListBtm} from "./ExerciseListBtm";

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
  const [groupedExercises, setGroupedExercises] = useState<IGroup[]>([])

  const [filterExercises, setFilteredExercises] = useState<ExerciseWithDuplicates[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const _onRefresh = () => {
    categoriesRefresh();
    exercisesRefresh();
  };

  useEffect(() => {
    const sortedExercises = [...exercises].sort((a, b) => a.date.getTime() - b.date.getTime());
    const groups = groupExercisesByWeek(sortedExercises);
    setGroupedExercises(groups)
  }, [exercises]);

  useEffect(() => {
    _onRefresh()
  }, [])

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

  const handleGoToLastPage = () => {
    setCurrentPage(groupedExercises.length - 1)
  }

  const handleGoToFirstPage = () => {
    setCurrentPage(0)
  }

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
  console.log("rendering exerciselisasdft")
  return (
    <SafeAreaView style={styles.container} {...panResponder?.panHandlers}>
      <SideBar categories={categories} onFilterChange={handleFilterChange} currentPage={currentPage} />
      <WeeklyExercises
        navigation={navigation}
        onRefresh={_onRefresh}
        refreshing={exercisesLoading || categoriesLoading}
        groupedExercises={filterExercises}
      />
      <ExerciseListBtm
        currentWeek={groupedExercises[currentPage]?.weekNumber}
        currentPage={currentPage}
        maxPage={groupedExercises.length - 1}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleGoToLastPage={handleGoToLastPage}
        handleGoToFirstPage={handleGoToFirstPage}
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
