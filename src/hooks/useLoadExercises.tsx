import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {Exercise} from "../types";
import {fetchExercises} from "../api/realmAPI";

export function useLoadExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadExercises();
      return () => {};
    }, []),
  );

  const loadExercises = async () => {
    const exerciseArray = await fetchExercises();
    setExercises(exerciseArray);
  };

  return exercises;
}