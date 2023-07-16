import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { InfoHome, InfoProgress } from './Info';
import { Modal } from 'react-native-paper';
import { colors } from '../../utils/color';
import Contingent from '../../components/Contingent';

interface Props {
    visible: boolean
    onDismiss: () =>  void
    infoType: "Home" | "Progress"
}

export const InfoModal: React.FC<Props> = ({visible, onDismiss, infoType}) => {
    return (
      <Modal 
          visible={visible} 
          onDismiss={onDismiss} 
          contentContainerStyle={styles.modalContent}
          style={styles.modal}
      >
        
        <Contingent shouldRender={infoType === "Progress"}>
        <View style={{gap: 25}}>
        <Text style={styles.infoText}>Average metric: {InfoProgress.AvgMetric}</Text>
        <Text style={styles.infoText}>PR: {InfoProgress.PR}</Text>
        <Text style={styles.infoText}>Metric: {InfoProgress.Metric}</Text>
        </View>
        <View style={{gap: 25}}>
        <Text style={styles.infoText}>Graph: {InfoHome.Graph}</Text>
        <Text style={styles.infoText}>Plans: {InfoHome.Plans}</Text>
        </View>
        </Contingent>
        
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    infoText: {
        fontFamily: 'Roboto-BoldItalic',
        fontSize: 18,
        color: colors.summerDarkest
    },
    modal: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
    },
  });
  