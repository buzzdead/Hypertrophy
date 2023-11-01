import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Plan } from '../../../typings/types';
import { CheckBox } from '../../components/Checkbox';
import CustomButton from '../../components/CustomButton';
import NumberInput from '../../components/NumberInput';
import { colors } from '../../utils/color';
import PickerField from '../Exercise/AddExercise/Picker/PickerField';
import Weight from '../Exercise/AddExercise/Weight';
import Toast from 'react-native-toast-message';
import { showToast } from '../../utils/util';
import { ExerciseTypeSchema, CategorySchema } from '../../config/realm';
import { useRealm } from '../../hooks/useRealm';
import LoadingIndicator from '../../components/LoadingIndicator';

interface Props {
  data: any;
  isLandscape: boolean;
  onRequestClose: () => void;
  onSave: (data: Partial<Plan>, additional?: number) => void;
  week?: number
  additional?: number
  newPlan?: boolean
}

export const AddPlan = ({ data, isLandscape, onRequestClose, onSave, week, additional, newPlan = false }: Props) => {

  const {data: exerciseTypes, loading: exerciseTypesLoading} = useRealm<ExerciseTypeSchema>({
    schemaName: "ExerciseType",
  });
  const {data: categories, loading: categoriesLoading} = useRealm<CategorySchema>({schemaName: "Category"});

  const [state, setState] = useState({
    reps: data.reps,
    sets: data.sets,
    id: data.id,
    weight: data.weight,
    category: categories[0],
    exerciseType: data.type,
    exceptional: data.exceptional,
  });

  const handleSave = () => {
    const exerciseType = getExerciseType();
    if (exerciseType?.id === undefined) {
      showToast('Error', 'Not a valid Exercise Type, check category  exercise type.');
      return;
    }
    const d = {
      reps: state.reps,
      sets: state.sets,
      weight: state.weight,
      type: exerciseType,
      id: state.id,
      exceptional: state.exceptional,
      week: week
    };
    onSave(d, additional);
    onRequestClose();
  };

  const getExerciseType = () => {
    if (state.exerciseType) return state.exerciseType;
    const et = state.category
      ? exerciseTypes.find((e) => e.category.id === state.category.id)
      : exerciseTypes.find((e) => e.category.id === categories[0].id);
    return et !== undefined ? et : null;
  };

  if(exerciseTypesLoading || categoriesLoading) return <LoadingIndicator />

  return (
    <ScrollView>
      <PickerField
        item={state.category || categories[0]}
        name={'Category'}
        left={25}
        maxWidth={isLandscape ? 800 : 400}
        picker={100}
        items={categories}
        onChange={(value) => setState({ ...state, category: value })}
      />
      <PickerField
        name={'Exercise Type'}
        picker={isLandscape ? 150 : 200}
        maxWidth={isLandscape ? 800 : 400}
        left={25}
        item={getExerciseType()}
        items={exerciseTypes.filter((e) => e.category?.id === state.category?.id)}
        onChange={(value) => setState({ ...state, exerciseType: value })}
      />
      <View style={{ paddingTop: 100 }}>
        <Weight title={'Add weight'} value={state.weight} onChange={(value: any) => setState({ ...state, weight: value })} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <NumberInput title={'Sets'} value={data.sets} onChange={(value: any) => setState({ ...state, sets: value })} />
          <NumberInput title={'Reps'} value={data.reps} onChange={(value: any) => setState({ ...state, reps: value })} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: 25,
            gap: 25,
          }}
        >
          <Text
            style={{
              textAlignVertical: 'center',
              fontSize: 26,
              fontFamily: 'Roboto-Bold',
              color: colors.summerDark,
            }}
          >
            Exceptional exercise:{' '}
          </Text>
          <CheckBox
            isSelected={false}
            size='S'
            color={colors.summerDark}
            onSelection={(b: boolean) => setState({ ...state, exceptional: b })}
          />
        </View>
        <View style={styles.buttons}>
          <View style={{ width: 180 }}>
            <CustomButton
              titleColor={colors.summerWhite}
              size='M'
              backgroundColor={colors.summerDark}
              title='Cancel'
              onPress={onRequestClose}
            />
          </View>
          <View style={{ width: 180 }}>
            <CustomButton titleColor={colors.accent} size='M' backgroundColor={colors.summerDark} title={newPlan ? 'Create' : 'Save'} onPress={handleSave} />
          </View>
        </View>
      </View>
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 25,
  }
});
