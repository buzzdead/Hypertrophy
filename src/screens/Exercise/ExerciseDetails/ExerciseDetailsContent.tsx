import React from "react";
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Exercise } from "../../../typings/types";

interface ExerciseDetailsContentProps {
  exercise: Exercise;
  onEditPress?: () => void;
}

const ExerciseDetailsContent = ({ exercise, onEditPress }: ExerciseDetailsContentProps): React.ReactElement => {
  // Check if the exercise was created less than a day ago
  const lessThanADayAgo = (Date.now() - new Date(exercise.date).getTime()) < (24 * 60 * 60 * 1000);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.date}>{exercise.date.toLocaleDateString()}</Text>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Title: </Text>
          <Text style={styles.name}>{exercise.type?.name}</Text>
        </View>
        <Text style={styles.setsAndReps}>
          {exercise.sets} sets x {exercise.reps} reps x {exercise.weight} kg
        </Text>
        {lessThanADayAgo && (
          <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  date: {
    position: "absolute",
    top: 16,
    left: 16,
    fontSize: 16,
    color: "#757575",
  },
  content: {
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    color: "#4CAF50",
    fontFamily: "Roboto-Black"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Roboto-Thin"
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  setsAndReps: {
    fontSize: 18,
    color: "#FF5722",
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
  },
});

export default ExerciseDetailsContent;
