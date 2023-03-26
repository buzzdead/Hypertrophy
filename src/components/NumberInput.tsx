import React, {useState} from "react";
import {View, TextInput, TouchableOpacity, Text} from "react-native";

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
}

const NumberInput = ({value, onChange}: NumberInputProps) => {
  const [number, setNumber] = useState(value || "0");

  const handleIncrement = () => {
    const newValue = (parseInt(number) || 0) + 1;
    setNumber(newValue.toString());
    onChange(newValue.toString());
  };

  const handleDecrement = () => {
    let newNumber = parseInt(number) || 1;
    const newValue = newNumber - 1;
    setNumber(newValue.toString());
    onChange(newValue.toString());
  };

  const handleInputChange = (text: string) => {
    const newValue = parseInt(text, 10);
    if (!isNaN(newValue)) {
      setNumber(newValue.toString());
      onChange(newValue.toString());
    }
  };

  return (
    <View style={{flexDirection: "row", alignItems: "center"}}>
      <TouchableOpacity onPress={handleDecrement} style={{padding: 5}}>
        <Text style={{fontSize: 30}}>-</Text>
      </TouchableOpacity>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "gray",
          borderRadius: 5,
          marginHorizontal: 10,
          paddingHorizontal: 10,
          fontSize: 24,
          minWidth: 50,
          textAlign: "center",
        }}
        keyboardType="numeric"
        value={number.toString()}
        onChangeText={handleInputChange}
      />
      <TouchableOpacity onPress={handleIncrement} style={{padding: 5}}>
        <Text style={{fontSize: 30}}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NumberInput;
