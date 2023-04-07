import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {Exercise} from "../../typings/types";
import {fetchExercises} from "../api/realmAPI";

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const loadExercises = async () => {
    const exerciseArray = await fetchExercises();
    setExercises(exerciseArray);
  };

  const refresh = () => {
    loadExercises()
  }

  useFocusEffect(
    useCallback(() => {
      loadExercises();
      return () => {};
    }, []),
  );

  return {exercises, refresh};
}