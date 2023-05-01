import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {fetchExercises} from "../api/realmAPI";
import { ExerciseSchema } from '../config/realmConfig';


export function useExercises(limitBy?: {by: 'Month', when: number} ) {
  const [exercises, setExercises] = useState<ExerciseSchema[]>([]);
  const [loading, setLoading] = useState(true)

  const loadExercises = async () => {
    const exerciseArray = limitBy ? await fetchExercises(limitBy) : await fetchExercises();
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