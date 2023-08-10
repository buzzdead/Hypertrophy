import React, { useState } from "react"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import NumberInput from "../../components/NumberInput"
import CustomButton from "../../components/CustomButton"
import { resetMetrics, setAllExerciseTypesMetrics } from "../../api/exerciseType"
import { ScrollView } from "react-native-gesture-handler"

export const Metrics = () => {
    const [sets, setSets] = useState(3)
    const [reps, setReps] = useState(10)
    const updateMetrics = async () => {
        await setAllExerciseTypesMetrics(sets, reps)
        await resetMetrics()
    }
    return (
        <SafeAreaView style={{ height: '100%'}}>
            <ScrollView contentContainerStyle={{justifyContent: 'center'}}>
            <Text style={{paddingVertical: 25, textAlign: 'center', fontFamily: 'Roboto-Medium', fontSize: 16}}>This is the standard metric for all exercise types, setting and saving this will change it for all exercise types.</Text>
            <NumberInput title={"Sets"} value={sets} onChange={setSets} />
            <NumberInput title={"Reps"} value={reps} onChange={setReps} />
            <View style={{width: '98%', alignItems: 'center'}}>
            <CustomButton size="SM" title={"Save"} onPress={updateMetrics}/>
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}