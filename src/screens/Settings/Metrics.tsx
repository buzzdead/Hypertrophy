import React, { useState } from "react"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import NumberInput from "../../components/NumberInput"
import CustomButton from "../../components/CustomButton"
import { resetMetrics, setAllExerciseTypesMetrics } from "../../api/exerciseType"

export const Metrics = () => {
    const [sets, setSets] = useState(3)
    const [reps, setReps] = useState(10)
    const updateMetrics = async () => {
        await setAllExerciseTypesMetrics(sets, reps)
        await resetMetrics()
    }
    return (
        <SafeAreaView style={{justifyContent: 'center', height: '100%'}}>
            <NumberInput title={"Sets"} value={sets} onChange={setSets} />
            <NumberInput title={"Reps"} value={reps} onChange={setReps} />
            <View style={{width: '98%', alignItems: 'center'}}>
            <CustomButton size="SM" title={"Save"} onPress={updateMetrics}/>
            </View>
        </SafeAreaView>
    )
}