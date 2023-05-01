import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import {SafeAreaView, View, Text, StyleSheet} from "react-native";
import CustomButton from "../../components/CustomButton";
import {colors} from "../../utils/util";

interface ExerciseListBtmProps {
  currentWeek: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handleGoToLastPage: () => void;
  handleGoToFirstPage: () => void
  maxPage: number;
  currentPage: number;
  navigation: StackScreenProps<any, "List">["navigation"];
}

export const ExerciseListBtm: React.FC<ExerciseListBtmProps> = ({
  currentWeek,
  currentPage,
  handleNextPage,
  handlePrevPage,
  handleGoToLastPage,
  handleGoToFirstPage,
  maxPage,
  navigation,
}) => {
  return (
    <SafeAreaView>
      <View style={styles.pagination}>
      <CustomButton
          titleColor={currentPage === 0 ? colors.summerDark : colors.summerBlue}
          onPress={handleGoToFirstPage}
          backgroundColor={'white'}
          size="S"
          fontSize={26}
          title={"<<"}
        />
        <CustomButton
          size="S"
          titleColor={currentPage === 0 ? colors.summerDark : colors.summerBlue}
          fontSize={26}
          backgroundColor={'white'}
          onPress={handlePrevPage}
          title={"<"}
        />
        <Text style={{fontFamily: "Roboto-Bold", color: colors.summerDarkest, fontSize: 16, paddingTop: 3}}>Week {currentWeek}</Text>
        <CustomButton
          titleColor={currentPage === maxPage ? colors.summerDark : colors.summerBlue}
          onPress={handleNextPage}
          backgroundColor={'white'}
          size="S"
          fontSize={26}
          title={">"}
        />
         <CustomButton
          titleColor={currentPage === maxPage ? colors.summerDark : colors.summerBlue}
          onPress={handleGoToLastPage}
          backgroundColor={'white'}
          size="S"
          fontSize={26}
          title={">>"}
        />
      </View>
      <View style={{bottom: 2, right: 2, position: "absolute"}}>
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
    backgroundColor: 'white',
    width: "100%",
    paddingTop: -3,
    paddingBottom: 5,
    borderTopWidth: 0.5,
  },
});
