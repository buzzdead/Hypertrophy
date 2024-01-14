import React from 'react';
import { Text, View } from 'react-native';
import { CheckBox } from '../../components/Checkbox';
import Contingent from '../../components/Contingent';
import CustomButton from '../../components/CustomButton';
import { colors } from '../../utils/color';
import { ExerciseTypeSchema } from '../../config/realm';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
  pr: boolean;
  isLandscape: boolean;
  exerciseType: ExerciseTypeSchema;
  metric: boolean;
  numberOfExerciseTypes: number;
  onChangeMetric: () => void;
  onChangePr: () => void;
}

export const ProgressTrackingTop: React.FC<Props> = ({
  exerciseType,
  pr,
  isLandscape,
  metric,
  numberOfExerciseTypes,
  onChangeMetric,
  onChangePr,
}) => {
  return (
    <View style={{ position: 'absolute', top: 10, left: 15, width: '100%', alignItems: isLandscape ? 'center' : 'flex-start' }}>
      <Contingent shouldRender={pr}>
        <Text style={{marginTop: 20, fontFamily: 'Roboto-Black' }}>{`Exercise: ${exerciseType?.name} - Averge Metric: ${Math.round(
          exerciseType?.averageMetric
        )}`}</Text>
      </Contingent>
      <View
        style={{
          position: 'absolute',
          top: isLandscape ? 0 : hp('7%'),
          flexDirection: isLandscape ? 'column' : 'row',
          justifyContent: isLandscape ? 'flex-start' : 'center',
          gap: 20,
          marginTop: 25,
          width: '100%',
          alignItems: isLandscape ? 'flex-start' : 'center',
        }}
      >
        <CustomButton size={'SM'} title={metric ? 'Exercises' : 'Metric'} onPress={onChangeMetric} />
        <View style={{ flexDirection: 'row', marginRight: 15, gap: isLandscape ? 5 : 0,}}>
          <Text
            style={{
              textAlignVertical: 'center',
              fontFamily: 'Roboto-Bold',
              color: colors.summerDarkest,
              
              fontSize: isLandscape ? 16 : 20,
              marginHorizontal: isLandscape ? 0 : 10,
              paddingLeft: isLandscape ? 0 : 10,
            }}
          >
            Show PR
          </Text>
          <CheckBox disabled={numberOfExerciseTypes !== 1} isSelected={pr} onSelection={onChangePr} />
        </View>
      </View>
    </View>
  );
};
