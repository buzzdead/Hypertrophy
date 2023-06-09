import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Picker from "./Picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
import { CategorySchema, ExerciseTypeSchema } from "../../../../config/realm";
import { colors } from "../../../../utils/util";

type Props = {
  item: Nullable<CategorySchema | ExerciseTypeSchema>;
  items: (CategorySchema | ExerciseTypeSchema)[];
  picker: number;
  onChange: (value: any) => void;
  setLoading?: () => void;
  name: "Exercise Type" | "Category"
  left: number
  maxWidth?: number
};

const PickerField = ({ item, items, onChange, setLoading, picker, left, name, maxWidth }: Props) => {
  const [pickerVisible, setPickerVisible] = useState(false);

  const togglePicker = () => {
    setPickerVisible(!pickerVisible);
  };

  const handleOnChange = (value: CategorySchema | ExerciseTypeSchema) => {
    onChange(value);
    setLoading && setLoading();
  };

  return (
    <View>
      <View style={{ marginBottom: 16 }}>
        <View style={{flexDirection: 'row', justifyContent: "space-between", paddingBottom: 5}}>
        <Text style={pickerStyles.textFieldLabel}>{name}</Text>
        </View>
        <View style={pickerStyles.pickerInputContainer}>
          <TouchableOpacity style={pickerStyles.pickerInput} onPress={togglePicker}>
            <Text style={pickerStyles.pickerInputText}>{item?.name || name}</Text>
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel={`close ${name}`} onPress={togglePicker} style={pickerStyles.pickerDisplay}>
            <FontAwesomeIcon icon={faCaretDown} size={30} color={colors.test5} />
          </TouchableOpacity>
        </View>
      </View>
      <Picker
        top={picker || 200}
        visible={pickerVisible}
        items={items}
        onSelect={(value) => handleOnChange(value)}
        onClose={togglePicker}
        left={left}
        maxWidth={maxWidth}
      />
    </View>
  );
};

export const pickerStyles = StyleSheet.create({
  textFieldLabel: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  pickerInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#BDBDBD",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "#F5F5F5",
  },
  pickerInput: {
    flex: 1,
    padding: 16
  },
  pickerInputText: {
    color: colors.summerDarkest,
  },
  pickerDisplay: {
    padding: 10,
  },
});

export default PickerField;
