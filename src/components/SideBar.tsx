// sidebar.tsx
import React, {useEffect, useLayoutEffect, useState} from "react";
import {Animated, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {CategorySchema} from "../config/realm";
import { useScreenOrientation } from "../hooks/useScreenOrientation";
import {colors} from "../utils/util";

interface SideBarProps {
  categories: CategorySchema[];
  onFilterChange: (selectedCategories: CategorySchema[]) => void;
  icon?: string;
  isLandScape: boolean
}

export const SideBar: React.FC<SideBarProps> = ({categories, onFilterChange, icon, isLandScape}) => {
  const [sideBarWidth, setSideBarWidth] = useState(isLandScape ? 300 : 150)
  const [selectedCategoryAnimations, setSelectedCategoryAnimations] = useState(
    categories.map(() => new Animated.Value(0)),
  );

const SidebarVisibleWidth = 48;
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [translateX] = useState(new Animated.Value(0));
  const [selectedCategories, setSelectedCategories] = useState<CategorySchema[]>([]);

  const handleCategoryPress = (category: CategorySchema, index: number) => {
    if (!category) return;
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newSelectedCategories);
    onFilterChange(newSelectedCategories);

    Animated.timing(selectedCategoryAnimations[index], {
      toValue: newSelectedCategories.includes(category) ? 1 : 0,
      duration: 50,
      useNativeDriver: false,
    }).start();
  };

 
  const handleCloseSidebar = () => {
    Animated.timing(translateX, {
      toValue: -sideBarWidth,
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
          right: -sideBarWidth + SidebarVisibleWidth,
          width: sideBarWidth - SidebarVisibleWidth,

          transform: [
            {
              translateX: translateX.interpolate({
                inputRange: [-sideBarWidth, 0],
                outputRange: [-sideBarWidth + SidebarVisibleWidth, 0],
                extrapolate: "clamp",
              }),
            },
          ],
        },
      ]}>
      <View style={{...styles.sidebarEdgeIndicator, left: -SidebarVisibleWidth - 3}}>
        <TouchableOpacity
          style={{...styles.sidebarEdge, zIndex: sidebarVisible ? 1001 : -1, width: SidebarVisibleWidth}}
          onPress={() => (sidebarVisible ? handleCloseSidebar() : handleOpenSidebar())}>
          <MaterialCommunityIcons
            adjustsFontSizeToFit
            name={icon || "tune-vertical"}
            size={48}
            color={sidebarVisible ? "green" : "red"}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.sidebarTitle}>Filter</Text>
      <View style={isLandScape ? styles.sidebarItemsRow : styles.sidebarItemsColumn}>
      {categories.map((category, index) => (
        <Animated.View
          key={category?.name}
          style={[
            styles.sidebarItem,
            {
              backgroundColor: selectedCategoryAnimations[index]?.interpolate({
                inputRange: [0, 1],
                outputRange: ["transparent", 'grey'],
              }),
            },
          ]}>
          <TouchableOpacity onPress={() => handleCategoryPress(category, index)}>
            <Text style={styles.sidebarItemText}>{category?.name}</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 5, // Add box shadow on Android
    shadowColor: "#000", // Add box shadow on iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: colors.summerWhite,
  },
  sidebarTitle: {
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Roboto-Regular",
    color: "#333",
  },
  sidebarItem: {
    borderBottomWidth: 0.25,
    borderBottomColor: colors.summerWhite,
    paddingVertical: 7,
  },
  sidebarItemText: {
    fontSize: 16,
    fontWeight: "bold",
    height: 55,
    textAlignVertical: "center",
    fontFamily: "Roboto-Bold",
    color: colors.summerDarkest,
    textAlign: "center",
  },
  sidebarEdgeIndicator: {
    position: "absolute",
    top: 35,
    zIndex: 1000,
    borderRadius: 4,
  },
  sidebarEdge: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    opacity: 0.95,
  },
  sidebarItemsRow: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    maxHeight: 150,
    overflow: 'hidden'
  },
  sidebarItemsColumn: {
    flexDirection: 'column',
  },
});
