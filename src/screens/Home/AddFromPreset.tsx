import { Text, View } from 'react-native';
import { PlanPresetSchema, PlanSchema } from '../../config/realm';
import { useRealm } from '../../hooks/useRealm';
import React, { useEffect, useState } from 'react';
import PickerField from '../Exercise/AddExercise/Picker/PickerField';
import WeekPlan from './WeekPlan';
import CustomButton from '../../components/CustomButton';
import { colors } from '../../utils/color';
import { AddPlan } from './AddPlan';
import { Plan } from '../../../typings/types';
import AddObject from '../Exercise/AddExercise/Modal/AddObject';
import { useScreenOrientation } from '../../hooks/useScreenOrientation';
import LoadingIndicator from '../../components/LoadingIndicator';
import { withLoading } from '../../utils/util';
import { Mutations, useMutations } from '../../hooks/useMutations';
import { editPlan, addPlan as planAdder, deletePlan } from '../../api/exercise';

interface Props {
  onRequestClose: () => void;
  data: any;
  onSave: (data: Partial<Plan> | Partial<Plan>[], additional?: number) => void;
  isLandscape: boolean;
  additional: number
  loading: boolean
  week: number
}

let theId = 0

export const AddFromPreset: React.FC<Props> = ({ onRequestClose, data, onSave, isLandscape, week }) => {
  const { data: planPresets, refresh, loading: presetsLoading } = useRealm<PlanPresetSchema>({ schemaName: 'PlanPreset' });
  const [planPreset, setPlanPreset] = useState<PlanPresetSchema>(planPresets.find(e => e.id === theId) ||  planPresets[0])
  const [addPlan, setAddPlan] = useState(false);
  const [loading, setLoading] = useState(false)
  const screenOrientation = useScreenOrientation();
  const { data: plans, mutateItem: mutataor} = useRealm<PlanSchema>({schemaName: 'Plan', mutateFunction: (item: PlanSchema, action: Mutations, additional?: number) => {
    return action === "ADD" ? planAdder(item, additional) : action === "SAVE" ? editPlan(item) : deletePlan(item.id);
  }})

  const customOnSave = async (d: any, additional?: number) => {
    onSave(d, additional);
    !additional && onRequestClose();
  };

  const handleSave = async (data: Partial<Plan> | Partial<Plan>[], additional?: number) => {
    const plan: PlanSchema | PlanSchema[] = Array.isArray(data)
      ? data.map((d) => {
          return { ...d, week: week, completed: false } as PlanSchema;
        })
      : [{ ...data, week: data.week ?? week, completed: false } as PlanSchema];
    await withLoading(
      async () => plan.forEach((p) => mutataor.mutateAsync({ item: p, action: 'ADD', additional: additional })),
      setLoading
    );
    !additional && onRequestClose();
  };

  const handleChange = (item: PlanPresetSchema) => {
    setPlanPreset(item);
    theId = item.id
  };

  const abc = planPreset?.plans?.map((e) => {
    return { sets: e.sets, reps: e.reps, type: e.type, exceptional: e.exceptional, weight: e.weight };
  });
  
  if(loading || presetsLoading) return <LoadingIndicator />
  return addPlan ? (
    <AddPlan
      isLandscape={isLandscape}
      onRequestClose={() => setAddPlan(false)}
      data={data}
      onSave={handleSave}
      week={999}
      additional={planPreset.id}
    />
  ) : (
    <View style={{ width: '100%', height: '100%' }}>
      <View style={{display: 'flex', flexDirection: 'row', gap: 40}}>
        <View style={{flex: 6}}>
      <PickerField
        name='Plan preset'
        left={25}
        maxWidth={400}
        picker={100}
        items={planPresets}
        item={planPreset}
        onChange={handleChange}
      />
      </View>
      <View style={{ justifyContent: 'flex-end', paddingBottom: 12, paddingRight: 12 }}>
        <AddObject isLandscape={screenOrientation.isLandscape} isCategory s={refresh} planPresetModal />
      </View>
      </View>
      {planPreset?.plans.length > 0 ? (
        <WeekPlan week={999} customPlans={planPreset.plans} />
      ) : (
        <View style={{minHeight: 320, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16}}>Add some plans relevant to this preset</Text>
        </View>
      )}
      <View style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 25, alignItems: 'center' }}>
        <CustomButton
          size='XXL'
          title='Add Plan'
          disabled={planPresets?.length === 0}
          titleColor={colors.summerWhite}
          backgroundColor={colors.summerDark}
          onPress={() => setAddPlan(true)}
        />
        <View style={{ display: 'flex', gap: 15, flexDirection: 'row' }}>
          <CustomButton
            size='M'
            title='Cancel'
            titleColor={colors.summerWhite}
            backgroundColor={colors.summerDark}
            onPress={onRequestClose}
          />
          <CustomButton
            size='M'
            title='Create plans'
            disabled={planPreset?.plans?.length <= 0}
            titleColor={colors.accent}
            backgroundColor={colors.summerDark}
            onPress={() => handleSave(abc)}
          />
        </View>
      </View>
    </View>
  );
};
