import React from "react";
import {Text, TouchableOpacity, View, FlatList, StyleSheet} from "react-native";
import {Duplicate, ExerciseWithDuplicates} from "../../../typings/types";
import {colors} from "../../utils/util";
import {StackScreenProps} from "@react-navigation/stack";

type ExerciseItemProps = {
  item: ExerciseWithDuplicates;
  navigation: StackScreenProps<any, "List">["navigation"];
};

const ExerciseItem: React.FC<ExerciseItemProps> = ({item, navigation}) => {
  const renderDuplicate = (duplicate: Duplicate) => {
    return (
      <Text style={styles.itemText2}>
        <Text style={{color: colors.test6}}>Sets: </Text>
        {duplicate.sets} <Text style={{color: colors.test6}}>Reps: </Text>
        {duplicate.reps} <Text style={{color: colors.test6}}>Weight: </Text>
        {duplicate.weight} kg
      </Text>
    );
  };

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("Details", {exerciseId: item.exercise.id, duplicates: item.duplicates})}>
      <View style={{flexDirection: "column", width: "100%"}}>
        <View style={{justifyContent: "space-between", flexDirection: "row"}}>
          <Text style={{...styles.itemText, fontSize: 18, color: colors.test6}}>{item.exercise.type?.name}</Text>
          <Text style={{fontStyle: "italic", color: colors.test6}}>{item.exercise.date.toLocaleDateString()}</Text>
        </View>
        <Text style={[styles.itemText, {color: colors.summerDarkest, marginBottom: 15, marginTop: 15}]}>
          Category: <Text style={styles.itemText2}>{item.exercise.type?.category?.name}</Text>
        </Text>
        <Text style={styles.itemText2}>
          <Text style={{color: colors.test6}}>Sets: </Text>
          {item.exercise.sets} <Text style={{color: colors.test6}}>Reps: </Text>
          {item.exercise.reps} <Text style={{color: colors.test6}}>Weight: </Text>
          {item.exercise.weight} kg
        </Text>
        <FlatList
          data={item.duplicates || []}
          renderItem={({item}) => renderDuplicate(item)}
          keyExtractor={(item, id) => id.toString()}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.test3,
    width: "100%",
  },
  itemText: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
  itemText2: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: colors.test5,
  },
})

export default ExerciseItem;
