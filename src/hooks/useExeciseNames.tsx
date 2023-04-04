import { useState, useEffect } from "react";
import { fetchUniqueExerciseTypes } from "../api/realmAPI";

export function useExerciseNames(category: string) {
    const [exerciseTypes, setExerciseTypes] = useState<string[]>([])

  const loadCategories = async () => {
    const uniqueCategories = await fetchUniqueExerciseTypes(category);
    setExerciseTypes(uniqueCategories);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return useExerciseNames
}