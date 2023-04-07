import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import { CategorySchema } from '../../../../config/realmConfig';
import { useCategories } from '../../../../hooks/useCategories';
import { colors } from '../../../../utils/util';
import Picker from '../Picker/Picker';
import { pickerStyles } from '../Picker/PickerField';

type NewObjectModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, isCategory: boolean, category: Optional<CategorySchema>) => void;
  objectType: 'Category' | 'Exercise Type';
};

const NewObjectModal = ({ visible, onClose, onAdd, objectType}: NewObjectModalProps) => {
  const [objectName, setObjectName] = useState('');
  const categories = objectType === 'Exercise Type' ? useCategories() : null
  const [category, setCategory] = useState<Optional<CategorySchema>>()
  const [pickerVisible, setPickerVisible] = useState(false)
  const togglePicker = () => {
    setPickerVisible(!pickerVisible);
  };


  const handleAdd = () => {
    onAdd(objectName, objectType === 'Category', category);
  };

  const handleOnChange = (value: CategorySchema) => {
    console.log(value)
    setCategory(value)
  }

  const renderPicker = () => {
    return (
    <View>
      <View style={{ marginBottom: 16 }}>
        <View style={{flexDirection: 'row', justifyContent: "space-between", paddingBottom: 5}}>
        <Text style={pickerStyles.textFieldLabel}>{"Select category"}</Text>
        </View>
        <View style={[pickerStyles.pickerInputContainer]}>
          <TouchableOpacity style={pickerStyles.pickerInput} onPress={togglePicker}>
            <Text style={pickerStyles.pickerInputText}>{category?.name || ""}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePicker} style={pickerStyles.pickerDisplay}>
            <FontAwesomeIcon icon={faCaretDown} size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <Picker
        visible={pickerVisible}
        picker={380}
        maxWidth={300}
        items={categories || []}
        onSelect={(value) => handleOnChange(value)}
        onClose={togglePicker}
      />
    </View>
    )
  }

  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContent}>
        <TextInput
          value={objectName}
          onChangeText={setObjectName}
          placeholder={`${objectType} Name`}
          style={styles.input}
        />
        {categories && renderPicker()}
        <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={{flex: 1}} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
          <View style={{flex: 1}}>
        <Button title="Add" onPress={handleAdd} />
        </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 2,
    backgroundColor: "white",
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
    top: '30%',
    left: '10%',
    right: '10%',
  },
  input: {
    borderColor: '#BDBDBD',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  closeText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
});

export default NewObjectModal;
