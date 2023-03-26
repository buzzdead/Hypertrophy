import React, {useState} from "react";
import {
  Button,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {fetchExercises} from "../api/realmAPI";
import {Exercise} from "../types";
import {StackNavigationProp, StackScreenProps} from "@react-navigation/stack";
import {useFocusEffect} from "@react-navigation/native";

type Props = StackScreenProps<
  {
    List: undefined;
    Details: {exerciseId?: number};
  },
  "List"
> & {
  navigation: any;
};

const renderItem = (
  {item}: {item: Exercise},
  navigation: StackNavigationProp<
    {List: undefined; Details: {exerciseId?: number}},
    "List"
  >,
) => {
  if (!item) {
    return null;
  }
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("Details", {exerciseId: item.id})}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemText}>
        {item.sets} sets x {item.reps} reps
      </Text>
    </TouchableOpacity>
  );
};

const ExerciseList: React.FC<Props> = ({navigation}) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadExercises();

      // Cleanup function
      return () => {};
    }, []),
  );

  async function loadExercises() {
    const exerciseArray = await fetchExercises();
    setExercises(exerciseArray);
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={exercises}
        renderItem={item => renderItem(item, navigation)}
        keyExtractor={item => item.id.toString()}
      />
      <Button
        title="Add Exercise"
        onPress={() => navigation.navigate("AddExercise")}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  itemText: {
    fontSize: 16,
  },
});

export default ExerciseList;
