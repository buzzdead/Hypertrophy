import React, {useEffect, useState} from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {addExercise, fetchUniqueCategories} from "../api/realmAPI";
import {Exercise} from "../types";
import Picker from "@ouroboros/react-native-picker";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons/faCaretDown";
import NumberInput from "../components/NumberInput";

type Props = {
  navigation: any;
};

const AddExercise: React.FC<Props> = ({navigation}) => {
  const [name, setName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  async function handleAddExercise() {
    const exercise: Exercise = {
      id: 0,
      name,
      sets: parseInt(sets),
      reps: parseInt(reps),
      date: new Date(),
      category,
    };
    await addExercise(exercise);
    navigation.goBack();
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const uniqueCategories = await fetchUniqueCategories();
    setCategories(uniqueCategories);
  }

  function PickerDisplay() {
    return (
      <View>
        <FontAwesomeIcon icon={faCaretDown} size={20} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category:</Text>
        <View style={styles.categoryContainer}>
          <TextInput
            style={[styles.input, styles.categoryInput]}
            onChangeText={setCategory}
            value={category}
            placeholder="Enter exercise category"
          />
          <Picker
            component={PickerDisplay}
            onChanged={setCategory}
            options={categories
              .filter(
                category =>
                  category !== "newcategory" && category !== "default",
              )
              .map(category => ({
                value: category,
                text: category,
              }))}
            style={styles.categoryPicker}
            value={category}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="Enter exercise name"
        />
      </View>
      <View style={{flexDirection: "row", paddingLeft: 50, gap: 50}}>
        <View style={[styles.inputContainer, {marginRight: 10}]}>
          <Text style={styles.label}>Sets:</Text>
          <NumberInput value={sets} onChange={setSets} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reps:</Text>
          <NumberInput value={reps} onChange={setReps} />
        </View>
      </View>
      <Button title="Add" onPress={handleAddExercise} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    borderColor: "#BDBDBD",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryInput: {
    flex: 1,
    marginRight: 8,
  },
  categoryPicker: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "#F2F2F2",
  },
  pickerContainer: {
    position: "absolute",
    top: 44,
    right: 0,
    width: 150,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 4,
    backgroundColor: "white",
    zIndex: 1,
  },
});

export default AddExercise;
