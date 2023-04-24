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
      <View style={{flexDirection: "row"}}>
        <View >
          <Text style={{...styles.itemText2, color: colors.summerDarkest}}>{duplicate.sets + " x "}</Text>
        </View>
        <View style={{minWidth: 95}}>
          <Text style={{...styles.itemText2, color: colors.summerDarkest}}>{duplicate.reps + " repetitions"}</Text>
        </View>
        <View>
          <Text style={{...styles.itemText2, color: colors.summerDarkest, fontFamily: 'Roboto-Medium'}}>{" (" + duplicate.weight} kg{")"}</Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("Details", {exerciseId: item.exercise.id, duplicates: item.duplicates})}>
      <View style={styles.subContainer}>
      <View style={{gap: 10}}>
        <View style={styles.topContainer}>
          <Text style={{...styles.itemText, fontSize: 15, color: colors.test5}}>{item.exercise.type?.name}</Text>
          <Text style={{fontStyle: "italic", color: colors.test6}}>{item.exercise.date.toLocaleDateString()}</Text>
        </View>
        <Text style={[styles.itemText, {color: colors.summerDarkest, fontFamily: 'Roboto-Regular'}]}>
          <Text style={{...styles.itemText2, color: "green", fontSize: 15}}>{item.exercise.type?.category?.name}</Text>
        </Text>
        <View style={{flexDirection: "row"}}>
          <View >
            <Text style={{...styles.itemText2, color: colors.summerDark}}>{item.exercise.sets + " x "}</Text>
          </View>
          <View style={{minWidth: 95}}>
            <Text style={{...styles.itemText2, color: colors.summerDark}}>{item.exercise.reps + " repetitions"}</Text>
          </View>
          <View >
          <Text style={{...styles.itemText2, color: colors.summerDarkest, fontFamily: 'Roboto-Medium'}}>{" (" + item.exercise.weight} kg{")"}</Text>
        </View>
        </View>
        </View>
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
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.test6,
    width: "100%",
  },
  subContainer: {
    flexDirection: "column",
    width: "100%",
  },
  topContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  itemText: {
    fontSize: 15,
    fontFamily: "Roboto-Black",
  },
  itemText2: {
    fontSize: 14,
    fontFamily: "Roboto-Black",
    color: colors.summerDarkest,
  },
});

export default ExerciseItem;
