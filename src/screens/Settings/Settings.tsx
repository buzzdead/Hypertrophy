// screens/Settings.tsx
import React from "react";
import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";
import { deleteCategory, deleteExerciseType } from "../../api/realmAPI";
import { CategorySchema, ExerciseTypeSchema } from "../../config/realmConfig";
import { colors } from "../../utils/util";
import CustomButton from "../../components/CustomButton";

export const handleDelete = (c: CategorySchema | ExerciseTypeSchema) => {
  c instanceof CategorySchema ? deleteCategory(c) : deleteExerciseType(c);
};

type Props = {
  navigation: any;
  route: any;
};

const Settings: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, gap: 10 }}>
      <ScrollView>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Text style={{ fontSize: 24, fontFamily: 'Roboto-Medium', color: colors.summerBlue, padding: 10 }}>Edit</Text>
          <View style={{ minWidth: 200, gap: 10 }}>
            <CustomButton
              backgroundColor={colors.summerDark}
              titleColor={colors.summerWhite}

              title={"Edit Categories"}
              onPress={() => navigation.navigate("Categories")}
            />
            <CustomButton
              backgroundColor={colors.summerDark}
              titleColor={colors.summerWhite}

              title={"Edit ExerciseTypes"}
              onPress={() => navigation.navigate("ExerciseTypes")}
            />
          </View>
          <Text style={{ fontSize: 24, padding: 10, fontFamily: 'Robot-Medium', paddingTop: 20, color: colors.summerBlue}}>
            Adjust Dates
          </Text>
          <CustomButton
            backgroundColor={colors.summerDark}
            titleColor={colors.summerWhite}
            title={"Adjust Dates"}
            onPress={() => {/* Handle date adjustment */}}
          />
          {/* Add other settings options here */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
