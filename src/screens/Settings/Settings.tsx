// screens/Settings.tsx
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { deleteCategory, deleteExerciseType, deletePlanPreset, editCategory, editExerciseType, editPlanPreset } from '../../api/realm';
import { CategorySchema, ExerciseTypeSchema, PlanPresetSchema } from '../../config/realm';
import { colors } from '../../utils/util';
import CustomButton from '../../components/CustomButton';
import { InfoModal } from './InfoModal';

export const handleDelete = (o: CategorySchema | ExerciseTypeSchema | PlanPresetSchema): Promise<void> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete: \n' + o.name + ' ?',
      [
        {
          text: 'Yes',
          onPress: () => {
            o instanceof CategorySchema ? deleteCategory(o) : o instanceof PlanPresetSchema ? deletePlanPreset(o) : deleteExerciseType(o);
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

export const handleEdit = (id: number, name: string, category?: CategorySchema) => {
  category ? editExerciseType(id, name, category) : editCategory(id, name);
};

export const handleEditPlanPreset = (planPreset: PlanPresetSchema, name: string) => {
  editPlanPreset(planPreset, name)
}

type Props = {
  navigation: any;
  route: any;
};

interface State {info: "Home" | "Progress", visible: boolean}

const Settings: React.FC<Props> = ({ navigation }) => {
  const [infoVisible, setInfoVisible] = useState<State>({info: "Home", visible: false})
  return (
    <SafeAreaView style={{  gap: 10, height: '100%'}}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 0, height: '100%'}}>
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
              title={'Plan Presets'}
              onPress={() => navigation.navigate('PlanPresets')}
            />
            <CustomButton
              backgroundColor={colors.summerDark}
              titleColor={colors.summerWhite}
              size='L'
              title={'ColorScheme'}
              onPress={() => navigation.navigate('ColorScheme')}
            />
            <CustomButton
              backgroundColor={colors.summerDark}
              titleColor={colors.summerWhite}
              size='L'
              title={'Metrics'}
              onPress={() => navigation.navigate('Metrics')}
            />
          </View>
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'Roboto-Bold',
              color: colors.test6,
              padding: 20,
              alignSelf: 'center',
            }}
          >
            About
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
              title={'Progress Tracking'}
              onPress={() => setInfoVisible({info: "Progress", visible: true})}
            />
             <CustomButton
              backgroundColor={colors.summerDark}
              titleColor={colors.summerWhite}
              size='L'
              title={'Home Screen'}
              onPress={() => setInfoVisible({info: "Home", visible: true})}
            />
          </View>
          <InfoModal visible={infoVisible.info === "Progress" && infoVisible.visible} onDismiss={() => setInfoVisible({...infoVisible, visible: false})} infoType='Progress'/>
          <InfoModal visible={infoVisible.info === "Home" && infoVisible.visible} onDismiss={() => setInfoVisible({...infoVisible, visible: false})} infoType='Home'/>
          <View style={{ alignSelf: 'center' }}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
