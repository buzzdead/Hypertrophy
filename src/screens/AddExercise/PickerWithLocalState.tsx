import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../utils/util";
import Picker from "./Picker";
import PickerInput from "./PickerInput";

type Props = {
  item: string
  items: string[]
  onChange: (value: any) => void;
  setLoading?: () => void
};

const PickerWithLocalState = ({ item, items, onChange, setLoading }: Props) => {
  const [pickerVisible, setPickerVisible] = useState(false);

  const togglePicker = () => {
    setPickerVisible(!pickerVisible);
  };

  const handleOnChange = (value: string) => {
    onChange(value)
    setLoading && setLoading()
  }

  return (
    <View>
      <View style={{ marginBottom: 16 }}>
        <Text style={styles.textFieldLabel}>Category:</Text>
        <PickerInput value={item} onPickerToggle={togglePicker} placeholder="Category" />
      </View>
      <Picker visible={pickerVisible} items={items} onSelect={(value) => handleOnChange(value)} onClose={togglePicker} />
    </View>
  );
};

const styles = StyleSheet.create({
    textFieldLabel: {
      fontWeight: "bold",
      marginBottom: 4,
    },
  });

export default PickerWithLocalState;
