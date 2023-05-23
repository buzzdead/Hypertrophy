// ExerciseDetails/ExerciseDetails.tsx
import React, {useEffect, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import ExerciseDetailsContent from "./ExerciseDetailsContent";
import {fetchExerciseById, findAllDuplicateExercises} from "../../../api/realm";
import {Duplicate, Exercise} from "../../../../typings/types";
import LoadingIndicator from "../../../components/LoadingIndicator";
import AddExercise from "../AddExercise/AddExercise";
import Contingent from "../../../components/Contingent";
import {Text, View} from "react-native";
import DuplicateModal from "./DuplicateModal";
import { ExerciseSchema } from "../../../config/realm";

type Props = StackScreenProps<
  {
    Details: {exerciseId?: number; duplicates?: Duplicate[]};
    EditExercise: {exerciseId?: number};
  },
  "Details"
>;

const ExerciseDetails: React.FC<Props> = ({navigation, route}) => {
  const [exercise, setExercise] = useState<Nullable<ExerciseSchema>>(null);
  const [editExercise, setEditExercise] = useState(false);
  const [duplicateExercises, setDuplicateExercises] = useState<ExerciseSchema[]>([]);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const exerciseId = route.params.exerciseId;
    loadExercise(exerciseId);
  }, [route.params]);

  async function loadExercise(id: number | undefined) {
    if (!id) {
      return;
    }
    const fetchedExercise = await fetchExerciseById(id);
    setExercise(fetchedExercise as ExerciseSchema);
  }

  async function handleEditPress() {
    const a = await findAllDuplicateExercises(exercise!);
    if (a.length > 1) {
      setDuplicateExercises(a);
    }
    setEditExercise(true);
  }

  const onClose = () => {
    setDeleted(true);
     navigation.goBack()
  };

  const handlePressDuplicate = (exercise: Exercise) => {
    setExercise(exercise as ExerciseSchema);
    setDuplicateExercises([]);
  };

  if (deleted)
    return (
      <View style={{justifyContent: "center", alignContent: "center", width: "100%", height: "100%"}}>
        <Text style={{textAlign: "center", textAlignVertical: "center", fontSize: 34}}>Exercise Deleted</Text>
      </View>
    );

  return (
    <Contingent style={{width: "100%", height: "100%"}} shouldRender={exercise !== null}>
      <Contingent style={{width: "100%", height: "100%"}} shouldRender={editExercise}>
        <Contingent style={{width: "100%", height: "100%"}} shouldRender={duplicateExercises.length > 1}>
          <DuplicateModal
            duplicateExercises={duplicateExercises}
            onClose={() => setEditExercise(false)}
            visible={duplicateExercises.length > 1}
            onPress={(exercise: Exercise) => handlePressDuplicate(exercise)}
          />
          <AddExercise navigation={navigation} previousExercise={exercise} onClose={() => setEditExercise(false)}/>
        </Contingent>
        <ExerciseDetailsContent
          exercise={exercise!}
          onEditPress={handleEditPress}
          duplicates={route.params.duplicates}
          onClose={onClose}
        />
      </Contingent>
      <LoadingIndicator />
    </Contingent>
  );
};

export default ExerciseDetails;
