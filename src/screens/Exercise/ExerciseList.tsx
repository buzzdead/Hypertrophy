import React, {useEffect, useRef, useState} from "react";
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

interface State {
  filteredExercises: ExerciseWithDuplicates[]
  currentPage: number
  seleectedCategories: CategorySchema[]
}

const ExerciseList: React.FC<ExeciseListProps> = ({navigation}) => {
  const {categories, refresh: categoriesRefresh, loading: categoriesLoading} = useCategories();
  const {exercises, refresh: exercisesRefresh, loading: exercisesLoading} = useExercises();
  const [groupedExercises, setGroupedExercises] = useState<IGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState<State>({filteredExercises: [], currentPage: 0, seleectedCategories: []})
  const currentPageRef = useRef(state.currentPage)

  const _onRefresh = () => {
    categoriesRefresh();
    exercisesRefresh();
  };

  useEffect(() => {
    const groups = groupExercisesByWeek(exercises);
    if(groupedExercises.length > groups.length) handlePrevPage()
    setGroupedExercises(groups)
  }, [exercises]);

  useEffect(() => {
    _onRefresh()
  }, [])

  const handleNextPage = (currentPage?: number) => {
    const newCurrent = typeof currentPage === 'number' ? currentPage : state.currentPage
    if (newCurrent < groupedExercises.length - 1) {
      const filtered = updateFilteredExercises(newCurrent + 1)
      setState({...state, filteredExercises: filtered, currentPage: newCurrent + 1})
    }
  };

  const handlePrevPage = (currentPage?: number) => {
    const newCurrent = typeof currentPage === 'number' ? currentPage : state.currentPage
    if (newCurrent > 0) {
      const filtered = updateFilteredExercises(newCurrent - 1)
      setState({...state, filteredExercises: filtered, currentPage: newCurrent - 1})
    }
  };

  const handleGoToLastPage = () => {
    const filtered = updateFilteredExercises(groupedExercises.length - 1)
    setState({...state, filteredExercises: filtered, currentPage: groupedExercises.length - 1})
  }

  const handleGoToFirstPage = () => {
    const filtered = updateFilteredExercises(0)
    setState({...state, filteredExercises: filtered, currentPage: 0})
  }

  const updateFilteredExercises = (cPage: number, currentSelectedCategories?: CategorySchema[]) => {
    const newCategories = currentSelectedCategories ? currentSelectedCategories : state.seleectedCategories
    const filtered =
    newCategories.length === 0
      ? groupedExercises[cPage]?.exercises
      : groupedExercises[cPage]?.exercises?.filter(exercise =>
          newCategories?.some(
            selectedCategory => selectedCategory?.id === exercise.exercise.type?.category?.id,
          ),
        );

  return filtered
  }

  useEffect(() => {
    if(groupedExercises.length === 0) return
    loading && setLoading(false)
    setState({...state, filteredExercises: updateFilteredExercises(state.currentPage)})
  }, [groupedExercises])

  // Nake selectedCategories a state... Then when flipping pages just filter directly instead of useEffect in sidebar!
  const handleFilterChange = (selected: CategorySchema[]) => {
    const filtered = updateFilteredExercises(state.currentPage, selected)
    setState({...state, seleectedCategories: selected, filteredExercises: filtered})
  }

  useEffect(() => {
    currentPageRef.current = state.currentPage
  }, [state.currentPage])

  const {panResponder} = usePanHandler({handlePrevPage, handleNextPage, categories: state.seleectedCategories, currentPageRef, groupedExercises: groupedExercises});

  if (categoriesLoading || exercisesLoading || loading) return <LoadingIndicator />;
  console.log("rendering exerciselisasdft")
  return (
    <SafeAreaView style={styles.container} {...panResponder?.panHandlers}>
      <SideBar categories={categories} onFilterChange={handleFilterChange} />
      <WeeklyExercises
        navigation={navigation}
        onRefresh={_onRefresh}
        refreshing={exercisesLoading || categoriesLoading}
        groupedExercises={state.filteredExercises}
      />
      <ExerciseListBtm
        currentWeek={groupedExercises[state.currentPage]?.weekNumber}
        currentPage={state.currentPage}
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
