import React from "react";
import {Text, TouchableOpacity, View, FlatList, StyleSheet} from "react-native";
import {Duplicate, ExerciseWithDuplicates} from "../../../typings/types";
import {colors} from "../../utils/util";
import {StackScreenProps} from "@react-navigation/stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Contingent from "../../components/Contingent";

type ExerciseItemProps = {
  item: ExerciseWithDuplicates;
  navigation: StackScreenProps<any, "List">["navigation"];
};

type CategoryColors = keyof typeof colors.categories;

const ExerciseItem: React.FC<ExerciseItemProps> = ({item, navigation}) => {
  const renderDuplicate = (duplicate: Duplicate) => {
    return (
      <View style={{flexDirection: "row"}}>
        <View>
          <Text style={{...styles.itemText2}}>{duplicate.sets + " sets x "}</Text>
        </View>
        <View style={{minWidth: 60}}>
          <Text style={{...styles.itemText2}}>{duplicate.reps + " reps"}</Text>
        </View>
        <View style={{minWidth: "10%"}}>
          <Text style={{...styles.itemText2}}>
            {" ( " + duplicate.weight} {")"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor:
          `${colors.categories[item?.exercise?.type?.category?.name as CategoryColors] + "50"}` ||
          colors.categories.Default,
      }}
      onPress={() => navigation.navigate("Details", {exerciseId: item.exercise.id, duplicates: item.duplicates})}>
      <View style={styles.subContainer}>
        <View style={{gap: 10, width: "100%"}}>
          <View style={styles.topContainer}>
            <Text
              style={{
                ...styles.itemText2,
                fontFamily: "Roboto-Medium",
                fontWeight: "900",
                fontSize: 18,
                color: "black",
              }}>
              {item.exercise.type?.name}
            </Text>
            <Text style={{fontStyle: "italic", color: colors.summerDarkest}}>
              {item.exercise.date.toLocaleDateString()}
            </Text>
          </View>
          <Text
            style={{
              ...styles.itemText2,
              fontFamily: "Roboto-Bold",
              color:
                colors.categories[item?.exercise?.type?.category?.name as CategoryColors] || colors.categories.Default,
            }}>
            {item.exercise.type?.category.name}
          </Text>
          <View style={{width: "100%"}}>
            <View style={{flexDirection: "row", width: "100%"}}>
              <View>
                <Text style={{...styles.itemText2}}>{item.exercise.sets + " sets x "}</Text>
              </View>
              <View style={{minWidth: 60}}>
                <Text style={{...styles.itemText2}}>{item.exercise.reps + " reps"}</Text>
              </View>
              <View style={{minWidth: "10%"}}>
                <Text style={{...styles.itemText2}}>
                  {" ( " + item.exercise.weight} {")"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <FlatList
          data={item.duplicates || []}
          renderItem={({item}) => renderDuplicate(item)}
          keyExtractor={(item, id) => id.toString()}
        />
        <Contingent shouldRender={item.exercise.exceptional || item.duplicates.some(e => e.exceptional)}>
          <MaterialCommunityIcons
            name={"arm-flex"}
            size={24}
            style={{position: "absolute", bottom: 0, right: 25}}
            color={colors.categories[item?.exercise?.type?.category?.name as CategoryColors] || colors.categories.Default}
          />
        </Contingent>
        <MaterialCommunityIcons
          name={"weight-kilogram"}
          size={24}
          style={{position: "absolute", bottom: 0, right: 0}}
          color={colors.summerDarkest}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 15,
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
    fontSize: 16,
    fontFamily: "Roboto-Black",
  },
  itemText2: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: colors.summerDarkest,
  },
});

export default React.memo(ExerciseItem);
