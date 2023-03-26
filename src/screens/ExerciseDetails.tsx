import React, {useEffect, useState} from "react";
import {SafeAreaView, Text} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {fetchExerciseById} from "../api/realmAPI";
import {Exercise} from "../types";

type Props = StackScreenProps<
  {
    Details: {exerciseId?: number};
  },
  "Details"
>;

const ExerciseDetails: React.FC<Props> = ({route}) => {
  const [exercise, setExercise] = useState<Exercise | null>();

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

  if (!exercise) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text>{exercise.name}</Text>
      <Text>
        {exercise.sets} sets x {exercise.reps} reps
      </Text>
    </SafeAreaView>
  );
};

export default ExerciseDetails;
