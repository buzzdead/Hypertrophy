import React from "react"
import { StyleSheet, View } from "react-native"
import CustomButton from "../../components/CustomButton"
import { colors } from "../../utils/util"
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
    mode: 'Daily' | 'Weekly'
    landScapeOrientation: boolean
    changeMode: (mode: Props['mode']) => void
}

export const ProgressTrackingBtm: React.FC<Props> = ({mode, landScapeOrientation = false, changeMode}) => {
  
    return (
        <View style={[styles.buttons, landScapeOrientation ? styles.buttonsLandScape : styles.buttonsNormal]}>
        <CustomButton
          size={landScapeOrientation ? "S" : "SM"}
          title={landScapeOrientation ? "W" : "Weekly"}
          backgroundColor={colors.summerDark}
          titleColor={mode === "Weekly" ? colors.summerBlue : colors.summerWhite}
          onPress={() => changeMode("Weekly")}
          disabled={mode === "Weekly"}
        />
        <CustomButton
          size={landScapeOrientation ? "S" : "SM"}
          title={landScapeOrientation ? "D" : "Daily"}
          backgroundColor={colors.summerDark}
          titleColor={mode === "Daily" ? colors.summerBlue : colors.summerWhite}
          onPress={() => changeMode("Daily")}
          disabled={mode === "Daily"}
        />
      </View>
    )
}

const styles = StyleSheet.create({
    xAxis: {
      marginTop: -25,
      marginLeft: 30,
      width: 350,
    },
    buttons: {
      position: "absolute",
      gap: 10,
    },
    buttonsLandScape: {
      right: 67.5,
      bottom: -72.5,
      flexDirection: "row",
    },
    buttonsNormal: {
      bottom: 0,
      alignSelf: "center",
      flexDirection: "row",
    },
  });