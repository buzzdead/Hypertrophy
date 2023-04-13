import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import {SafeAreaView, View, Text, StyleSheet} from "react-native";
import CustomButton from "../../components/CustomButton";
import {colors} from "../../utils/util";

interface ExerciseListUIProps {
  currentWeek: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  maxPage: number;
  currentPage: number;
  navigation: StackScreenProps<any, "List">["navigation"];
}

export const ExerciseListUI: React.FC<ExerciseListUIProps> = ({
  currentWeek,
  currentPage,
  handleNextPage,
  handlePrevPage,
  maxPage,
  navigation,
}) => {
  return (
    <SafeAreaView>
      <View style={styles.pagination}>
        <CustomButton
          size="S"
          titleColor={currentPage === 0 ? colors.summerDark : colors.summerBlue}
          fontSize={26}
          backgroundColor={colors.summerWhite}
          onPress={handlePrevPage}
          title={"<"}
        />
        <Text style={{fontFamily: "Roboto-Black"}}>Week {currentWeek}</Text>
        <CustomButton
          titleColor={currentPage === maxPage ? colors.summerDark : colors.summerBlue}
          onPress={handleNextPage}
          backgroundColor={colors.summerWhite}
          size="S"
          fontSize={26}
          title={">"}
        />
      </View>
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
  pagination: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 5,
  },
});
