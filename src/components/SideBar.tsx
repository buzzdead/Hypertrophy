// sidebar.tsx
import React, {useEffect, useState} from "react";
import {Animated, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {CategorySchema} from "../config/realmConfig";
import {colors} from "../utils/util";

const SidebarWidth = 150;
const SidebarVisibleWidth = 30;

interface SideBarProps {
  categories: CategorySchema[];
  onFilterChange: (selectedCategories: CategorySchema[]) => void;
  icon?: string;
  currentPage?: number
}

export const SideBar: React.FC<SideBarProps> = ({categories, onFilterChange, icon, currentPage}) => {
  const [selectedCategoryAnimations, setSelectedCategoryAnimations] = useState(
    categories.map(() => new Animated.Value(0)),
  );

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
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  useEffect(() => {
    onFilterChange(selectedCategories)
  }, [currentPage])
  useEffect(() => {
    if(selectedCategories.length > 0) return
    setSelectedCategoryAnimations(categories.map(() => new Animated.Value(0)));
    selectedCategories.length > 0 && setSelectedCategories(selectedCategories => {
      const newSelectedCategories = selectedCategories.filter(cat => categories.includes(cat));
      return newSelectedCategories;
    });
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
            name={icon || "tune-vertical"}
            size={28}
            color={sidebarVisible ? "green" : "red"}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.sidebarTitle}>Filter</Text>
      {categories.map((category, index) => (
        <Animated.View
          key={category?.name}
          style={[
            styles.sidebarItem,
            {
              backgroundColor: selectedCategoryAnimations[index]?.interpolate({
                inputRange: [0, 1],
                outputRange: ["transparent", colors.test1],
              }),
            },
          ]}>
          <TouchableOpacity onPress={() => handleCategoryPress(category, index)}>
            <Text style={styles.sidebarItemText}>{category?.name}</Text>
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
    zIndex: 1000,
    height: "75%",
    width: SidebarWidth - SidebarVisibleWidth,
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
  },
  sidebarItemText: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 11.4,
    fontFamily: "Roboto-Bold",
    color: colors.summerDarkest,
    textAlign: "center",
  },
  sidebarEdgeIndicator: {
    position: "absolute",
    top: 35,
    left: -SidebarVisibleWidth - 3,
    zIndex: 1000,
    backgroundColor: colors.summerWhite,
    borderRadius: 4,
  },
  sidebarEdge: {
    width: SidebarVisibleWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    opacity: 0.95,
  },
});
