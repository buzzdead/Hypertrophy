import React from "react"
import { Text, View } from "react-native"
import CustomButton from "../../components/CustomButton"
import { colors } from "../../utils/util"

interface Props {
    handleNext: () => void
    handlePrev: () => void
    lastPage: boolean
    firstPage: boolean
    month: string
}

export const ChartNavigation: React.FC<Props> = ({handleNext, handlePrev, firstPage, lastPage, month}) => {
    return (
        <View style={{flexDirection: 'row', justifyContent: 'center', gap: 10}}>
             <CustomButton
          size="S"
          titleColor={firstPage ? colors.summerDark : colors.summerBlue}
          fontSize={30}
          backgroundColor={colors.test6}
          onPress={handlePrev}
          title={"<"}
        />
        <Text style={{textAlignVertical: 'center', minWidth: 100, textAlign: 'center', fontFamily: 'Roboto-Medium', fontSize: 20}}>{month}</Text>
        <CustomButton
          titleColor={lastPage ? colors.summerDark : colors.summerBlue}
          onPress={handleNext}
          backgroundColor={colors.test6}
          size="S"
          fontSize={30}
          title={">"}
        />
        </View>
    )
}