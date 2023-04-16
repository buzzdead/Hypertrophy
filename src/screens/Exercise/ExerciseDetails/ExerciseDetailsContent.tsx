import React from "react";
import {SafeAreaView, Text, View, StyleSheet, FlatList} from "react-native";
import {Duplicate, Exercise} from "../../../../typings/types";
import CustomButton from "../../../components/CustomButton";
import {colors} from "../../../utils/util";
import Contingent from "../../../components/Contingent";
import { deleteExercise } from "../../../api/realmAPI";

interface ExerciseDetailsContentProps {
  exercise: Exercise;
  onEditPress: () => void;
  duplicates?: Duplicate[];
  onClose: () => void
}

const ExerciseDetailsContent = ({
  exercise,
  onEditPress,
  duplicates,
  onClose
}: ExerciseDetailsContentProps): React.ReactElement => {
  const [loading, setLoading] = React.useState(false)
  // Check if the exercise was created less than a day ago
  const lessThanADayAgo = Date.now() - new Date(exercise.date).getTime() < 24 * 60 * 60 * 1000;

  const renderDuplicate = (duplicate: Duplicate) => {
    return (
      <Text style={styles.setsAndReps}>
        {duplicate.sets} sets x {duplicate.reps} reps x {duplicate.weight} kg
      </Text>
    );
  };

  const handleDelete = async () => {
    setLoading(true)
    setTimeout(async () => await deleteExercise(exercise).then(() => onClose()), 1000)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{exercise.date.toLocaleDateString()}</Text>
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}></Text>
          <Text style={styles.name}>{exercise.type?.name}</Text>
        </View>
        <Text style={styles.setsAndReps}>
          {exercise.sets} sets of {exercise.reps} reps, with {exercise.weight} kg
        </Text>
        <FlatList
          data={duplicates || []}
          renderItem={({item}) => renderDuplicate(item)}
          keyExtractor={(item, id) => id.toString()}
        />
        <Contingent style={{gap: 10, marginTop: 10, flexDirection: 'row'}} shouldRender={lessThanADayAgo} disableTernary>
          <CustomButton size={"M"} onPress={onEditPress} title={"Edit"} backgroundColor={colors.summerDark} titleColor={colors.accent}/>
          <CustomButton size={"M"} onPress={async () => await handleDelete()} title={"Delete"} loading={loading} backgroundColor={colors.summerDark} titleColor={colors.error}/>
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
