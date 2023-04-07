import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CategorySchema, ExerciseTypeSchema } from "../../../config/realmConfig";
import { colors } from "../../../utils/util";
import Picker from "./Picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
import AddObject from "../Modal/AddObject";

type Props = {
  item: Nullable<CategorySchema | ExerciseTypeSchema>;
  items: (CategorySchema | ExerciseTypeSchema)[];
  picker?: number;
  onChange: (value: any) => void;
  setLoading?: () => void;
  addingObject?: boolean
};

const PickerField = ({ item, items, onChange, setLoading, picker, addingObject }: Props) => {
  const [pickerVisible, setPickerVisible] = useState(false);
  const name = picker ? "Exercise Type" : "Category"

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
        {!addingObject && <AddObject isCategory={name === 'Category'} />}
        </View>
        <View style={pickerStyles.pickerInputContainer}>
          <TouchableOpacity style={pickerStyles.pickerInput} onPress={togglePicker}>
            <Text style={pickerStyles.pickerInputText}>{item?.name || ""}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePicker} style={pickerStyles.pickerDisplay}>
            <FontAwesomeIcon icon={faCaretDown} size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <Picker
        picker={picker}
        visible={pickerVisible}
        items={items}
        onSelect={(value) => handleOnChange(value)}
        onClose={togglePicker}
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
    padding: 8
  },
  pickerInputText: {
    color: "black",
  },
  pickerDisplay: {
    padding: 10,
  },
});

export default PickerField;
