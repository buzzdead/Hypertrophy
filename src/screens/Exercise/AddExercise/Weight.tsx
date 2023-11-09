import React, {useState} from "react";
import {View, Text, TextInput, StyleSheet, Image} from "react-native";
import {colors} from "../../../utils/util";

interface Props {
  title: string;
  value: number | string;
  onChange: (value: string | number, validWeight: boolean) => void;
}

const Weight: React.FC<Props> = ({value, onChange}) => {
  const [isWeightValid, setIsWeightValid] = useState(true);

  const handleWeightChange = (text: string) => {
    const weight = Number(text);
    const invalidWeight = isNaN(weight) || text === "";
    setIsWeightValid(!invalidWeight);
    onChange(text, !invalidWeight);
  };

  return (
    <View style={styles.inputContainer}>
      <View style={[styles.weightInputContainer]}>
        <TextInput
          style={[styles.input, !isWeightValid && styles.invalidInput]}
          value={String(value)}
          onChangeText={handleWeightChange}
        />
        <Text style={{textAlign: "center", alignSelf: "center", fontSize: 24, fontFamily: 'Roboto-Bold', color: colors.summerDark, marginLeft: 5}}>Kg</Text>
      </View>
      {!isWeightValid && <Text style={styles.errorText}>Weight must be a number</Text>}
      <Image
        source={require("../../../../assets/images/weights.png")}
        style={{width: "20%", height: "100%", position: "absolute", top: -60}}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
    marginTop: 6,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  touchFieldLabel: {
    color: colors.summerDark,
    fontSize: 22,
    fontWeight: "800",
    padding: 6,
    paddingRight: 10,
  },
  input: {
    borderColor: "#BDBDBD",
    borderWidth: 1,
    borderRadius: 4,
    color: 'black',
    minWidth: 75,
    marginLeft: 27.5,
    textAlign: "center",
    fontFamily: "Roboto-Black",
    padding: 8,
    fontSize: 30,
  },
  weightInputContainer: {
    flexDirection: "row",
    gap: 5,
  },
  invalidInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    position: 'absolute',
    top: 60,
    fontSize: 14,
    fontFamily: "Roboto-Normal",
    marginTop: 4,
  },
});
export default Weight;
