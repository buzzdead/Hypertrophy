import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { UseMutationResult } from 'react-query';
import { Plan } from '../../../typings/types';
import { addExercise, fetchPlanById, setPlanCompleted } from '../../api/exercise';
import Contingent from '../../components/Contingent';
import LoadingIndicator from '../../components/LoadingIndicator';
import { CategorySchema, ExerciseSchema, ExerciseTypeSchema, PlanSchema } from '../../config/realm';
import { useFocus, useMutations } from '../../hooks/hooks';
import { Mutations } from '../../hooks/useRealm';
import { colors } from '../../utils/color';
import PlanModal from './PlanModal';

interface Props extends Partial<Plan> {
  id?: number;
  newPlan?: boolean;
  week: number;
  exerciseTypes: ExerciseTypeSchema[];
  categories: CategorySchema[];
  mutatePlan: UseMutationResult<
    void | boolean,
    unknown,
    {
      item: PlanSchema;
      action: Mutations;
    },
    () => PlanSchema[] | null
  >;
}

export const PlanItem: React.FC<Props> = ({
  reps = 1,
  sets = 1,
  weight = 0,
  type = null,
  newPlan = false,
  completed,
  week,
  categories,
  exerciseTypes,
  mutatePlan,
  exceptional = false,
  id,
}) => {
  const [showModal, setShowModal] = useState(false);
  const isFocused = useFocus();
  const { mutateItem: completePlan } = useMutations('Plan', (plan: PlanSchema) => setPlanCompleted(plan));
  const { mutateItem: completeExercise } = useMutations('Exercise', (exercise: ExerciseSchema) => addExercise(exercise));
  const [loading, setLoading] = useState(false);

  const handleSave = (data: Omit<Plan, 'week' | 'completed'>) => {
    setLoading(true);
    const plan = { ...data, week: week, completed: false } as PlanSchema;
    setTimeout(() => mutatePlan.mutateAsync({ item: plan, action: newPlan ? 'ADD' : 'SAVE' }).then(() => setLoading(false)), 50);
  };

  const handleDelete = async () => {
    setLoading(true);
    const data = { id: id, week: week, type: type, sets: sets, reps: reps, weight: weight, exceptional: exceptional };
    setTimeout(async () => {
      if (id !== undefined) await mutatePlan.mutateAsync({ item: { ...data } as PlanSchema, action: 'DEL' }).then(() => setLoading(false));
    });
  };

  const handleComplete = async () => {
    if (!id) return;
    setLoading(true);
    setTimeout(async () => {
      const plan = await fetchPlanById(id);

      const currentDate = new Date();

      const month = currentDate.getMonth();

      const newExercise = {
        date: currentDate,
        month: month,
        id: 0,
        week: plan.week,
        sets: plan.sets,
        reps: plan.reps,
        weight: plan.weight,
        type: plan.type,
        exceptional: plan.exceptional,
      } as ExerciseSchema;

      await completePlan.mutateAsync({ item: plan, action: 'SAVE' });
      await completeExercise.mutateAsync({ item: newExercise, action: 'ADD' }).then(() => setLoading(false));
    }, 50);
  };

  type CategoryColors = keyof typeof colors.categories;

  if (!isFocused) return <LoadingIndicator />;

  return (
    <Contingent style={{ width: showModal ? 300 : 150, height: showModal ? 200 : 100 }} shouldRender={showModal}>
      <PlanModal
        data={{ reps, sets, weight, type, id, exceptional }}
        onSave={(data) => handleSave(data)}
        onRequestClose={() => setShowModal(false)}
        visible={showModal}
        categories={categories}
        exerciseTypes={exerciseTypes}
      />
      <Contingent shouldRender={!loading}>
        <TouchableOpacity
          style={{
            ...styles.container,
            backgroundColor: completed
              ? `${colors.categories[type?.category?.name as CategoryColors] + `66`}` || colors.categories.Default
              : `${colors.categories[type?.category?.name as CategoryColors] + `25`}` || colors.categories.Default,
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
          <Contingent shouldRender={!newPlan && !completed} style={{ position: 'absolute', zIndex: 123, alignSelf: 'flex-end', right: 0 }}>
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
              {newPlan ? '+' : type?.name}
            </Text>
            <Contingent shouldRender={!newPlan}>
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'Roboto-Bold', color: colors.summerDark, fontSize: 16 }}>{sets + ' x '}</Text>
                <Text style={{ fontFamily: 'Roboto-Bold', color: colors.summerDark, fontSize: 16 }}>{reps + ' x '}</Text>
                <Text style={{ fontFamily: 'Roboto-Bold', color: colors.summerDark, fontSize: 16 }}>{weight + 'kg'}</Text>
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
});

export default PlanItem;
