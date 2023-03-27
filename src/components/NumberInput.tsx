import React, {useState} from "react";
import {View, TextInput, TouchableOpacity, Text, StyleSheet} from "react-native";
import {ValueUpdater, createValueUpdater} from "../utils/ValueUpdater";
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { colors } from "../utils/util";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
}

const NumberInput = ({value = 0, onChange}: NumberInputProps) => {
  const [currentValue, setCurrentValue] = useState(value);

  const valueUpdater: ValueUpdater = createValueUpdater(setCurrentValue, onChange);

  const renderButton = (onPress: () => void, icon: IconProp, color: Optional<string>) => (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <FontAwesomeIcon icon={icon} size={18} color={color}/>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderButton(() => valueUpdater.handleDecrement(currentValue), faMinus, colors.error)}
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={currentValue.toString()}
        onChangeText={(text: string) => valueUpdater.handleInputChange(currentValue, text)}
      />
      {renderButton(() => valueUpdater.handleIncrement(currentValue), faPlus, colors.accent)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    padding: 5,
  },
  buttonText: {
    fontSize: 40,
    fontweight: 700
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginHorizontal: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontSize: 24,
    minWidth: 50,
    textAlign: "center",
  },
});

export default NumberInput;
