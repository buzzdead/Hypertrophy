// ExerciseDetails/ExerciseDetails.tsx
import React, {useEffect, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import ExerciseDetailsContent from "./ExerciseDetailsContent";
import {fetchExerciseById} from "../../../api/realmAPI";
import {Duplicate, Exercise} from "../../../../typings/types";
import LoadingIndicator from "../../../components/LoadingIndicator";
import AddExercise from "../AddExercise/AddExercise";
import Contingent from "../../../components/Contingent";
import { Text, View } from "react-native";

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
  const [deleted, setDeleted] = useState(false)

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
    setEditExercise(true);
  }

  const onClose = () => {
    setDeleted(true)
    setTimeout(() => navigation.goBack(), 1000)
  }

  if(deleted) return <View style={{justifyContent: 'center', alignContent: 'center'}}><Text style={{textAlign: 'center'}}>Exercise Deleted</Text></View>

  return (
    <Contingent style={{width: '100%', height: '100%'}} shouldRender={exercise !== null}>
      <Contingent style={{width: '100%', height: '100%'}} shouldRender={editExercise}>
      <AddExercise navigation={navigation} previousExercise={exercise} />
      <ExerciseDetailsContent exercise={exercise!} onEditPress={handleEditPress} duplicates={route.params.duplicates} onClose={onClose}/>
      </Contingent>
      <LoadingIndicator />
    </Contingent>
  )
}

export default ExerciseDetails;
