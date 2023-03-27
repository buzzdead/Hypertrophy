import React, {useState} from "react";
import {Button, FlatList, SafeAreaView, Text, TouchableOpacity, StyleSheet, View} from "react-native";
import {fetchExercises} from "../api/realmAPI";
import {Exercise} from "../types";
import {StackNavigationProp, StackScreenProps} from "@react-navigation/stack";
import {useFocusEffect} from "@react-navigation/native";
import { colors } from "../utils/util";

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
  {item}: {item: Exercise; index: number},
  navigation: StackNavigationProp<{List: undefined; Details: {exerciseId?: number}}, "List">,
) => {
  if (!item) {
    return null;
  }
  return (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("Details", {exerciseId: item.id})}>
      <View style={{flexDirection: 'column', width: "100%", gap: 15}}>
      <Text style={{...styles.itemText, color: colors.accent}}>{item.name}</Text>
      <Text style={styles.itemText}>Category: {item.category}</Text>
      <Text style={styles.itemText}>
        Result: {item.sets} sets x {item.reps} reps
      </Text>
      </View>
    </TouchableOpacity>
  );
};


const ExerciseList: React.FC<Props> = ({navigation}) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadExercises();
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
      <Button title="Add Exercise" onPress={() => navigation.navigate("AddExercise")} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    width: "100%",
  },
  itemText: {
    fontSize: 16,
  },
});

export default ExerciseList;
