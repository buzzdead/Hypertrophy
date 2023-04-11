import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {Exercise} from "../../typings/types";
import {fetchExercises} from "../api/realmAPI";


export function useExercises(finishLoading?: (loading: boolean) => void) {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const loadExercises = async () => {
    const exerciseArray = await fetchExercises();
    setExercises(exerciseArray);
  };

  const refresh = async () => {
    await loadExercises()
    finishLoading && finishLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      loadExercises();
      finishLoading && finishLoading(false)
      return () => {};
    }, []),
  );

  return {exercises, refresh};
}