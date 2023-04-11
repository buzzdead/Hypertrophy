import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/util';

type Size = "S" | "SM" | "M" | "L"
const SIZE_TO_PADDING: { [key in Size]: { width: number, height: number } } = {
  S: { width: 35, height: 35 },
  SM: {width: 135, height: 40},
  M: { width: 175, height: 50 },
  L: { width: 250, height: 50 },
};

type CustomButtonProps = {
  title: string;
  titleColor: string;
  backgroundColor: string;
  onPress: () => void;
  disabled?: boolean
  borderColor?: string
  fontSize?: number
  size?: Size
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  titleColor,
  backgroundColor,
  onPress,
  disabled,
  borderColor,
  fontSize,
  size="S",
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, SIZE_TO_PADDING[size], { backgroundColor, borderColor, borderTopWidth: borderColor ? 1 : 0, borderBottomColor: borderColor, borderBottomWidth: borderColor ? 1.5 : 0}]}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.buttonTitle, { color: titleColor, fontSize: fontSize || 16 }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    fontSize: 16,
    justifyContent: "center",
    textAlign: "center",
    fontFamily: 'Roboto-Bold',
  },
});

export default CustomButton;