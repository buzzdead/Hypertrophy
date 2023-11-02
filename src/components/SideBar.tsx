// sidebar.tsx
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CategorySchema, ExerciseTypeSchema } from '../config/realm';
import { colors } from '../utils/util';
import { FlatList } from 'react-native-gesture-handler'
import Contingent from './Contingent';

interface SideBarProps {
  categories: CategorySchema[];
  exerciseTypes?: ExerciseTypeSchema[];
  onCategoriesChange: (selectedCategories: CategorySchema[], exerciseTypes?: ExerciseTypeSchema[]) => void;
  onExerciseTypesChange?: (selectedExerciseTypes: ExerciseTypeSchema[]) => void;
  icon?: string;
  prevSelectedCat?: CategorySchema[];
  subCategories?: ExerciseTypeSchema[];
  isLandScape: boolean;
  pr?: boolean;
  decativatePR?: () => void;
}

export const SideBar: React.FC<SideBarProps> = React.memo(
  ({ categories, onCategoriesChange, onExerciseTypesChange, exerciseTypes, icon, isLandScape, prevSelectedCat, subCategories, pr }) => {
    const [sideBarWidth, setSideBarWidth] = useState(175);
    const [selectedCategoryAnimations, setSelectedCategoryAnimations] = useState(categories.map(() => new Animated.Value(0)));

    const SidebarVisibleWidth = 50;
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [translateX] = useState(new Animated.Value(0));
    const [selectedCategories, setSelectedCategories] = useState<CategorySchema[]>(prevSelectedCat?.filter((p) => p.isValid()) || []);
    const [selectedExerciseTypes, setSElectedExerciseTypes] = useState<ExerciseTypeSchema[]>(subCategories || []);
    const [currentExerciseTypes, setCurrentExerciseTypes] = useState<ExerciseTypeSchema[]>([]);

    const mappedExerciseTypes = categories.map((c) => {
      return { categoryId: c.id, exerciseTypes: exerciseTypes?.filter((e) => e?.category?.id === c?.id) || [] };
    });

    const handleCategoryPress = (category: CategorySchema, index: number) => {
      if (!category) return;
      if (selectedCategories.includes(category)) setCurrentExerciseTypes([]);
      if (selectedCategories.includes(category)) {
        const newET = selectedExerciseTypes.filter((e) => e.category.id !== category.id);
        setSElectedExerciseTypes(newET);
      }
      const newSelectedCategories = selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category];
      setSelectedCategories(newSelectedCategories);
      onCategoriesChange(
        newSelectedCategories,
        selectedCategories.includes(category) ? selectedExerciseTypes.filter((e) => e.category.id !== category.id) : selectedExerciseTypes
      );

      Animated.timing(selectedCategoryAnimations[index], {
        toValue: newSelectedCategories.includes(category) ? 1 : 0,
        duration: 50,
        useNativeDriver: false,
      }).start();
    };

    const handleExerciseTypePress = (exerciseType: ExerciseTypeSchema) => {
      const newSelectedExerciseTypes = selectedExerciseTypes.includes(exerciseType)
        ? selectedExerciseTypes.filter((e) => e !== exerciseType)
        : pr
        ? [exerciseType]
        : [...selectedExerciseTypes, exerciseType];
      setSElectedExerciseTypes(newSelectedExerciseTypes);
      onExerciseTypesChange && onExerciseTypesChange(newSelectedExerciseTypes);
    };

    const handleShowExerciseTypes = (id: number) => {
      const current = mappedExerciseTypes.find((m) => m.categoryId === id)?.exerciseTypes;
      currentExerciseTypes[0]?.category.id === id ? setCurrentExerciseTypes([]) : current !== undefined && setCurrentExerciseTypes(current);
    };

    useEffect(() => {
      categories.forEach((s, id) => {
        if (!prevSelectedCat?.includes(s)) return;
        Animated.timing(selectedCategoryAnimations[id], {
          toValue: 1,
          duration: 50,
          useNativeDriver: false,
        }).start();
      });
    }, [prevSelectedCat]);

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
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <View style={{ ...styles.sidebarEdgeIndicator, left: -SidebarVisibleWidth - 3 }}>
          <TouchableOpacity
            style={{ ...styles.sidebarEdge, zIndex: sidebarVisible ? 1001 : -1, width: SidebarVisibleWidth }}
            onPress={() => (sidebarVisible ? handleCloseSidebar() : handleOpenSidebar())}
          >
            <MaterialCommunityIcons
              adjustsFontSizeToFit
              name={icon || 'tune-vertical'}
              size={48}
              color={sidebarVisible ? 'green' : 'red'}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.sidebarTitle}>Filter</Text>
        <View style={{ flexDirection: 'row', }}>
          <Contingent shouldRender={!sidebarVisible}>
              <FlatList
                data={currentExerciseTypes}
                keyExtractor={(e) => `${e.name}-${e.id}`}
                scrollEnabled
                style={{maxHeight: isLandScape ? 125 : '100%', zIndex: 9128738127, position: 'absolute', left: -105, width: 105,}}
                
                renderItem={({ item: e }) => (
                  <TouchableOpacity
                    style={{ backgroundColor: selectedExerciseTypes.includes(e) ? 'grey' : colors.summerWhite }}
                    onPress={() => handleExerciseTypePress(e)}
                    activeOpacity={1}
                  >
                    <Text style={styles.sidebarItemText}>{e.name}</Text>
                  </TouchableOpacity>
                )}
              />
              </Contingent>

          <View style={isLandScape ? styles.sidebarItemsRow : styles.sidebarItemsColumn}>
            <FlatList
              data={categories.filter((c) => c.isValid())}
              keyExtractor={(category) => `${category.name}-${category.id}`}
              renderItem={({ item: category, index }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {selectedCategories.length > 0 &&
                    subCategories !== undefined &&
                    !sidebarVisible &&
                    selectedCategories.some((e) => e.id === category.id) && (
                      <View
                        style={{
                          width: 20,
                          height: 70,
                          zIndex: 10, // A more reasonable zIndex value
                          backgroundColor: currentExerciseTypes[0]?.category.id === category.id ? colors.error : colors.summerBlue,
                        }}
                      >
                        <TouchableOpacity
                          style={{ flex: 1 }} // Ensures the TouchableOpacity takes up the full space
                          onPress={() => handleShowExerciseTypes(category.id)}
                        />
                      </View>
                    )}
                  <Animated.View
                    key={category?.name}
                    style={[
                      styles.sidebarItem,
                      {
                        width: '100%',
                        backgroundColor: selectedCategoryAnimations[index]?.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['transparent', 'grey'],
                        }),
                      },
                    ]}
                  >
                    <TouchableOpacity onPress={() => handleCategoryPress(category, index)}>
                      <Text style={styles.sidebarItemText}>{category?.name}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              )}
            />
          </View>
        </View>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    zIndex: 1000,
    elevation: 55, // Add box shadow on Android
    shadowColor: colors.summerDarkest, // Add box shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    backgroundColor: colors.summerWhite,
  },
  sidebarTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Roboto-Regular',
    color: '#333',
  },
  sidebarItem: {
    borderBottomWidth: 0.25,
    borderBottomColor: colors.summerWhite,
    paddingVertical: 7,
  },
  sidebarItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    height: 55,
    textAlignVertical: 'center',
    fontFamily: 'Roboto-Bold',
    color: colors.summerDarkest,
    textAlign: 'center',
  },
  sidebarEdgeIndicator: {
    position: 'absolute',
    top: 10,
    zIndex: 1000,
    borderRadius: 4,
  },
  sidebarEdge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    opacity: 0.95,
  },
  sidebarItemsRow: {
    flexDirection: 'column',
    maxHeight: 125,
  },
  sidebarItemsColumn: {
    flexDirection: 'column',
  },
});
