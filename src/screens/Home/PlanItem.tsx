import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { UseMutationResult } from 'react-query';
import { Plan } from '../../../typings/types';
import { addExercise, fetchPlanById, setPlanCompleted } from '../../api/exercise';
import Contingent from '../../components/Contingent';
import LoadingIndicator from '../../components/LoadingIndicator';
import { CategorySchema, ExerciseSchema, ExerciseTypeSchema, PlanPresetSchema, PlanSchema } from '../../config/realm';
import { useFocus, useMutations, useScreenOrientation } from '../../hooks/hooks';
import { Mutations } from '../../hooks/useRealm';
import { CatColors, colors } from '../../utils/color';
import PlanModal from './PlanModal';
import { PlanToExercise, withLoading } from '../../utils/util';

interface Props {
  plan?: Plan;
  id?: number;
  newPlan?: boolean;
  week: number;
  completed: boolean;
  mutatePlan: UseMutationResult<
    void | boolean,
    unknown,
    {
      item: PlanSchema;
      action: Mutations;
      additional?: number;
    },
    () => PlanSchema[] | null
  >;
}

export const PlanItem: React.FC<Props> = ({
  plan = {
    reps: 10,
    sets: 3,
    weight: 15,
    type: null,
    exceptional: false,
    id: undefined,
  },
  newPlan = false,
  week,
  mutatePlan,
  completed,
}) => {
  const [showModal, setShowModal] = useState(false);
  const isFocused = useFocus();
  const { mutateItem: completePlan } = useMutations('Plan', (plan: PlanSchema) => setPlanCompleted(plan));
  const { mutateItem: exercises } = useMutations('Exercise', (exercise: ExerciseSchema) => addExercise(exercise));
  const [loading, setLoading] = useState(false);
  const [additional, setAdditional] = useState(0)
  const screenOrientation = useScreenOrientation();

  const handleSave = async (data: Partial<Plan> | Partial<Plan>[], additional?: number) => {
    const plan: PlanSchema | PlanSchema[] = Array.isArray(data)
      ? data.map((d) => {
          return { ...d, week: week, completed: false } as PlanSchema;
        })
      : [{ ...data, week: data.week ?? week, completed: false } as PlanSchema];
    await withLoading(
      async () => plan.forEach((p) => mutatePlan.mutateAsync({ item: p, action: newPlan ? 'ADD' : 'SAVE', additional: additional })),
      setLoading
    );
    if(additional) setAdditional(additional)
  };

  const handleDelete = () => {
    if (plan.id) {
      withLoading(() => mutatePlan.mutateAsync({ item: { id: plan.id } as PlanSchema, action: 'DEL' }), setLoading);
    }
  };

  const handleComplete = async () => {
    if (!plan.id) return;

    const currentPlan = await fetchPlanById(plan.id);
    const currentDate = new Date();
    const month = currentDate.getMonth();

    const newExercise = PlanToExercise(currentPlan, currentDate, month, 0);

    withLoading(
      () => [completePlan.mutateAsync({ item: currentPlan, action: 'SAVE' }), exercises.mutateAsync({ item: newExercise, action: 'ADD' })],
      setLoading
    );
  };

  if (!isFocused) return <LoadingIndicator />;
  return (
    <Contingent style={{ width: showModal ? 300 : 150, height: showModal ? 200 : 100 }} shouldRender={showModal}>
      <PlanModal
        data={plan}
        showTabs={newPlan}
        additional={additional}
        onSave={(data, additional?: number) => handleSave(data, additional)}
        onRequestClose={() => setShowModal(false)}
        visible={showModal}
        loading={loading}
        week={week}
        isLandscape={screenOrientation.isLandscape}
      />
      <Contingent shouldRender={!loading}>
        <TouchableOpacity
          style={{
            ...styles.container,
            backgroundColor: completed
              ? `${colors.categories[plan.type?.category?.name as CatColors] + `66`}` || colors.categories.Default
              : `${colors.categories[plan.type?.category?.name as CatColors] + `25`}` || colors.categories.Default,
          }}
          onPress={() => setShowModal(true)}
        >
          <Contingent shouldRender={!newPlan} style={{ position: 'absolute', zIndex: 123, alignSelf: 'flex-end' }}>
            <TouchableOpacity onPress={handleDelete} style={{ padding: 5, paddingBottom: 10 }}>
              <MaterialCommunityIcons
                adjustsFontSizeToFit
                name={completed ? 'close-thick' : 'close-outline'}
                size={26}
                color={colors.error}
              />
            </TouchableOpacity>
          </Contingent>
          <Contingent
            shouldRender={!newPlan && !completed && week !== 999}
            style={{ position: 'absolute', zIndex: 123, alignSelf: 'flex-end', right: 0 }}
          >
            <TouchableOpacity onPress={handleComplete} style={{ padding: 5, paddingBottom: 10 }}>
              <MaterialCommunityIcons adjustsFontSizeToFit name={'check-outline'} size={26} color={'green'} />
            </TouchableOpacity>
          </Contingent>
          <View style={{ width: '100%' }}>
            <Text
              numberOfLines={1}
              ellipsizeMode='tail'
              style={{
                textAlign: 'center',
                fontSize: newPlan ? 42 : 20,
                paddingVertical: newPlan ? 20 : 5,
                fontFamily: 'Roboto-Bold',
                color: colors.summerDark,
              }}
            >
              {newPlan ? '+' : plan.type?.name}
            </Text>
            <Contingent shouldRender={!newPlan}>
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <Text style={styles.newPlan}>{plan.sets + ' x '}</Text>
                <Text style={styles.newPlan}>{plan.reps + ' x '}</Text>
                <Text style={styles.newPlan}>{plan.weight + 'kg'}</Text>
              </View>
            </Contingent>
          </View>
        </TouchableOpacity>
        <View style={{ width: '100%', height: '100%' }}>
          <LoadingIndicator />
        </View>
      </Contingent>
    </Contingent>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    borderWidth: 4,
    borderRadius: 10,
    borderColor: colors.summerDark,
    width: 150,
    height: 100,
  },
  newPlan: {
    fontFamily: 'Roboto-Bold',
    color: colors.summerDark,
    fontSize: 16,
  },
});

export default PlanItem;
