import React, {useState} from "react";
import {View, Animated, StyleSheet, FlatList, Text} from "react-native";
import { throttle } from "lodash";
import { colors } from "../utils/util";


interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
}

const NumberInput = ({value = 0, onChange}: NumberInputProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  const xOffset = new Animated.Value(value * 50);

  const handleScrollEvent = throttle(({ value: offsetX }) => {
    const newValue = Math.round(offsetX / 50);
    if (newValue !== currentValue) {
      setCurrentValue(newValue);
      onChange(newValue);
    }
  }, 100);

  xOffset.addListener(handleScrollEvent)
  

  const renderItem = ({ item }: { item: number }) => (
    <Text style={item === currentValue ? styles.selectedItem : styles.item}>{item}</Text>
  );

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { x: xOffset } } }], {
    useNativeDriver: false,
  });

  return (
    <View style={{alignItems: "center"}}>
    <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>

      <View style={styles.borderedFlatList}>
      <View style={{ width: 150, overflow: "hidden"}}>
        <FlatList
          data={Array.from({ length: 31 }, (_, i) => i)}
          renderItem={renderItem}
          keyExtractor={(item) => item.toString()}
          horizontal
          snapToInterval={50} // 50 is the item width
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: value * 50, y: 0 }}
          style={{paddingLeft: 50}}
        />
        </View>
      </View>
    </View>
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
  item: {
    fontSize: 24,
    fontWeight: "bold",
    width: 50,
    textAlign: "center",
  },
  selectedItem: {
    fontSize: 24,
    fontWeight: "bold",
    width: 50,
    textAlign: "center",
    color: colors.test2, // Change this to the desired highlight color
  },
  borderedFlatList: {
    borderWidth: 2,
    borderColor: "lightblue",
    borderRadius: 5,
  },
});

export default NumberInput;
