// sidebar.tsx
import React, {useEffect, useState} from "react";
import {Animated, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SidebarWidth = 150;
const SidebarVisibleWidth = 30;

interface SideBarProps {
  categories: string[];
  onFilterChange: (selectedCategories: string[]) => void;
}

export const SideBar: React.FC<SideBarProps> = ({categories, onFilterChange}) => {
  const [selectedCategoryAnimations, setSelectedCategoryAnimations] = useState(
    categories.map(() => new Animated.Value(0)),
  );

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [translateX] = useState(new Animated.Value(-SidebarWidth));
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryPress = (category: string, index: number) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newSelectedCategories);
    onFilterChange(newSelectedCategories);
    console.log(selectedCategoryAnimations);

    Animated.timing(selectedCategoryAnimations[index], {
      toValue: newSelectedCategories.includes(category) ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  useEffect(() => {
    setSelectedCategoryAnimations(categories.map(() => new Animated.Value(0)));
  }, [categories]);
  const handleCloseSidebar = () => {
    Animated.timing(translateX, {
      toValue: -SidebarWidth,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSidebarVisible(false));
  };

  const handleOpenSidebar = () => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSidebarVisible(true));
  };

  return (
    <Animated.View
      style={[
        styles.sidebar,
        {
          transform: [
            {
              translateX: translateX.interpolate({
                inputRange: [-SidebarWidth, 0],
                outputRange: [-SidebarWidth + SidebarVisibleWidth, 0],
                extrapolate: "clamp",
              }),
            },
          ],
        },
      ]}>
      <View style={styles.sidebarEdgeIndicator}>
        <TouchableOpacity
          style={{...styles.sidebarEdge, zIndex: sidebarVisible ? 1001 : -1}}
          onPress={() => (sidebarVisible ? handleCloseSidebar() : handleOpenSidebar())}>
          <MaterialCommunityIcons
            adjustsFontSizeToFit
            name={"tune-vertical"}
            size={24}
            color={sidebarVisible ? "green" : "red"}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.sidebarTitle}>Filter</Text>
      {categories.map((category, index) => (
        <Animated.View
          key={category}
          style={[
            styles.sidebarItem,
            {
              backgroundColor: selectedCategoryAnimations[index]?.interpolate({
                inputRange: [0, 1],
                outputRange: ["transparent", "lightgreen"],
              }),
            },
          ]}>
          <TouchableOpacity onPress={() => handleCategoryPress(category, index)}>
            <Text style={styles.sidebarItemText}>{category}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    right: -SidebarWidth + SidebarVisibleWidth,
    bottom: 0,
    backgroundColor: "#f5f5f5",
    zIndex: 1000,
    width: SidebarWidth - SidebarVisibleWidth,
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    elevation: 5, // Add box shadow on Android
    shadowColor: "#000", // Add box shadow on iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sidebarTitle: {
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Roboto-Regular",
    color: "#333",
  },
  sidebarItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  sidebarItemText: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 11.4,
    fontFamily: "Roboto-Bold",
    color: "black",
    textAlign: "center"
  },
  sidebarEdgeIndicator: {
    position: "absolute",
    top: 35,
    left: -SidebarVisibleWidth -3,
    zIndex: 1000,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
  },
  sidebarEdge: {
    width: SidebarVisibleWidth,
    justifyContent: "center",
    alignItems: "center",
  },
});
