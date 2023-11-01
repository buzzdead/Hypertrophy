import React, { useState } from 'react';
import { Modal, View, TextInput, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import CustomButton from '../../../../components/CustomButton';
import { CategorySchema } from '../../../../config/realm';
import { useRealm, useScreenOrientation } from '../../../../hooks/hooks';
import { colors } from '../../../../utils/util';
import PickerField from '../Picker/PickerField';
import NumberInput from '../../../../components/NumberInput';
import { changeExerciseType } from '../../../../api/exerciseType';
import { ScrollView } from 'react-native-gesture-handler';

type NewObjectModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd?: (name: string, isCategory: boolean, category?: Nullable<CategorySchema>) => void;
  modalFunction?: (name: string, id: number, category?: CategorySchema) => void;
  id?: number;
  currentValue?: string;
  currentCategory?: CategorySchema;
  title?: string;
  isLandscape?: boolean;
  objectType: 'Category' | 'Exercise Type';
  name: 'Exercise Type' | 'Category';
  extra?: number[];
};

const NewObjectModal = ({
  visible,
  onClose,
  onAdd,
  objectType,
  modalFunction,
  id,
  currentValue,
  currentCategory,
  title,
  name,
  isLandscape = false,
  extra,
}: NewObjectModalProps) => {
  const [objectName, setObjectName] = useState(currentValue || '');
  const { data: categories } = useRealm<CategorySchema>({ schemaName: 'Category' });
  const [category, setCategory] = useState<Optional<CategorySchema>>(currentCategory);
  const [sets, setSets] = useState(extra !== undefined ? extra[1] : 0);
  const [reps, setReps] = useState(extra !== undefined ? extra[0] : 0);

  const handleAdd = async () => {
    if (extra !== undefined && sets !== extra[0] && reps !== extra[1] && id) await changeExerciseType(id, sets, reps);
    modalFunction && id ? modalFunction(objectName, id, category) : onAdd && onAdd(objectName, objectType === 'Category', category);
  };

  const handleOnChange = (value: CategorySchema) => {
    setCategory(value);
  };

  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose} accessibilityLabel={'modal for' + name}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <ScrollView
        style={{
          ...styles.modalContent,
          top: isLandscape ? (extra !== undefined ? '0%' : '10%') : '30%',
          left: isLandscape ? '20%' : '10%',
          right: isLandscape ? '20%' : '10%',
          height: isLandscape ? '100%' : undefined,
        }}
      >
        <Text style={{ textAlign: 'center', fontFamily: 'Roboto-Bold', fontSize: 24, color: 'black', marginBottom: 10 }}>Add {name}</Text>
        <TextInput value={objectName} onChangeText={setObjectName} placeholder={`${objectType} Name`} style={styles.input} />
        {objectType === 'Exercise Type' && (
          <PickerField
            name={"Category"}
            item={category!}
            items={categories}
            onChange={(value) => handleOnChange(value)}
            picker={isLandscape ? 80 : 460}
            maxWidth={isLandscape ? 335 : 295}
            left={isLandscape ? 240 : 60}
          />
        )}
        {extra !== undefined && (
          <View>
            <Text>Set standard metric for current Exercise Type</Text>

            <View
              style={{
                flexDirection: isLandscape ? 'row' : 'column',
                justifyContent: isLandscape ? 'space-evenly' : 'flex-start',
              }}
            >
              <NumberInput title='Sets' value={sets} onChange={setSets} />
              <NumberInput title='Reps' value={reps} onChange={setReps} />
            </View>
          </View>
        )}
        <View style={{ flexDirection: 'row', gap: 25, justifyContent: 'center' }}>
          <CustomButton size='SM' backgroundColor={colors.summerDark} titleColor={colors.summerWhite} title={'Cancel'} onPress={onClose} />
          <CustomButton
            size='SM'
            backgroundColor={colors.summerDark}
            titleColor={colors.accent}
            title={title || 'Add'}
            onPress={handleAdd}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 2,
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 8,
    width: '100%',
    marginHorizontal: -16,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 4,
    position: 'absolute',
    left: '10%',
    gap: 10,
    right: '10%',
  },
  input: {
    borderColor: '#BDBDBD',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  closeText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});

export default NewObjectModal;
