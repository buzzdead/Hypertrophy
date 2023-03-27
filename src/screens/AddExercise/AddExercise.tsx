import React, {useEffect, useState} from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {addExercise, fetchUniqueCategories} from "../../api/realmAPI";
import {Exercise} from "../../types";
import NumberInput from "../../components/NumberInput";
import CategoryInput from "./CategoryInput";
import CategoryPicker from "./CategoryPicker";

type Props = {
  navigation: any;
};

const AddExercise: React.FC<Props> = ({navigation}) => {
  const [name, setName] = useState("");
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [category, setCategory] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  async function handleAddExercise() {
    const exercise: Exercise = {
      id: 0,
      name,
      sets: sets,
      reps: reps,
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

  function togglePicker() {
    setPickerVisible(!pickerVisible);
  }

  const renderNumberInput = (title: string, onChange: (value: number) => void) => {
    return (
      <View style={styles.inputContainer}>
      <Text style={styles.touchFieldLabel}>{title}</Text>
      <NumberInput value={sets} onChange={onChange} />
    </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginBottom: 16}}>
        <Text style={styles.textFieldLabel}>Category:</Text>
        <CategoryInput value={category} onChangeText={setCategory} onPickerToggle={togglePicker}/>
      </View>
      <View style={{marginBottom: 16}}>
        <Text style={styles.textFieldLabel}>Name:</Text>
        <TextInput style={styles.input} onChangeText={setName} value={name} placeholder="Enter exercise name" />
      </View>
      <View style={{flexDirection: "row", gap: 5}}>
        {renderNumberInput("Sets:", setSets)}
        {renderNumberInput("Reps:", setReps)}
      </View>
      <Button title="Add" onPress={handleAddExercise} />
      <CategoryPicker visible={pickerVisible} categories={categories} onSelect={setCategory} onClose={togglePicker} />
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
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  textFieldLabel: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  touchFieldLabel: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    padding: 6,
    paddingRight: 10,
  },
  input: {
    borderColor: "#BDBDBD",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
  },
});

export default AddExercise;
