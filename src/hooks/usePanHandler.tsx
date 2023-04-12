import { useEffect, useState } from "react"
import { PanResponder, PanResponderInstance } from "react-native"
import { IGroup } from "../../typings/types"

interface Props {
    handlePrevPage: () => void
    handleNextPage: () => void
    currentPage: number
    groupedExercises: IGroup[]

}

export const usePanHandler = ({handlePrevPage, handleNextPage, currentPage, groupedExercises}: Props) => {
    const [panResponder, setPanResponder] = useState<PanResponderInstance>()

    useEffect(() => {
        const responder = PanResponder.create({
          onMoveShouldSetPanResponder: (evt, gestureState) => {
            const {dx, dy} = gestureState;
            return Math.abs(dx) > 25 && Math.abs(dx) > Math.abs(dy)
          },
          onPanResponderEnd: (event, gestureState) => {
            if (gestureState.dx > 50 && gestureState.vx > 0.5) {
              handlePrevPage();
            } else if (gestureState.dx < -50 && gestureState.vx < -0.5) {
              handleNextPage();
            }
          },
        });
        setPanResponder(responder);
      }, [currentPage, groupedExercises]);

      return {panResponder}
}