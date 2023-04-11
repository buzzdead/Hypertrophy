// ExerciseDetails/ExerciseDetails.tsx
import React, {useEffect, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import ExerciseDetailsContent from "./ExerciseDetailsContent";
import {fetchExerciseById} from "../../../api/realmAPI";
import {Duplicate, Exercise} from "../../../../typings/types";
import LoadingIndicator from "../../../components/LoadingIndicator";
import AddExercise from "../AddExercise/AddExercise";

type Props = StackScreenProps<
  {
    Details: {exerciseId?: number; duplicates?: Duplicate[]};
    EditExercise: {exerciseId?: number};
  },
  "Details"
>;

const ExerciseDetails: React.FC<Props> = ({navigation, route}) => {
  const [exercise, setExercise] = useState<Nullable<Exercise>>(null);
  const [editExercise, setEditExercise] = useState(false);

  useEffect(() => {
    const exerciseId = route.params.exerciseId;
    loadExercise(exerciseId);
  }, [route.params]);

  async function loadExercise(id: number | undefined) {
    if (!id) {
      return;
    }
    const fetchedExercise = await fetchExerciseById(id);
    setExercise(fetchedExercise);
  }

  function handleEditPress() {
    // Navigate to the edit screen with the exercise ID as a parameter
    setEditExercise(true);
  }

  return exercise ? (
    editExercise ? (
      <AddExercise navigation={navigation} previousExercise={exercise} />
    ) : (
      <ExerciseDetailsContent exercise={exercise} onEditPress={handleEditPress} duplicates={route.params.duplicates} />
    )
  ) : (
    <LoadingIndicator />
  );
};

export default ExerciseDetails;
