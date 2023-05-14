import React from "react";
import {SafeAreaView, View} from "react-native";
import {FlatList} from "react-native-gesture-handler";
import LoadingIndicator from "../../components/LoadingIndicator";
import { CategorySchema, ExerciseTypeSchema, PlanSchema } from "../../config/realm";
import { useRealm } from "../../hooks/hooks";
import {PlanItem} from "./PlanItem";

interface Props {
  week: number
}

export const WeekPlan: React.FC<Props> = ({week}) => {
  const {data: plans, refresh: planRefresh, loading: plansLoading} = useRealm<PlanSchema>("Plan")
  const {data: exerciseTypes, loading: exerciseTypesLoading} = useRealm<ExerciseTypeSchema>("ExerciseType")
  const {data: categories, loading: categoriesLoading} = useRealm<CategorySchema>("Category")

  if(plansLoading || exerciseTypesLoading) return <View style={{width: '100%', height: '100%'}}><LoadingIndicator /></View>

  return (
    <SafeAreaView style={{width: "100%", paddingTop: 20, paddingHorizontal: 40, justifyContent: "center", alignItems: 'center'}}>
      <FlatList
        ItemSeparatorComponent={() => <View style={{padding: 5}}></View>}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={plans}
        renderItem={({item}) => <PlanItem refresh={planRefresh} categories={categories} exerciseTypes={exerciseTypes} reps={item.reps} sets={item.sets} weight={item.weight} type={item.type} week={week} completed={item.completed} id={item.id}/>}
        ListFooterComponent={<PlanItem refresh={planRefresh} categories={categories} exerciseTypes={exerciseTypes} newPlan week={week} completed={false} />}
      />
    </SafeAreaView>
  );
};

export default WeekPlan;
