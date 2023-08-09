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
  handleFirst: () => void
  handleLast: () => void
}

export const ChartNavigation: React.FC<Props> = ({isLandScape, firstPage, lastPage, monthTitle, handleNext, handlePrev, handleLast, handleFirst}) => {

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        position: isLandScape ? "absolute" : "absolute",
        justifyContent: 'center',
        bottom: 0,
        borderTopWidth: 1,
        borderTopColor: 'grey',
        width: '100%',
        backgroundColor: colors.summerWhite
      }}>
      <View style={isLandScape ? styles.contingentButtonLeft : styles.abc}>
      <CustomButton
          size="S"
          titleColor={firstPage ? colors.summerDark : colors.summerBlue}
          fontSize={30}
          backgroundColor={colors.summerWhite}
          onPress={handleFirst}
          title={"<<"}
        />
        <CustomButton
          size="S"
          titleColor={firstPage ? colors.summerDark : colors.summerBlue}
          fontSize={30}
          backgroundColor={colors.summerWhite}
          onPress={handlePrev}
          title={"<"}
        />
      </View>
      <Contingent style={{justifyContent: 'center'}} shouldRender={!isLandScape}>
        <Text
          style={{
            minWidth: 100,
            textAlign: "center",
            fontFamily: "Roboto-Medium",
            fontSize: 16,
            color: colors.summerDarkest
          }}>
          {monthTitle}
        </Text>
      </Contingent>
      <View style={isLandScape ? styles.contingentButtonRight : styles.abc}>
        <CustomButton
          titleColor={
            lastPage ? colors.summerDark : colors.summerBlue
          }
          onPress={handleNext}
          backgroundColor={colors.summerWhite}
          size="S"
          fontSize={30}
          title={">"}
        />
        <CustomButton
          titleColor={
            lastPage ? colors.summerDark : colors.summerBlue
          }
          onPress={handleLast}
          backgroundColor={colors.summerWhite}
          size="S"
          fontSize={30}
          title={">>"}
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
  abc: {
    flexDirection: 'row',
    gap: 5
  }
});
