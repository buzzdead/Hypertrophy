// ExerciseDetails/ExerciseDetails.tsx
import React, {useEffect, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {fetchExerciseById} from "../../api/realmAPI";
import {Exercise} from "../../types";
import ExerciseDetailsContent from "./ExerciseDetailsContent";
import LoadingIndicator from "./LoadingIndicator";

type Props = StackScreenProps<
  {
    Details: {exerciseId?: number};
  },
  "Details"
>;

const ExerciseDetails: React.FC<Props> = ({route}) => {
  const [exercise, setExercise] = useState<Nullable<Exercise>>(null);

  useEffect(() => {
    const {exerciseId} = route.params;
    loadExercise(exerciseId);
  }, [route.params]);

  async function loadExercise(id: number | undefined) {
    if (!id) {
      return;
    }
    const fetchedExercise = await fetchExerciseById(id);
    setExercise(fetchedExercise);
  }

  return exercise ? <ExerciseDetailsContent exercise={exercise} /> : <LoadingIndicator />;
};

export default ExerciseDetails;
