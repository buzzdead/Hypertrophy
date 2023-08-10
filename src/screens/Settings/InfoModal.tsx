import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { InfoHome, InfoProgress } from './Info';
import { Modal } from 'react-native-paper';
import { colors } from '../../utils/color';
import Contingent from '../../components/Contingent';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  infoType: 'Home' | 'Progress';
}

export const InfoModal: React.FC<Props> = ({ visible, onDismiss, infoType }) => {
  function renderInfoText(label: string, value: string) {
    return (
      <View style={{flexDirection: 'column'}}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.infoText}>{value}</Text>
      </View>
    );
  }

  return (
    <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContent} style={styles.modal}>
      <Contingent shouldRender={infoType === 'Progress'}>
        <View style={{ gap: 25 }}>
          {renderInfoText('Average metric:', InfoProgress.AvgMetric)}
          {renderInfoText('PR:', InfoProgress.PR)}
          {renderInfoText('Metric:', InfoProgress.Metric)}
        </View>
        <View style={{ gap: 25 }}>
          {renderInfoText('Graph:', InfoHome.Graph)}
          {renderInfoText('Plans:', InfoHome.Plans)}
        </View>
      </Contingent>
    </Modal>
  );
};

const styles = StyleSheet.create({
  infoText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: colors.summerDark,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: colors.summerDarkest,
  },
});
