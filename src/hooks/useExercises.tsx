import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {Exercise} from "../types";
import {fetchExercises} from "../api/realmAPI";

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const loadExercises = async () => {
    const exerciseArray = await fetchExercises();
    setExercises(exerciseArray);
  };

  useFocusEffect(
    useCallback(() => {
      loadExercises();
      return () => {};
    }, []),
  );

  return exercises;
}