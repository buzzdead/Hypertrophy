import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../utils/color';

type Size = "S" | "M" | "L"

interface Props {
    isSelected: boolean
    onSelection: (b: boolean) => void
    size: Size
    color: string
    icon?: string
}

export const CheckBox = ({isSelected, onSelection, size, color}: Props) => {
    const [checked, setChecked] = useState(isSelected)
    const SIZE_TO_PADDING: { [key in Size]: { width: number, height: number } } = {
        S: { width: 54, height: 54 },
        M: { width: 75, height: 75 },
        L: { width: 100, height: 100 },
      };
    const handleOnPress = () => {
        setChecked(!checked)
        onSelection(!checked)
    }
  return (
    <TouchableOpacity
    accessibilityLabel="Checkbox"
      style={{
        ...SIZE_TO_PADDING[size],
        borderColor: 'grey',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={handleOnPress}
    >
      {checked &&
        <MaterialCommunityIcons
        adjustsFontSizeToFit
        name={"arm-flex"}
        size={SIZE_TO_PADDING[size].height}
        color={colors.test5}
      />
      }
    </TouchableOpacity>
  );
};