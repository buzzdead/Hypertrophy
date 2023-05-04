import { MutableRefObject, useEffect, useRef, useState } from "react"
import { PanResponder, PanResponderInstance } from "react-native"
import { ExerciseWithDuplicates, IGroup } from "../../typings/types"
import { CategorySchema } from "../config/realmConfig"

interface Props {
    handlePrevPage: (currentPage?: number, selectedCat?: CategorySchema[]) => void
    handleNextPage: (currentPage?: number, selectedCat?: CategorySchema[]) => void
    currentPageRef: MutableRefObject<number>
    groupedExercises: IGroup[]
    categoriesRef: MutableRefObject<CategorySchema[]>

}

export const usePanHandler = ({handlePrevPage, handleNextPage, groupedExercises, currentPageRef, categoriesRef}: Props) => {
    const panResponder = useRef<PanResponderInstance>()

    useEffect(() => {
        const responder = PanResponder.create({
          onMoveShouldSetPanResponder: (evt, gestureState) => {
            const {dx, dy} = gestureState;
            return Math.abs(dx) > 25 && Math.abs(dx) > Math.abs(dy)
          },
          onPanResponderEnd: (event, gestureState) => {
            if (gestureState.dx > 50 && gestureState.vx > 0.5) {
              handlePrevPage(currentPageRef.current, categoriesRef.current);
            } else if (gestureState.dx < -50 && gestureState.vx < -0.5) {
              handleNextPage(currentPageRef.current, categoriesRef.current);
            }
          },
        });
          panResponder.current = responder
      }, [groupedExercises]);

      return panResponder
}