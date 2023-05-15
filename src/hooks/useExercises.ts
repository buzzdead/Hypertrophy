import * as React from 'react'
import {
    fetchExercisesAsync,
    productSelectors,
} from '../store/exerciseSlice'
import { useAppSelector, useAppDispatch } from '../store/store'

export default function useExercises() {
  const exercises = useAppSelector(productSelectors.selectAll)
  const { exercisesLoaded } = useAppSelector(
    (state) => state.exercise,
  )
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    if (!exercisesLoaded) dispatch(fetchExercisesAsync())
  }, [exercisesLoaded, dispatch])

  return {
    exercises
  }
}