import React, {useEffect, useRef, useState} from "react";
import {View, Animated, StyleSheet, FlatList, Text} from "react-native";
import {throttle} from "lodash";
import {colors} from "../utils/util";

interface NumberInputProps {
  value: number;
  title: string;
  onChange: (value: number) => void;
}

const NumberInput = ({value, title, onChange}: NumberInputProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [xOffset] = useState(() => new Animated.Value(currentValue * 50));
  const flatListRef = useRef<FlatList>(null);
  const arr = Array.from({length: 50}, (_, i) => i);

  useEffect(() => {
    const handleScrollEvent = throttle(({value: offsetX}) => {
      const newValue = Math.round(offsetX / 50);
      if (newValue !== currentValue) {
        setCurrentValue(newValue);
        onChange(newValue);
      }
    }, 10);

    const listenerId = xOffset.addListener(handleScrollEvent);
    return () => {
      handleScrollEvent.cancel();
      xOffset.removeListener(listenerId);
    };
  }, [currentValue, onChange, xOffset]);

  const renderItem = ({item, index}: {item: number; index: number}) => {
    const inputRange = [(index - 1) * 50, index * 50, (index + 1) * 50];
    const scale = xOffset.interpolate({
      inputRange,
      outputRange: [1, 1.25, 1],
      extrapolate: "clamp",
    });

    return (
      <Animated.View style={{transform: [{scale}]}}>
        <Text style={item === currentValue ? styles.selectedItem : styles.item}>{item}</Text>
      </Animated.View>
    );
  };

  const handleScroll = Animated.event([{nativeEvent: {contentOffset: {x: xOffset}}}], {
    useNativeDriver: false,
  });

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.touchFieldLabel}>{title}</Text>
    <View style={{alignItems: "center"}}>
      <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
        <View style={styles.borderedFlatList}>
          <View style={{width: 150, overflow: "hidden"}}>
            <FlatList
              ref={flatListRef}
              data={arr}
              renderItem={renderItem}
              keyExtractor={item => item.toString()}
              horizontal
              snapToInterval={50} // 50 is the item width
              decelerationRate="fast"
              onMomentumScrollEnd={handleScroll}
              showsHorizontalScrollIndicator={false}
              contentOffset={{x: currentValue * 50, y: 0}}
              style={{paddingLeft: 50, padding: 10}}
              onLayout={() => {
                if (flatListRef.current) {
                  setTimeout(
                    () =>
                      flatListRef?.current?.scrollToOffset({
                        offset: currentValue * 50,
                        animated: true,
                      }),
                    30,
                  );
                }
              }}
            />
          </View>
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
    fontweight: 700,
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
    fontSize: 24,
    width: 50,
    textAlign: "center",
    lineHeight: 32,
    fontFamily: "Roboto-Black",
    color: colors.summerBlue,
  },
  borderedFlatList: {
    borderWidth: 2,
    borderColor: "lightblue",
    borderRadius: 5,
  },
  inputContainer: {
    marginBottom: 16,
    flexDirection: "column",
    alignItems: "center",
    marginRight: 10,
  },
  touchFieldLabel: {
    color: colors.summerDark,
    fontSize: 22,
    fontWeight: "800",
    padding: 6,
    paddingRight: 10,
  },
});

export default React.memo(NumberInput);
