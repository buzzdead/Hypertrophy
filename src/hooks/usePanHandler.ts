import { MutableRefObject, useEffect, useRef } from "react"
import { PanResponder, PanResponderInstance } from "react-native"
import { IGroup } from "../../typings/types"
import { CategorySchema } from "../config/realm"

interface Props {
    handlePrevPage: (currentPage?: number, selectedCat?: CategorySchema[]) => void
    handleNextPage: (currentPage?: number, selectedCat?: CategorySchema[]) => void
    currentPageRef: MutableRefObject<number>
    groupedExercises: IGroup[]
    categoriesRef: MutableRefObject<CategorySchema[]>
    setIsSwipingHorizontally: (b: boolean) => void
}

export const usePanHandler = ({
  handlePrevPage,
  handleNextPage,
  groupedExercises,
  currentPageRef,
  categoriesRef,
  setIsSwipingHorizontally
}: Props) => {
  const panResponder = useRef<PanResponderInstance>();

  useEffect(() => {
    const responder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const {dx, dy} = gestureState;
        const isSwiping = Math.abs(dx) > 15;
        setIsSwipingHorizontally(isSwiping);
        return isSwiping;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 15;
      },
      onPanResponderEnd: (event, gestureState) => {
        setIsSwipingHorizontally(false);
        if (gestureState.dx > 25 && gestureState.vx > 0.25) {
          handlePrevPage(currentPageRef.current, categoriesRef.current);
        } else if (gestureState.dx < -50 && gestureState.vx < -0.5) {
          handleNextPage(currentPageRef.current, categoriesRef.current);
        }
      },
    });

    panResponder.current = responder;
  }, [groupedExercises]);

  return panResponder;
};
