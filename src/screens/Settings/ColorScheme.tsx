import React, { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useRealm } from '../../hooks/hooks';
import { CategorySchema } from '../../config/realm';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomColorPicker from './CustomColorPicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { changeCategoryColor } from '../../api/category';
import Contingent from '../../components/Contingent';

interface Props {}

export const ColorScheme: React.FC<Props> = () => {
  const { data, mutateItem } = useRealm<CategorySchema>({
    schemaName: 'Category',
    mutateFunction: (category: CategorySchema) => changeCategoryColor(category),
  });

  const [state, setState] = useState({
    color: '',
    chooseColor: false,
    category: null as Nullable<CategorySchema>,
  });

  const setCurrent = (color: string, category: CategorySchema) => {
    setState({ color: color, chooseColor: true, category: category });
  };

  const SeparatorComponent = () => <View style={{ padding: 5 }}></View>;

  const renderItem = useCallback(
    ({ item }: { item: CategorySchema }) => (
      <View style={{ flexDirection: 'row', gap: 15 }}>
        <TouchableOpacity
          style={{ width: 70, height: 35, backgroundColor: item.color }}
          onPress={() => setCurrent(item.color, item)}
        />
        <Text style={{ fontSize: 24, textAlignVertical: 'center' }}>
          {item.name}
        </Text>
      </View>
    ),
    []
  );
  const handleChange = async (color: string) => {
    const newCategory = {
      id: state.category?.id,
      name: state.category?.name,
      color: color,
    } as CategorySchema;
    await mutateItem.mutateAsync({ item: newCategory, action: 'SAVE' });
    setState({ color: '', chooseColor: false, category: null });
  };
  
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Contingent shouldRender={state.chooseColor}>
        <CustomColorPicker
          currentColor={state.color}
          onCancel={() =>
            setState({ color: '', chooseColor: false, category: null })
          }
          changeColor={(color) => handleChange(color)}
        />
      </Contingent>
      <FlatList
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={SeparatorComponent}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      />
    </SafeAreaView>
  );
};
