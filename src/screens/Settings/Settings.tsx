// screens/Settings.tsx
import React from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native';
import {
  deleteCategory,
  deleteExerciseType,
  editCategory,
  editExerciseType,
} from '../../api/realm';
import { CategorySchema, ExerciseTypeSchema } from '../../config/realm';
import { colors } from '../../utils/util';
import CustomButton from '../../components/CustomButton';

export const handleDelete = (
  o: CategorySchema | ExerciseTypeSchema
): Promise<void> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete: \n' + o.name + ' ?',
      [
        {
          text: 'Yes',
          onPress: () => {
            o instanceof CategorySchema
              ? deleteCategory(o)
              : deleteExerciseType(o);
            resolve();
          },
        },
        {
          text: 'No',
          onPress: () => {
            resolve();
          },
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  });
};

export const handleEdit = (
  id: number,
  name: string,
  category?: CategorySchema
) => {
  category ? editExerciseType(id, name, category) : editCategory(id, name);
};

type Props = {
  navigation: any;
  route: any;
};

const Settings: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, gap: 10 }}>
      <ScrollView>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'Roboto-Bold',
              color: colors.test6,
              padding: 20,
              alignSelf: 'center',
            }}
          >
            View \ Change
          </Text>
          <View
            style={{
              minWidth: 200,
              gap: 10,
              alignSelf: 'center',
              justifyContent: 'center',
            }}
          >
            <CustomButton
              backgroundColor={colors.summerDark}
              titleColor={colors.summerWhite}
              size='L'
              title={'Categories'}
              onPress={() => navigation.navigate('Categories')}
            />
            <CustomButton
              backgroundColor={colors.summerDark}
              titleColor={colors.summerWhite}
              size='L'
              title={'ExerciseTypes'}
              onPress={() => navigation.navigate('ExerciseTypes')}
            />
            <CustomButton
              backgroundColor={colors.summerDark}
              titleColor={colors.summerWhite}
              size='L'
              title={'ColorScheme'}
              onPress={() => navigation.navigate('ColorScheme')}
            />
          </View>
          <View style={{ alignSelf: 'center' }}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
