import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Exercise } from '../types';
import { colors } from '../utils/util';
import { useExercises } from '../hooks/useExercises';
import { SideBar } from './SideBar';
import { fetchUniqueCategories } from '../api/realmAPI';
import { useCategories } from '../hooks/useCategories';

type Props = StackScreenProps<
  {
    List: undefined;
    Details: { exerciseId?: number };
    AddExercise: undefined;
  },
  'List'
>;

const ExerciseList: React.FC<Props> = ({ navigation }) => {
  const exercises = useExercises();
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>();
  const categories = useCategories()


  const handleFilterChange = (selectedCategories: string[]) => {
    if (selectedCategories.length === 0) {
      setFilteredExercises(exercises);
    } else {
      setFilteredExercises(
        exercises.filter((exercise) => selectedCategories.includes(exercise.category)),
      );
    }
  };

  const renderItem = (
    { item }: { item: Exercise; index: number },
    navigation: StackScreenProps<any, 'List'>['navigation'],
  ) => {
    if (!item) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Details', { exerciseId: item.id })}
      >
        <View style={{ flexDirection: 'column', width: '100%', gap: 15 }}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <Text style={{ ...styles.itemText, color: colors.accent }}>{item.name.toUpperCase()}</Text>
          <Text style={{fontStyle: 'italic', color: colors.secondary}}>{item.date.toLocaleDateString()}</Text>
          </View>
          <Text style={styles.itemText}>Category: {item.category}</Text>
          <Text style={styles.itemText}>
            Result: {item.sets} sets x {item.reps} reps
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredExercises}
        renderItem={(item) => renderItem(item, navigation)}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="Add Exercise" onPress={() => navigation.navigate('AddExercise')} />
      <SideBar categories={categories} onFilterChange={handleFilterChange} />
</SafeAreaView>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
backgroundColor: colors.background,
},
item: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
paddingHorizontal: 16,
paddingVertical: 12,
borderBottomWidth: 1,
borderBottomColor: colors.primary,
width: '100%',
},
itemText: {
fontSize: 16,
},
});

export default ExerciseList;