import React, {useState} from "react";
import {SafeAreaView, Text, View, StyleSheet, FlatList} from "react-native";
import {Duplicate, Exercise} from "../../../../typings/types";
import CustomButton from "../../../components/CustomButton";
import {colors} from "../../../utils/util";
import Contingent from "../../../components/Contingent";
import {deleteExercise, findAllDuplicateExercises} from "../../../api/realm";
import DuplicateModal from "./DuplicateModal";
import LoadingIndicator from "../../../components/LoadingIndicator";
import {ExerciseSchema} from "../../../config/realm";
import {useRealm} from "../../../hooks/hooks";
import { useMutations } from "../../../hooks/useMutations";

interface ExerciseDetailsContentProps {
  exercise: ExerciseSchema;
  onEditPress: () => void;
  duplicates?: Duplicate[];
  onClose: () => void;
}

const ExerciseDetailsContent = ({
  exercise,
  onEditPress,
  duplicates,
  onClose,
}: ExerciseDetailsContentProps): React.ReactElement => {
  const [loading, setLoading] = React.useState(false);
  const [currentExercise, setCurrentExercise] = useState(exercise);
  const [duplicateExercises, setDuplicateExercises] = useState<ExerciseSchema[]>([]);
  const {mutateItem} = useMutations<ExerciseSchema>(
    "Exercise",
    (item: ExerciseSchema) => deleteExercise(item as Exercise),
  );

  // Check if the exercise was created less than a day ago
  const lessThanADayAgo = React.useMemo(() => { return Date.now() - new Date(exercise.date).getTime() < 764 * 60 * 60 * 1000 }, [exercise]);

  const renderDuplicate = (duplicate: Duplicate) => {
    return (
      <Text style={styles.setsAndReps}>
        {duplicate.sets} sets x {duplicate.reps} reps x {duplicate.weight} kg
      </Text>
    );
  };

  const handleDelete = async (duplicateExercise?: Exercise) => {
    const theExercise: ExerciseSchema =
      duplicateExercise !== undefined ? (duplicateExercise as ExerciseSchema) : (exercise as ExerciseSchema);
    setLoading(true);
    setTimeout(
      async () => await mutateItem.mutateAsync({item: theExercise, action: "DEL"}).then(() =>{onClose()}),
      10,
    );
  };

  const handleDelete2 = async () => {
    if (!duplicates || duplicates?.length === 0) await handleDelete();
    else {
      const duplicateExercises = await findAllDuplicateExercises(exercise);
      setDuplicateExercises(duplicateExercises.filter(e => e.isValid()));
    }
  };

  const handlePressDuplicate = (exercise: ExerciseSchema) => {
    setCurrentExercise(exercise);
    setDuplicateExercises([]);
    handleDelete(exercise);
  };

  if (loading || !exercise.isValid()) return <LoadingIndicator />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{currentExercise.date.toLocaleDateString()}</Text>
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}></Text>
          <Text style={styles.name}>{currentExercise.type?.name}</Text>
        </View>
        <Text style={styles.setsAndReps}>
          {currentExercise.sets} sets of {currentExercise.reps} reps, with {currentExercise.weight} kg
        </Text>
        <FlatList
          data={duplicates || []}
          renderItem={({item}) => renderDuplicate(item)}
          keyExtractor={(item, id) => id.toString()}
        />
        <Contingent
          style={{gap: 10, marginTop: 10, flexDirection: "row"}}
          shouldRender={lessThanADayAgo}
          disableTernary>
          <CustomButton
            size={"M"}
            onPress={onEditPress}
            title={"Edit"}
            disabled={loading}
            backgroundColor={colors.summerDark}
            titleColor={colors.accent}
          />
          <Contingent shouldRender={duplicateExercises.length > 1}>
            <DuplicateModal
              visible={duplicateExercises.length > 1}
              onClose={() => setDuplicateExercises([])}
              onPress={exercise => handlePressDuplicate(exercise)}
              duplicateExercises={duplicateExercises}
            />
            <CustomButton
              size={"M"}
              onPress={async () => await handleDelete2()}
              title={"Delete"}
              loading={loading}
              backgroundColor={colors.summerDark}
              titleColor={colors.error}
            />
          </Contingent>
        </Contingent>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  dateContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
  },
  date: {
    fontSize: 16,
    color: "#757575",
  },
  contentWrapper: {
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginVertical: 20,
  },
  name: {
    fontSize: 24,
    color: "#4CAF50",
    fontFamily: "Roboto-Black",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Roboto-Thin",
  },
  titleContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  setsAndReps: {
    fontSize: 18,
    color: colors.summerDark,
    fontFamily: "Roboto-Medium",
  },
  editButton: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    minWidth: 100,
    textAlign: "center",
  },
});

export default ExerciseDetailsContent;
