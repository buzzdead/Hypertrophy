// sidebar.tsx
import React, {useState} from "react";
import {Animated, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SidebarWidth = 250;
const SidebarVisibleWidth = 30;

interface SideBarProps {
  categories: string[];
  onFilterChange: (selectedCategories: string[]) => void;
}

export const SideBar: React.FC<SideBarProps> = ({categories, onFilterChange}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [translateX] = useState(new Animated.Value(-SidebarWidth));
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryPress = (category: string) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newSelectedCategories);
    onFilterChange(newSelectedCategories);
  };

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
          <MaterialCommunityIcons adjustsFontSizeToFit name={sidebarVisible ? "chevron-left" : "chevron-right"} size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {/* Add your Sidebar content here */}
      <Text style={styles.sidebarTitle}>SidebarMenu</Text>
      {categories.map(category => (
        <TouchableOpacity
          key={category}
          style={[
            styles.sidebarItem,
            {backgroundColor: selectedCategories.includes(category) ? "#eee" : "transparent"},
          ]}
          onPress={() => handleCategoryPress(category)}>
          <Text style={styles.sidebarItemText}>{category}</Text>
        </TouchableOpacity>
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
    backgroundColor: "#f8f8f8",
    zIndex: 1000,
    width: SidebarWidth - SidebarVisibleWidth,
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  sidebarItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  sidebarItemText: {
    fontSize: 18,
  },
  sidebarEdgeIndicator: {
    position: "absolute",
    top: 35,
    left: -SidebarVisibleWidth,
    zIndex: 1000,
    backgroundColor: "#ccc", // You can change this color to match your design
    borderRadius: 4,
  },
  sidebarEdge: {
    width: SidebarVisibleWidth,
    justifyContent: "center",
    alignItems: "center",
  },
});
