import { MutableRefObject, useEffect, useState } from "react"
import { PanResponder, PanResponderInstance } from "react-native"
import { ExerciseWithDuplicates, IGroup } from "../../typings/types"
import { CategorySchema } from "../config/realmConfig"

interface Props {
    handlePrevPage: (currentPage?: number) => void
    handleNextPage: (currentPage?: number) => void
    currentPageRef: MutableRefObject<number>
    groupedExercises: IGroup[]
    categories: CategorySchema[]

}

export const usePanHandler = ({handlePrevPage, handleNextPage, categories, groupedExercises, currentPageRef}: Props) => {
    const [panResponder, setPanResponder] = useState<PanResponderInstance>()

    useEffect(() => {
        const responder = PanResponder.create({
          onMoveShouldSetPanResponder: (evt, gestureState) => {
            const {dx, dy} = gestureState;
            return Math.abs(dx) > 25 && Math.abs(dx) > Math.abs(dy)
          },
          onPanResponderEnd: (event, gestureState) => {
            if (gestureState.dx > 50 && gestureState.vx > 0.5) {
              handlePrevPage(currentPageRef.current);
            } else if (gestureState.dx < -50 && gestureState.vx < -0.5) {
              handleNextPage(currentPageRef.current);
            }
          },
        });
        setPanResponder(responder);
      }, [categories, groupedExercises]);

      return panResponder
}