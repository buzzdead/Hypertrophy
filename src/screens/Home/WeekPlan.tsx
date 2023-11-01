import React from "react";
import {SafeAreaView, View} from "react-native";
import {FlatList} from "react-native-gesture-handler";
import {addPlan, deletePlan, editPlan} from "../../api/exercise";
import LoadingIndicator from "../../components/LoadingIndicator";
import {CategorySchema, ExerciseTypeSchema, PlanSchema} from "../../config/realm";
import {useRealm} from "../../hooks/hooks";
import {useFocus} from "../../hooks/useFocus";
import {Mutations} from "../../hooks/useRealm";
import {PlanItem} from "./PlanItem";
import Contingent from "../../components/Contingent";

interface Props {
  week: number;
  customPlans?: PlanSchema[]
  loading?: boolean
}

export const WeekPlan: React.FC<Props> = ({week, customPlans}) => {

  const presetMode = customPlans !== undefined

  const {
    data: plans,
    mutateItem: mutatePlan,
    loading: plansLoading,
  } = useRealm<PlanSchema>({
    schemaName: "Plan",
    mutateFunction: (item: PlanSchema, action: Mutations, additional?: number) => {
      return action === "ADD" ? addPlan(item, additional) : action === "SAVE" ? editPlan(item) : deletePlan(item.id);
    },
  });

  const focused = useFocus();

  const currentPlans = plans.filter(p => p.isValid() && p.week === week);
  currentPlans.sort((a, b) => Number(b.completed) - Number(a.completed));
  
  if (plansLoading || !focused)
    return (
      <View style={{width: "100%", height: "100%"}}>
        <LoadingIndicator />
      </View>
    );
  return (
    <SafeAreaView
      style={{width: "100%", paddingTop: 20, paddingHorizontal: presetMode ? 0 : 40, justifyContent: "center", alignItems: "center"}}>
      <Contingent style={{width: "100%", justifyContent: "center", alignItems: "center"}} shouldRender={!presetMode}>
      <FlatList
        ItemSeparatorComponent={() => <View style={{padding: 5}}></View>}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={customPlans || currentPlans}
        renderItem={({item}) => (
          <PlanItem
            week={week}
            completed={item.completed}
            mutatePlan={mutatePlan}
            plan={item}
          />
        )}
        ListFooterComponent={
          <View style={{paddingLeft: 10}}>
            <PlanItem
              completed={false}
              newPlan
              week={week}
              mutatePlan={mutatePlan}
            />
          </View>
        }
      />
      <View style={{display: 'flex', flexDirection: 'column', width: '100%', maxHeight: 300, minHeight: 300, gap: 50, alignItems: 'center'}}>
      <FlatList
        ItemSeparatorComponent={() => <View style={{padding: 5}}></View>}
        showsHorizontalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={{gap: 10}}
        data={customPlans || currentPlans}
        renderItem={({item}) => (
          <PlanItem
            week={week}
            completed={item.completed}
            mutatePlan={mutatePlan}
            plan={item}
          />
        )} />
       
        </View>
      </Contingent>
    </SafeAreaView>
  );
};

export default WeekPlan;
