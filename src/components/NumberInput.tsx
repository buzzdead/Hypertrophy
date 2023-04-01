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
  

  const renderItem = ({ item, index }: { item: number; index: number }) => {
    const inputRange = [(index - 1) * 50, index * 50, (index + 1) * 50];
    const scale = xOffset.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp",
    });
  
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text
          style={
            item === currentValue ? styles.selectedItem : styles.item
          }
        >
          {item}
        </Text>
      </Animated.View>
    );
  };

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
          style={{paddingLeft: 50, padding: 10}}
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
    width: 50,
    textAlign: "center",
    fontFamily: "Roboto-Black",
  },
  selectedItem: {
    fontSize: 26,
    width: 50,
    textAlign: "center",
    lineHeight: 32.5,
    fontFamily: "Roboto-Black",
    color: colors.new
  },
  borderedFlatList: {
    borderWidth: 2,
    borderColor: "lightblue",
    borderRadius: 5,
  },
});

export default NumberInput;
