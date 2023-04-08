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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ alignItems: "center", paddingTop: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Settings</Text>
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Edit</Text>
          <View style={{ minWidth: 200, gap: 10 }}>
            <CustomButton
              backgroundColor={colors.summerBlue}
              titleColor={colors.summerDarkest}

              title={"Edit Categories"}
              onPress={() => navigation.navigate("Categories")}
            />
            <CustomButton
              backgroundColor={colors.summerBlue}
              titleColor={colors.summerDarkest}

              title={"Edit ExerciseTypes"}
              onPress={() => navigation.navigate("ExerciseTypes")}
            />
          </View>
          <Text style={{ fontSize: 18, fontWeight: "bold", paddingTop: 20 }}>
            Adjust Dates for Exercise List
          </Text>
          <CustomButton
            backgroundColor={colors.summerBlue}
            titleColor={colors.summerDarkest}
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
