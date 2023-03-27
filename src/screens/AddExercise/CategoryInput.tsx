// CategoryInput.tsx
import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onPickerToggle: () => void;
};

const CategoryInput: React.FC<Props> = ({ value, onChangeText, onPickerToggle }) => {
  return (
    <View style={styles.categoryContainer}>
      <TextInput
        style={[styles.input, styles.categoryInput]}
        onChangeText={onChangeText}
        value={value}
        placeholder="Enter exercise category"
      />
      <TouchableOpacity onPress={onPickerToggle} style={styles.pickerDisplay}>
        <FontAwesomeIcon icon={faCaretDown} size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
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
  categoryInput: {
    flex: 1,
    marginRight: 8,
  },
  pickerDisplay: {
    position: "absolute",
    right: 20,
    zIndex: 2,
  },
});

export default CategoryInput;
