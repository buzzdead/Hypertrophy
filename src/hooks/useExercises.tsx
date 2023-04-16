import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {Exercise} from "../../typings/types";
import {fetchExercises} from "../api/realmAPI";
import { ExerciseSchema } from '../config/realmConfig';


export function useExercises() {
  const [exercises, setExercises] = useState<ExerciseSchema[]>([]);
  const [loading, setLoading] = useState(true)

  const loadExercises = async () => {
    const exerciseArray = await fetchExercises();
    const validExercises = exerciseArray.filter(e => e.isValid())
    setExercises(validExercises);
    setLoading(false)
  };

  const refresh = async () => {
    setLoading(true)
    await loadExercises()
    setLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      loadExercises();
      return () => {};
    }, []),
  );

  return {exercises, loading, refresh};
}