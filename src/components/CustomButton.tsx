import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Contingent from './Contingent';
import LoadingIndicator from './LoadingIndicator';

type Size = "S" | "SM" | "M" | "L" | "XL" | "XXL"
const SIZE_TO_PADDING: { [key in Size]: { width: number, height: number } } = {
  S: { width: 54, height: 52 },
  SM: { width: 135, height: 52 },
  M: { width: 175, height: 52 },
  L: { width: 250, height: 52 },
  XL: {width: 300, height: 52},
  XXL: {width: 365, height: 52}
};

type CustomButtonProps = {
  title: string;
  titleColor?: string;
  backgroundColor?: string;
  onPress: () => void;
  disabled?: boolean
  borderColor?: string
  fontSize?: number
  loading?: boolean
  size?: Size
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  titleColor = 'white',
  backgroundColor = 'black',
  onPress,
  disabled,
  borderColor,
  fontSize,
  size = "S",
  loading = false,
}) => {
  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length > maxLength) {
      return `${title.substring(0, maxLength)}...`;
    }

    return title;
  };
  return (
    <TouchableOpacity
      style={[styles.button, SIZE_TO_PADDING[size], { backgroundColor, borderColor, borderTopWidth: borderColor ? 1 : 0, borderBottomColor: borderColor, borderBottomWidth: borderColor ? 1.5 : 0 }]}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Contingent shouldRender={!loading}>
        <Text
          style={[styles.buttonTitle, { color: titleColor, fontSize: fontSize || 16 }]}
          numberOfLines={2}
          ellipsizeMode='tail'
        >
          {truncateTitle(title, 20)}
        </Text>
        <LoadingIndicator />
      </Contingent>
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