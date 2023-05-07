import React, {} from "react";
import {StyleSheet, Text, View} from "react-native";
import Contingent from "../../components/Contingent";
import CustomButton from "../../components/CustomButton";
import {colors} from "../../utils/util";

interface Props {
  isLandScape: boolean
  firstPage: boolean
  lastPage: boolean
  monthTitle: string
  handleNext: () => void
  handlePrev: () => void
}

export const ChartNavigation: React.FC<Props> = ({isLandScape, firstPage, lastPage, monthTitle, handleNext, handlePrev}) => {

  

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        position: isLandScape ? "absolute" : "relative",
      }}>
      <View style={isLandScape && styles.contingentButtonLeft}>
        <CustomButton
          size="S"
          titleColor={firstPage ? colors.summerDark : colors.summerBlue}
          fontSize={30}
          backgroundColor={colors.test6}
          onPress={handlePrev}
          title={"<"}
        />
      </View>
      <Contingent shouldRender={!isLandScape}>
        <Text
          style={{
            textAlignVertical: "center",
            minWidth: 100,
            textAlign: "center",
            fontFamily: "Roboto-Medium",
            fontSize: 20,
          }}>
          {monthTitle}
        </Text>
      </Contingent>
      <View style={isLandScape && styles.contingentButtonRight}>
        <CustomButton
          titleColor={
            lastPage ? colors.summerDark : colors.summerBlue
          }
          onPress={handleNext}
          backgroundColor={colors.test6}
          size="S"
          fontSize={30}
          title={">"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contingentButtonLeft: {
    left: -275,
  },
  contingentButtonRight: {
    right: -250,
  },
});
