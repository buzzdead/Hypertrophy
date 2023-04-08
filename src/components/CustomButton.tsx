import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/util';

type CustomButtonProps = {
  title: string;
  titleColor: string;
  backgroundColor: string;
  onPress: () => void;
  disabled?: boolean
  borderColor?: string
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  titleColor,
  backgroundColor,
  onPress,
  disabled,
  borderColor
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor, borderColor, borderTopWidth: borderColor ? 1 : 0, borderBottomColor: borderColor, borderBottomWidth: borderColor ? 1.5 : 0}]}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.55}
    >
      <Text style={[styles.buttonTitle, { color: titleColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold'
  },
});

export default CustomButton;