import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {SafeAreaView, StyleSheet, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {Exercise, ExerciseWithDuplicates, IGroup} from "../../../typings/types";
import {groupExercisesByWeek} from "../../utils/util";
import WeeklyExercises from "./WeeklyExercises";
import LoadingIndicator from "../../components/LoadingIndicator";
import {usePanHandler, useRealm} from "../../hooks/hooks";
import {SideBar} from "../../components/SideBar";
import {CategorySchema, ExerciseSchema} from "../../config/realm";
import {ExerciseListBtm} from "./ExerciseListBtm";
import {useScreenOrientation} from "../../hooks/useScreenOrientation";
import {useIsFocused} from "@react-navigation/native";
import {useFocus} from "../../hooks/useFocus";

type ExeciseListProps = StackScreenProps<
  {
    List: undefined;
    Details: {exerciseId?: number};
    AddExercise: {previousExercise: Exercise | null};
  },
  "List"
>;

interface State {
  filteredExercises: ExerciseWithDuplicates[];
  currentPage: number;
  seleectedCategories: CategorySchema[];
  groupedExercises: IGroup[];
}

const ExerciseList: React.FC<ExeciseListProps> = ({navigation}) => {
  const {data: categories, loading: categoriesLoading} = useRealm<CategorySchema>({schemaName: "Category"});
  const {data: exercises, loading: exercisesLoading} = useRealm<ExerciseSchema>({schemaName: "Exercise"});
  const screenOrientation = useScreenOrientation();
  const isFocused = useFocus();

  const [state, setState] = useState<State>({
    filteredExercises: [],
    currentPage: 0,
    seleectedCategories: [],
    groupedExercises: [],
  });
  const currentPageRef = useRef(state.currentPage);
  const categoriesRef = useRef(state.seleectedCategories);

  const handleNextPage = (currentPage?: number, selectedCat?: CategorySchema[]) => {
    const newCurrent = typeof currentPage === "number" ? currentPage : state.currentPage;
    if (newCurrent < state.groupedExercises.length - 1) {
      const filtered = updateFilteredExercises(newCurrent + 1, selectedCat);
      setState({...state, filteredExercises: filtered, currentPage: newCurrent + 1});
    }
  };

  const handlePrevPage = (currentPage?: number, selectedCat?: CategorySchema[]) => {
    const newCurrent = typeof currentPage === "number" ? currentPage : state.currentPage;
    if (newCurrent > 0) {
      const filtered = updateFilteredExercises(newCurrent - 1, selectedCat);
      setState({...state, filteredExercises: filtered, currentPage: newCurrent - 1});
    }
  };

  const handleGoToLastPage = () => {
    const filtered = updateFilteredExercises(state.groupedExercises.length - 1, categoriesRef.current);
    setState({...state, filteredExercises: filtered, currentPage: state.groupedExercises.length - 1});
  };

  const handleGoToFirstPage = () => {
    const filtered = updateFilteredExercises(0, categoriesRef.current);
    setState({...state, filteredExercises: filtered, currentPage: 0});
  };

  const updateFilteredExercises = (cPage: number, currentSelectedCategories?: CategorySchema[], groups?: IGroup[]) => {
    const newCategories = currentSelectedCategories ? currentSelectedCategories : state.seleectedCategories;

    const newGroups = groups ? groups : state.groupedExercises;
    const filtered =
      newCategories.length === 0
        ? newGroups[cPage]?.exercises
        : newGroups[cPage]?.exercises?.filter(exercise =>
            newCategories?.some(selectedCategory => selectedCategory?.id === exercise.exercise.type?.category?.id),
          );

    return filtered;
  };

  const handleFilterChange = (selected: CategorySchema[]) => {
    const filtered = updateFilteredExercises(state.currentPage, selected);
    categoriesRef.current = selected;
    setState({...state, seleectedCategories: selected, filteredExercises: filtered});
  };

  useLayoutEffect(() => {
    if (categoriesLoading || exercisesLoading) return;
    console.log("useefect1")
    currentPageRef.current = state.currentPage;
  }, [state.currentPage]);

  useLayoutEffect(() => {
    if (categoriesLoading) return;
    console.log("useefect2")
    const groups = groupExercisesByWeek(exercises, true);
    if (state.groupedExercises.length > groups.length) handlePrevPage();
    setState({
      ...state,
      groupedExercises: groups,
      filteredExercises: updateFilteredExercises(state.currentPage, state.seleectedCategories, groups),
    });
  }, [exercises]);

  // Figure out a way to fix rerendering cause of this
  const panResponder = usePanHandler({
    handlePrevPage,
    handleNextPage,
    groupedExercises: state.groupedExercises,
    currentPageRef,
    categoriesRef,
  });
  console.log("rendering exerciselist PRE ");
  if (categoriesLoading || exercisesLoading || !isFocused.current)
    return (
      <View style={{width: "100%", height: "100%"}}>
        <LoadingIndicator />
      </View>
    );
  console.log("rendering exerciselist");

  return (
    <SafeAreaView style={styles.container} {...panResponder?.current?.panHandlers}>
      <SideBar
        isLandScape={screenOrientation.isLandscape}
        categories={categories}
        icon="filter-variant"
        onFilterChange={handleFilterChange}
      />
      <WeeklyExercises navigation={navigation} groupedExercises={state.filteredExercises} />
      <ExerciseListBtm
        currentWeek={state.groupedExercises[state.currentPage]?.weekNumber}
        currentPage={state.currentPage}
        maxPage={state.groupedExercises.length - 1 > 0 ? state.groupedExercises.length - 1 : 0}
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
