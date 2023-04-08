import React, {useRef, useState} from "react";
import {
  Button,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ColorValue,
  RefreshControl,
  ImageBackground,
} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {Exercise} from "../../../typings/types";
import {colors} from "../../utils/util";
import {useExercises} from "../../hooks/useExercises";
import {SideBar} from "../../components/SideBar";
import {useCategories} from "../../hooks/useCategories";
import {CategorySchema} from "../../config/realmConfig";
import CustomButton from "../../components/CustomButton";

type Props = StackScreenProps<
  {
    List: undefined;
    Details: {exerciseId?: number};
    AddExercise: {previousExercise: Exercise | null};
  },
  "List"
>;

const ExerciseList: React.FC<Props> = ({navigation}) => {
  const {exercises, refresh} = useExercises();
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>();
  const categories = useCategories();
  const [refreshing, setRefreshing] = useState(false);

  const _onRefresh = () => {
    setRefreshing(true);

    // Fetch your data here, and update your component's state.
    // Once the data fetching is done, set the refreshing state to false.

    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // This is a simulation of data fetching. Replace it with your own data fetching logic.
  };

  const handleFilterChange = (selectedCategories: Optional<CategorySchema>[]) => {
    console.log(selectedCategories, "aisdasidfj");
    exercises.map(e => console.log(e?.type?.category?.id));
    if (!selectedCategories) return;
    if (selectedCategories?.length === 0) {
      setFilteredExercises(exercises);
    } else {
      setFilteredExercises(
        exercises.filter(exercise =>
          selectedCategories?.some(selectedCategory => selectedCategory?.id === exercise.type?.category?.id),
        ),
      );
    }
  };

  const renderItem = (
    {item}: {item: Exercise; index: number},
    navigation: StackScreenProps<any, "List">["navigation"],
  ) => {
    if (!item) {
      return null;
    }
    return (
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("Details", {exerciseId: item.id})}>
        <View style={{flexDirection: "column", width: "100%", gap: 15}}>
          <View style={{justifyContent: "space-between", flexDirection: "row"}}>
            <Text style={{...styles.itemText, color: colors.error}}>{item.type?.name?.toUpperCase()}</Text>
            <Text style={{fontStyle: "italic", color: colors.secondary}}>{item.date.toLocaleDateString()}</Text>
          </View>
          <Text style={styles.itemText}>
            Category: <Text style={styles.itemText2}>{item.type?.category?.name}</Text>
          </Text>
          <Text style={styles.itemText}>
            Result:{" "}
            <Text style={styles.itemText2}>
              {item.sets} sets x {item.reps} reps
            </Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('./bg2.png')} style={styles.image}>
      <FlatList
        data={filteredExercises || exercises}
        renderItem={item => renderItem(item, navigation)}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh}
            colors={["#9Bd35A", "#689F38"]}
            progressBackgroundColor="#fff"
            tintColor="#689F38"
          />
        }
      />
      <View style={{width: "100%"}}>
        <CustomButton
          title="Add new exercise"
          titleColor={colors.error}
          backgroundColor={colors.summerWhite}
          borderColor={colors.error}
          onPress={() => navigation.navigate("AddExercise", {previousExercise: null})}
        />
      </View>
      </ImageBackground>
      <SideBar categories={categories} onFilterChange={handleFilterChange} />
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
    borderBottomColor: colors.summerWhite,
    width: "100%",
  },
  itemText: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    color: colors.summerDark
  },
  itemText2: {
    fontSize: 14,
    fontFamily: "Roboto-Medium",
    color: colors.summerDarkest,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
  }
});

export default ExerciseList;
