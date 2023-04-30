import { useFocusEffect } from "@react-navigation/native";
import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchExerciseTypes, fetchExerciseTypesByCategory } from "../api/realmAPI";
import { CategorySchema, ExerciseTypeSchema } from "../config/realmConfig";

interface Props {
  category: Nullable<CategorySchema>
  showAll?: boolean

}

export function useExerciseTypes({category, showAll}: Props) {
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseTypeSchema[]>([]);

  const loadCategories = async () => {
    if(showAll) {const types = await fetchExerciseTypes(); setExerciseTypes(types); return;}
    if (category === null) return;
    const exerciseTypes = await fetchExerciseTypesByCategory(category?.id);
    setExerciseTypes(exerciseTypes);
  };

  const refresh = async () => {
    await loadCategories()
  }

  useFocusEffect(
    useCallback(() => {
      loadCategories();
      return () => {};
    }, [category]),
  );

  // Memoize the result based on the category dependency
  const memoizedExerciseTypes = useMemo(() => exerciseTypes, [exerciseTypes]);

  return {memoizedExerciseTypes, refresh};
}