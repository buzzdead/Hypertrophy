import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/util';

type Size = "S" | "M" | "L"
const SIZE_TO_PADDING: { [key in Size]: { paddingHorizontal: number, paddingVertical: number } } = {
  S: { paddingHorizontal: 20, paddingVertical: 10 },
  M: { paddingHorizontal: 40, paddingVertical: 20 },
  L: { paddingHorizontal: 60, paddingVertical: 30 },
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
    fontFamily: 'Roboto-Bold'
  },
});

export default CustomButton;