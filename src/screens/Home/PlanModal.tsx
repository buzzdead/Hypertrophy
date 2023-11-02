import React from 'react';
import { Modal, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Plan } from '../../../typings/types';
import { AddPlan } from './AddPlan';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { colors } from '../../utils/color';
import { AddFromPreset } from './AddFromPreset';
import Contingent from '../../components/Contingent';
import LoadingIndicator from '../../components/LoadingIndicator';

interface PlanModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onSave: (data: Partial<Plan> | Partial<Plan>[], additional?: number) => void;
  data: Partial<Plan>;
  isLandscape?: boolean;
  additional: number
  showTabs: boolean
  loading: boolean
  week: number
}

export const PlanModal: React.FC<PlanModalProps> = ({
  visible,
  onRequestClose,
  onSave,
  data,
  isLandscape = false,
  additional,
  showTabs = false,
  loading,
  week
}) => {
  const planProps = { onRequestClose, onSave, data, isLandscape };

  const FirstRoute = () => <AddPlan {...planProps} newPlan={showTabs}/>;
  const SecondRoute = () => <AddFromPreset {...planProps} additional={additional} loading={loading} week={week}/>;

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Add Plan' },
    { key: 'second', title: 'Add from preset' },
  ]);
  return loading ? <LoadingIndicator /> : (
    <Modal visible={visible} onRequestClose={onRequestClose} animationType='fade' transparent>
      <View style={styles.container}>
        <View style={styles.content}>
          <Contingent style={{width: '100%', height: '100%'}} shouldRender={showTabs}>
          <TabView
          swipeEnabled={false}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                labelStyle={{fontFamily: 'Roboto-Bold', color: 'black'}}
                activeColor={colors.summerButton}
                inactiveColor={colors.summerDark}
                style={{ backgroundColor: 'white', maxHeight: 100, elevation: 0}}
                indicatorStyle={{ backgroundColor: colors.summerButton }}
              />
              
            )}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            style={{gap: 15, display: 'flex'}}
          />
          <FirstRoute />
          </Contingent>
        </View>
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
    padding: 20,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
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
