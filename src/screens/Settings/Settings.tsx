// screens/Settings.tsx
import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { deleteCategory, deleteExerciseType, editCategory, editExerciseType } from "../../api/realmAPI";
import { CategorySchema, ExerciseTypeSchema } from "../../config/realmConfig";
import { colors } from "../../utils/util";
import CustomButton from "../../components/CustomButton";

export const handleDelete = (o: CategorySchema | ExerciseTypeSchema) => {
  o instanceof CategorySchema ? deleteCategory(o) : deleteExerciseType(o);
};

export const handleEdit = (id: number, name: string, category?: CategorySchema) => {
  category ? editExerciseType(id, name, category) : editCategory(id, name)
}

type Props = {
  navigation: any;
  route: any;
};

const Settings: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, gap: 10 }}>
      <ScrollView>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Text style={{ fontSize: 24, fontFamily: 'Roboto-Medium', color: colors.summerBlue, padding: 10, alignSelf: "center" }}>Edit</Text>
          <View style={{ minWidth: 200, gap: 10, alignSelf: "center" }}>
            <CustomButton
              backgroundColor={colors.summerDark}
              titleColor={colors.summerWhite}
              size="L"
              title={"Edit Categories"}
              onPress={() => navigation.navigate("Categories")}
            />
            <CustomButton
              backgroundColor={colors.summerDark}
              titleColor={colors.summerWhite}
              size="L"
              title={"Edit ExerciseTypes"}
              onPress={() => navigation.navigate("ExerciseTypes")}
            />
          </View>
          <View style={{alignSelf: 'center'}}>
          <Text style={{ fontSize: 24, padding: 10, fontFamily: 'Robot-Medium', paddingTop: 20, color: colors.summerBlue, alignSelf: "center"}}>
            Adjust Dates
          </Text>
          <CustomButton
          size="L"
            backgroundColor={colors.summerDark}
            titleColor={colors.summerWhite}
            title={"Adjust Dates"}
            onPress={() => {/* Handle date adjustment */}}
          />
          </View>
          {/* Add other settings options here */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
