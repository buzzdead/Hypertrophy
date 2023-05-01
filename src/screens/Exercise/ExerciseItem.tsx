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
          <Text style={{...styles.itemText2, color: colors.summerDark}}>{duplicate.sets + " sets x "}</Text>
        </View>
        <View style={{minWidth: 60}}>
          <Text style={{...styles.itemText2, color: colors.summerDark}}>{duplicate.reps + " reps"}</Text>
        </View>
        <View>
          <Text style={{...styles.itemText2, color: colors.summerDark}}>{" (" + duplicate.weight} kg{")"}</Text>
        </View>
      </View>
    );
  };

  type abc = keyof typeof colors.categories

  return (
    <TouchableOpacity
      style={{...styles.container, backgroundColor: 'white' }}
      onPress={() => navigation.navigate("Details", {exerciseId: item.exercise.id, duplicates: item.duplicates})}>
      <View style={styles.subContainer}>
      <View style={{gap: 10}}>
        <View style={styles.topContainer}>
          <Text style={{...styles.itemText, fontSize: 14, color: colors.summerDarkest}}>{item.exercise.type?.category.name}</Text>
          <Text style={{fontStyle: "italic", color: colors.summerDarkest}}>{item.exercise.date.toLocaleDateString()}</Text>
        </View>
          
          <Text style={{...styles.itemText2, fontFamily: 'Roboto-Bold', color: colors.categories["Arms"] } }>{item.exercise.type?.name}</Text>
        
        <View style={{flexDirection: "row"}}>
          <View >
            <Text style={{...styles.itemText2, color: colors.summerDark}}>{item.exercise.sets + " sets x "}</Text>
          </View>
          <View style={{minWidth: 60}}>
            <Text style={{...styles.itemText2, color: colors.summerDark}}>{item.exercise.reps + " reps"}</Text>
          </View>
          <View>
          <Text style={{...styles.itemText2, color: colors.summerDark}}>{" (" + item.exercise.weight} kg{")"}</Text>
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
    alignSelf: 'center',
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.test6,
    borderRadius: 10,
    width: "97.5%",
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
    fontSize: 14,
    fontFamily: "Roboto-Black",
  },
  itemText2: {
    fontSize: 14,
    fontFamily: "Roboto-Medium",
  },
});

export default ExerciseItem;
