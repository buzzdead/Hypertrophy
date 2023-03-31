// CategoryInput.tsx
import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";

type PickerInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onPickerToggle: () => void;
  placeholder: string;
};

const PickerInput: React.FC<PickerInputProps> = ({ value, onChangeText, onPickerToggle, placeholder }) => {
  return (
    <View style={styles.pickerInputContainer}>
      <TextInput
        style={[styles.input, styles.pickerInput]}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
      />
      <TouchableOpacity onPress={onPickerToggle} style={styles.pickerDisplay}>
        <FontAwesomeIcon icon={faCaretDown} size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerInputContainer: {
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderColor: "#BDBDBD",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
  },
  pickerInput: {
    flex: 1,
    marginRight: 8,
  },
  pickerDisplay: {
    position: "absolute",
    right: 20,
    padding: 10,
    zIndex: 2,
  },
});

export default PickerInput;