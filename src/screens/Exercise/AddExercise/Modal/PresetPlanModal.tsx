import React, { useState } from "react"
import { Modal, TouchableWithoutFeedback, View, ScrollView, Text, TextInput, StyleSheet } from "react-native"
import PickerField from "../Picker/PickerField"
import CustomButton from "../../../../components/CustomButton"
import { colors } from "../../../../utils/color"

interface Props {
    onClose: () => void
    onAdd: (name: string) => void
    visible: boolean
    isLandscape: boolean
}

export const PresetPlanModal: React.FC<Props> = ({onClose, visible, isLandscape, onAdd}) => {
    const [objectName, setObjectName] = useState('')

    return (
        <Modal visible={visible} transparent onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose} accessibilityLabel={'modal for plan preset'}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <ScrollView
          style={{
            ...styles.modalContent,
            top: isLandscape ? '0%' : '30%',
            left: isLandscape ? '20%' : '10%',
            right: isLandscape ? '20%' : '10%',
            height: isLandscape ? '100%' : undefined,
          }}
        >
          <Text style={{ textAlign: 'center', fontFamily: 'Roboto-Bold', fontSize: 24, color: 'black', marginBottom: 10 }}>Add Plan Preset</Text>
          <TextInput value={objectName} onChangeText={setObjectName} placeholder={`Preset Name`} style={styles.input} />
          <View style={{ flexDirection: 'row', gap: 25, justifyContent: 'center' }}>
          <CustomButton size='SM' backgroundColor={colors.summerDark} titleColor={colors.summerWhite} title={'Cancel'} onPress={onClose} />
          <CustomButton
            size='SM'
            backgroundColor={colors.summerDark}
            titleColor={colors.accent}
            title={'Add'}
            onPress={() => onAdd(objectName)}
          />
        </View>
          </ScrollView>
          </Modal>
    )
}

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
  