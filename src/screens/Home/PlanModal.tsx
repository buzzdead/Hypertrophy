import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Plan } from '../../../typings/types';
import { CheckBox } from '../../components/Checkbox';
import CustomButton from '../../components/CustomButton';
import NumberInput from '../../components/NumberInput';
import { CategorySchema, ExerciseTypeSchema } from '../../config/realm';
import { colors } from '../../utils/color';
import PickerField from '../Exercise/AddExercise/Picker/PickerField';
import Weight from '../Exercise/AddExercise/Weight';
import Toast from 'react-native-toast-message';

interface PlanModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onSave: (data: Omit<Plan, 'week' | 'completed'>) => void;
  data: Omit<Plan, 'week' | 'completed'>;
  exerciseTypes: ExerciseTypeSchema[];
  categories: CategorySchema[];
}

export const PlanModal: React.FC<PlanModalProps> = ({
  visible,
  onRequestClose,
  onSave,
  data,
  exerciseTypes,
  categories,
}) => {
  const [state, setState] = useState({
    reps: data.reps,
    sets: data.sets,
    id: data.id,
    weight: data.weight,
    category: categories[0],
    exerciseType: data.type,
    exerciseTypes: exerciseTypes,
    categories: categories,
    exceptional: data.exceptional,
  });

  const handleSave = () => {
    if (state.exerciseType?.id === 0 || state.exerciseType?.id === undefined) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Not a valid Exercise Type, check category  exercise type.',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 0,
      });
      return;
    }
    const d = {
      reps: state.reps,
      sets: state.sets,
      weight: state.weight,
      type: state.exerciseType,
      id: state.id,
      exceptional: state.exceptional,
    };
    onSave(d);
    onRequestClose();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType='slide'
      transparent
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <PickerField
            item={state.category || state.categories[0]}
            name={'Category'}
            left={25}
            picker={220}
            items={state.categories}
            onChange={(value) => setState({ ...state, category: value })}
          />
          <PickerField
            name={'Exercise Type'}
            picker={220}
            left={25}
            item={state.exerciseType}
            items={state.exerciseTypes.filter(
              (e) => e.category?.id === state.category?.id
            )}
            onChange={(value) => setState({ ...state, exerciseType: value })}
          />
          <View style={{ paddingTop: 100 }}>
            <Weight
              title={'Add weight'}
              value={state.weight}
              onChange={(value: any) => setState({ ...state, weight: value })}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <NumberInput
                title={'Sets'}
                value={data.sets}
                onChange={(value: any) => setState({ ...state, sets: value })}
              />
              <NumberInput
                title={'Reps'}
                value={data.reps}
                onChange={(value: any) => setState({ ...state, reps: value })}
              />
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
                onSelection={(b: boolean) =>
                  setState({ ...state, exceptional: b })
                }
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
                <CustomButton
                  titleColor={colors.accent}
                  size='M'
                  backgroundColor={colors.summerDark}
                  title='Save'
                  onPress={handleSave}
                />
              </View>
            </View>
          </View>
        </View>

        <Toast />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    justifyContent: 'center',
    height: '100%',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 25,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export default PlanModal;
