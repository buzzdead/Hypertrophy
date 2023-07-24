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

interface Props {
  week: number;
}

export const WeekPlan: React.FC<Props> = ({week}) => {
  const {
    data: plans,
    mutateItem: mutatePlan,
    loading: plansLoading,
  } = useRealm<PlanSchema>({
    schemaName: "Plan",
    mutateFunction: (item: PlanSchema, action: Mutations) => {
      return action === "ADD" ? addPlan(item) : action === "SAVE" ? editPlan(item) : deletePlan(item.id);
    },
  });

  const {data: exerciseTypes, loading: exerciseTypesLoading} = useRealm<ExerciseTypeSchema>({
    schemaName: "ExerciseType",
  });
  const {data: categories, loading: categoriesLoading} = useRealm<CategorySchema>({schemaName: "Category"});
  const focused = useFocus();

  const currentPlans = plans.filter(p => p.isValid() && p.week === week);
  currentPlans.sort((a, b) => Number(b.completed) - Number(a.completed));
  
  if (plansLoading || exerciseTypesLoading || !focused)
    return (
      <View style={{width: "100%", height: "100%"}}>
        <LoadingIndicator />
      </View>
    );

  return (
    <SafeAreaView
      style={{width: "100%", paddingTop: 20, paddingHorizontal: 40, justifyContent: "center", alignItems: "center"}}>
      <FlatList
        ItemSeparatorComponent={() => <View style={{padding: 5}}></View>}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={currentPlans}
        renderItem={({item}) => (
          <PlanItem
            categories={categories}
            exerciseTypes={exerciseTypes}
            week={week}
            completed={item.completed}
            mutatePlan={mutatePlan}
            plan={item}
          />
        )}
        ListFooterComponent={
          <View style={{paddingLeft: 10}}>
            <PlanItem
              categories={categories}
              completed={false}
              exerciseTypes={exerciseTypes}
              newPlan
              week={week}
              mutatePlan={mutatePlan}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default WeekPlan;
