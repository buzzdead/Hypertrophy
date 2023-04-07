// screens/Settings.tsx
import React from "react";
import {Button, SafeAreaView, ScrollView, Text, View} from "react-native";
import { deleteCategory, deleteExerciseType } from "../../api/realmAPI";
import { CategorySchema, ExerciseTypeSchema } from "../../config/realmConfig";
import { useCategories } from "../../hooks/useCategories";
import { useExerciseTypes } from "../../hooks/useExerciseTypes";

const Settings = () => {
  const categories = useCategories()
  const exerciesTypes = useExerciseTypes({category: null, showAll: true})
  const handleDelete = (c: CategorySchema | ExerciseTypeSchema) => {
    c instanceof CategorySchema ? deleteCategory(c) : deleteExerciseType(c)
  }
  return (
    <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <ScrollView >
      <Text>Settings Screen</Text>
      {categories.map(c => {
        return <View style={{flexDirection: 'row'}}><Text style={{minWidth: 150}}>{c.name}</Text><Button title={'delete category'} onPress={() => handleDelete(c)} /></View>
      })}
       {exerciesTypes.map(c => {
        return <View style={{flexDirection: 'row'}}><Text style={{minWidth: 150}}>{c.name}</Text><Button title={'delete exercisetype'} onPress={() => handleDelete(c)} /></View>
      })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
