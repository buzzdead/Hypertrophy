import React, {useState} from "react";
import {SafeAreaView, StyleSheet, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {Exercise} from "../../../typings/types";
import {colors} from "../../utils/util";
import {useExercises} from "../../hooks/useExercises";
import CustomButton from "../../components/CustomButton";
import WeeklyExercises from "./WeeklyExercises";
import LoadingIndicator from "../../components/LoadingIndicator";

type Props = StackScreenProps<
  {
    List: undefined;
    Details: {exerciseId?: number};
    AddExercise: {previousExercise: Exercise | null};
  },
  "List"
>;

const ExerciseList: React.FC<Props> = ({navigation}) => {
  const [loading, setLoading] = useState(true)
  const {exercises, refresh} = useExercises(setLoading);
  const [currentPage, setCurrentPage] = useState<Optional<number>>()

  const _onRefresh = (pageNumber?: number) => {
    setLoading(true);
    refresh();
    if (pageNumber !== undefined) setCurrentPage(pageNumber);
  };


  if(loading) return <LoadingIndicator />
  console.log("rendering exerciselist")
  return (
    <SafeAreaView style={styles.container}>
      <WeeklyExercises navigation={navigation} exercises={exercises} onRefresh={_onRefresh} refreshing={loading} page={currentPage}/>
      <View style={{width: "10%", bottom: 5, right: 5, position: "absolute"}}>
        <CustomButton
          title="+"
          fontSize={24}
          titleColor={colors.accent}
          backgroundColor={colors.summerDark}
          onPress={() => navigation.navigate("AddExercise", {previousExercise: null})}
        />
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ExerciseList;
