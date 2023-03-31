import React from "react";
import { SafeAreaView, Text, View, StyleSheet } from "react-native";
import { Exercise } from "../../types";

interface ExerciseDetailsContentProps {
  exercise: Exercise;
}

const ExerciseDetailsContent = ({ exercise }: ExerciseDetailsContentProps): React.ReactElement => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.date}>{exercise.date.toLocaleDateString()}</Text>
    <View style={styles.content}>
    <View style={styles.titleContainer}>
    <Text style={styles.title}>Title: </Text>
    <Text style={styles.name}>{exercise.name}</Text>
    </View>
      <Text style={styles.setsAndReps}>
        {exercise.sets} sets x {exercise.reps} reps
      </Text>
    </View>
  </SafeAreaView>
);

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
});

export default ExerciseDetailsContent;
