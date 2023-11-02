import { Plan } from "../typings/types";
import {CategorySchema, ExerciseTypeSchema, ExerciseSchema, MonthSchema, PlanSchema, SettingsSchema, PlanPresetSchema} from "./config/realm";
import { colors } from "./utils/color";

export const initializeDB = (realm: Realm) => {
  const categories = realm.objects<CategorySchema>("Category");
  const exerciseTypes = realm.objects<ExerciseTypeSchema>("ExerciseType");
  const exercises = realm.objects<ExerciseSchema>("Exercise");
  const months = realm.objects<MonthSchema>("Month")
  const plans = realm.objects<PlanSchema>("Plan")
  const settings = realm.objects<SettingsSchema>("Settings")
  const planPresets = realm.objects<PlanPresetSchema>("PlanPreset")

  if (settings.length === 0) {
    realm.write(() => {
      realm.create("Settings", {
        isFirstTimeUser: true
      });
    });
  }

  type catColors = keyof typeof colors.categories

  if (categories.length === 0 && exerciseTypes.length === 0 && exercises.length === 0) {
    realm.write(() => {
      realm.delete(categories);
      realm.delete(exerciseTypes);
      realm.delete(exercises);
      realm.delete(months);
      realm.delete(plans)
      // Create categories
      const categoriesData = [
        {name: "Chest"},
        {name: "Back"},
        {name: "Shoulders"},
        {name: "Arms"},
        {name: "Legs"},
        {name: "Abs"},
      ];

      const createdCategories: CategorySchema[] = []; // Use an array instead of a Map
      categoriesData.forEach(e => {
        const createdCategory = realm.create<CategorySchema>("Category", {
          id: realm.objects<CategorySchema>("Category").length + 1,
          name: e.name,
          color: colors.categories[e.name as catColors]
        });
        createdCategories.push(createdCategory); // Add the created object to the array
      });

      // Create exercise types
      const exerciseTypesData = [
        // Chest    { name: "Bench Press", category: createdCategories[0]},
        {name: "Incline Bench Press", category: createdCategories[0]},
        {name: "Decline Bench Press", category: createdCategories[0]},
        {name: "Dumbbell Flyes", category: createdCategories[0]},
        {name: "Cable Crossover", category: createdCategories[0]},
        {name: "Push-Ups", category: createdCategories[0]},
        {name: "Dips", category: createdCategories[0]},

        // Back
        {name: "Bent-Over Row", category: createdCategories[1]},
        {name: "Pull-Up", category: createdCategories[1]},
        {name: "Chin-Up", category: createdCategories[1]},
        {name: "Lat Pulldown", category: createdCategories[1]},
        {name: "Seated Cable Row", category: createdCategories[1]},
        {name: "T-Bar Row", category: createdCategories[1]},

        // Shoulders
        {name: "Military Press", category: createdCategories[2]},
        {name: "Arnold Press", category: createdCategories[2]},
        {name: "Dumbbell Lateral Raise", category: createdCategories[2]},
        {name: "Barbell Upright Row", category: createdCategories[2]},
        {name: "Front Raise", category: createdCategories[2]},
        {name: "Face Pull", category: createdCategories[2]},
        {name: "Shrugs", category: createdCategories[2]},

        // Arms
        {name: "Bicep Curl", category: createdCategories[3]},
        {name: "Hammer Curl", category: createdCategories[3]},
        {name: "Tricep Pushdown", category: createdCategories[3]},
        {name: "Skullcrusher", category: createdCategories[3]},
        {name: "Dumbbell Overhead Extension", category: createdCategories[3]},
        {name: "Barbell Curl", category: createdCategories[3]},
        {name: "Close-Grip Bench Press", category: createdCategories[3]},

        // Legs
        {name: "Squat", category: createdCategories[4]},
        {name: "Leg Press", category: createdCategories[4]},
        {name: "Deadlift", category: createdCategories[4]},
        {name: "Lunges", category: createdCategories[4]},
        {name: "Leg Extension", category: createdCategories[4]},
        {name: "Leg Curl", category: createdCategories[4]},
        {name: "Calf Raise", category: createdCategories[4]},
        {name: "Seated Leg Curl", category: createdCategories[4]},

        // Abs
        {name: "Crunches", category: createdCategories[5]},
        {name: "Plank", category: createdCategories[5]},
        {name: "Russian Twist", category: createdCategories[5]},
        {name: "Leg Raise", category: createdCategories[5]},
        {name: "Ab Wheel Rollout", category: createdCategories[5]},

        // Glutes
        {name: "Hip Thrust", category: createdCategories[4]},
        {name: "Glute Bridge", category: createdCategories[4]},
        {name: "Lunges", category: createdCategories[4]},
        {name: "Step-Up", category: createdCategories[4]},
        {name: "Kickbacks", category: createdCategories[4]},
      ];
      const createdExerciseTypes: ExerciseTypeSchema[] = []; // Use an array instead of a Map
      exerciseTypesData.forEach(e => {
        const createdExerciseType = realm.create<ExerciseTypeSchema>("ExerciseType", {
          id: realm.objects<ExerciseTypeSchema>("ExerciseType").length + 1,
          name: e.name,
          category: e.category,
          exerciseCount: 0,
          averageMetric: 0,
          stdMetricReps: 10,
          stdMetricSets: 3
        });
        createdExerciseTypes.push(createdExerciseType); // Add the created object to the array
      });

      const exercisesData = [
        // Shoulder
        {type: createdExerciseTypes[10], sets: 3, reps: 10, weight: 40, date: new Date("2023-03-26")},
        {type: createdExerciseTypes[6], sets: 3, reps: 10, weight: 12.5, date: new Date("2023-03-26")},
        {type: createdExerciseTypes[11], sets: 3, reps: 10, weight: 50, date: new Date("2023-03-26")},
        {type: createdExerciseTypes[0], sets: 3, reps: 10, weight: 14, date: new Date("2023-03-26")},
        {type: createdExerciseTypes[12], sets: 3, reps: 10, weight: 40, date: new Date("2023-03-27")},
        {type: createdExerciseTypes[18], sets: 3, reps: 10, weight: 46, date: new Date("2023-03-27")},
        {type: createdExerciseTypes[2], sets: 3, reps: 10, weight: 15, date: new Date("2023-03-27")},
        {type: createdExerciseTypes[7], sets: 3, reps: 8, weight: 14, date: new Date("2023-03-27")},
        {type: createdExerciseTypes[13], sets: 3, reps: 7, weight: 60, date: new Date("2023-03-27")},
        {type: createdExerciseTypes[10], sets: 2, reps: 8, weight: 45, date: new Date("2023-03-27")},
        {type: createdExerciseTypes[18], sets: 3, reps: 10, weight: 46, date: new Date("2023-03-29")},
        {type: createdExerciseTypes[6], sets: 3, reps: 10, weight: 12.5, date: new Date("2023-03-29")},
        {type: createdExerciseTypes[0], sets: 3, reps: 10, weight: 17.5, date: new Date("2023-03-29")},
        {type: createdExerciseTypes[1], sets: 3, reps: 10, weight: 20, date: new Date("2023-03-29")},
        {type: createdExerciseTypes[6], sets: 2, reps: 6, weight: 17.5, date: new Date("2023-03-29")},
        {type: createdExerciseTypes[14], sets: 3, reps: 10, weight: 46, date: new Date("2023-03-29")},
        {type: createdExerciseTypes[9], sets: 3, reps: 8, weight: 50, date: new Date("2023-03-29")},
        {type: createdExerciseTypes[16], sets: 2, reps: 12, weight: 130, date: new Date("2023-03-31")},

        {type: createdExerciseTypes[18], sets: 3, reps: 10, weight: 46, date: new Date("2023-03-31")},
        {type: createdExerciseTypes[2], sets: 3, reps: 8, weight: 15, date: new Date("2023-03-31")},
        {type: createdExerciseTypes[19], sets: 3, reps: 10, weight: 50, date: new Date("2023-03-31")},

        {type: createdExerciseTypes[6], sets: 3, reps: 10, weight: 12.5, date: new Date("2023-03-31")},
        {type: createdExerciseTypes[3], sets: 3, reps: 10, weight: 5, date: new Date("2023-03-31")},

        {type: createdExerciseTypes[16], sets: 3, reps: 10, weight: 120, date: new Date("2023-03-31")},

        {type: createdExerciseTypes[6], sets: 2, reps: 6, weight: 17.5, date: new Date("2023-03-31")},

        {type: createdExerciseTypes[17], sets: 3, reps: 8, weight: 60, date: new Date("2023-03-31")},

        {type: createdExerciseTypes[18], sets: 3, reps: 15, weight: 46, date: new Date("2023-04-02")},
        {type: createdExerciseTypes[6], sets: 3, reps: 11, weight: 12.5, date: new Date("2023-04-02")},
        {type: createdExerciseTypes[0], sets: 3, reps: 11, weight: 17.5, date: new Date("2023-04-02")},

        {type: createdExerciseTypes[6], sets: 2, reps: 6, weight: 17.5, date: new Date("2023-04-02")},

        {type: createdExerciseTypes[15], sets: 3, reps: 9, weight: 50, date: new Date("2023-04-02")},
        {type: createdExerciseTypes[9], sets: 3, reps: 10, weight: 50, date: new Date("2023-04-02")},

        {type: createdExerciseTypes[18], sets: 3, reps: 10, weight: 53, date: new Date("2023-04-04")},
        {type: createdExerciseTypes[6], sets: 3, reps: 10, weight: 12.5, date: new Date("2023-04-04")},

        {type: createdExerciseTypes[7], sets: 3, reps: 10, weight: 14, date: new Date("2023-04-04")},

        {type: createdExerciseTypes[17], sets: 3, reps: 10, weight: 60, date: new Date("2023-04-04")},

        {type: createdExerciseTypes[8], sets: 3, reps: 10, weight: 17.5, date: new Date("2023-04-04")},
        {type: createdExerciseTypes[6], sets: 3, reps: 7, weight: 15, date: new Date("2023-04-04")},
        {type: createdExerciseTypes[10], sets: 3, reps: 10, weight: 40, date: new Date("2023-04-04")},
        {type: createdExerciseTypes[6], sets: 3, reps: 10, weight: 12.5, date: new Date("2023-04-04")},
        {type: createdExerciseTypes[11], sets: 3, reps: 10, weight: 50, date: new Date("2023-04-04")},
        {type: createdExerciseTypes[0], sets: 3, reps: 10, weight: 14, date: new Date("2023-04-04")},
        {type: createdExerciseTypes[12], sets: 3, reps: 10, weight: 40, date: new Date("2023-04-05")},
        {type: createdExerciseTypes[18], sets: 3, reps: 10, weight: 46, date: new Date("2023-04-05")},
        {type: createdExerciseTypes[2], sets: 3, reps: 10, weight: 15, date: new Date("2023-04-05")},
        {type: createdExerciseTypes[7], sets: 3, reps: 8, weight: 14, date: new Date("2023-04-05")},
        {type: createdExerciseTypes[13], sets: 3, reps: 7, weight: 60, date: new Date("2023-04-05")},
        {type: createdExerciseTypes[10], sets: 2, reps: 8, weight: 45, date: new Date("2023-04-05")},
        {type: createdExerciseTypes[18], sets: 3, reps: 10, weight: 46, date: new Date("2023-04-07")},
        {type: createdExerciseTypes[6], sets: 3, reps: 10, weight: 12.5, date: new Date("2023-04-07")},
        {type: createdExerciseTypes[0], sets: 3, reps: 10, weight: 17.5, date: new Date("2023-04-07")},
        {type: createdExerciseTypes[1], sets: 3, reps: 10, weight: 20, date: new Date("2023-04-07")},
        {type: createdExerciseTypes[6], sets: 2, reps: 6, weight: 17.5, date: new Date("2023-04-07")},
        {type: createdExerciseTypes[14], sets: 3, reps: 10, weight: 46, date: new Date("2023-04-07")},
        {type: createdExerciseTypes[9], sets: 3, reps: 8, weight: 50, date: new Date("2023-04-07")},
        {type: createdExerciseTypes[16], sets: 2, reps: 12, weight: 130, date: new Date("2023-04-09")},
        {type: createdExerciseTypes[6], sets: 2, reps: 15, weight: 0, date: new Date("2023-04-09")},
        {type: createdExerciseTypes[7], sets: 3, reps: 10, weight: 40, date: new Date("2023-04-10")},
        {type: createdExerciseTypes[8], sets: 3, reps: 12, weight: 25, date: new Date("2023-04-12")},
        {type: createdExerciseTypes[9], sets: 4, reps: 8, weight: 60, date: new Date("2023-04-14")},
        {type: createdExerciseTypes[10], sets: 3, reps: 12, weight: 30, date: new Date("2023-04-16")},
        {type: createdExerciseTypes[11], sets: 5, reps: 5, weight: 80, date: new Date("2023-04-18")},
        {type: createdExerciseTypes[12], sets: 4, reps: 6, weight: 70, date: new Date("2023-04-20")},
        {type: createdExerciseTypes[13], sets: 3, reps: 12, weight: 10, date: new Date("2023-04-22")},
        {type: createdExerciseTypes[14], sets: 2, reps: 15, weight: 0, date: new Date("2023-04-23")},
        {type: createdExerciseTypes[15], sets: 3, reps: 10, weight: 35, date: new Date("2023-04-24")},
        {type: createdExerciseTypes[16], sets: 2, reps: 12, weight: 130, date: new Date("2023-04-09")},

        {type: createdExerciseTypes[16], sets: 2, reps: 12, weight: 130, date: new Date("2023-04-25")},
        {type: createdExerciseTypes[6], sets: 2, reps: 15, weight: 0, date: new Date("2023-04-26")},
        {type: createdExerciseTypes[7], sets: 3, reps: 10, weight: 40, date: new Date("2023-04-27")},
        {type: createdExerciseTypes[8], sets: 3, reps: 12, weight: 25, date: new Date("2023-04-30")},
        {type: createdExerciseTypes[9], sets: 4, reps: 8, weight: 60, date: new Date("2023-04-30")},
        {type: createdExerciseTypes[10], sets: 3, reps: 12, weight: 30, date: new Date("2023-05-01")},
        {type: createdExerciseTypes[11], sets: 5, reps: 5, weight: 80, date: new Date("2023-05-02")},
        {type: createdExerciseTypes[12], sets: 4, reps: 6, weight: 70, date: new Date("2023-05-03")},
        {type: createdExerciseTypes[13], sets: 3, reps: 12, weight: 10, date: new Date("2023-05-3")},
        {type: createdExerciseTypes[14], sets: 2, reps: 15, weight: 0, date: new Date("2023-05-02")},
        {type: createdExerciseTypes[15], sets: 3, reps: 10, weight: 35, date: new Date("2023-01-05")},
        {type: createdExerciseTypes[16], sets: 2, reps: 12, weight: 130, date: new Date("2023-02-05")},
      ];
      /* for (const exercise of exercisesData) {
        const exerciseType = exercise.type;
        realm.create<ExerciseSchema>("Exercise", {
          id: realm.objects<ExerciseSchema>("Exercise").length + 1, // Add this line
          type: exerciseType as ExerciseTypeSchema,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          date: exercise.date,
        });
      } */
    });
    realm.write(() => {
      const et1 = exerciseTypes.find(e => e.id === 1)
      const et2 = exerciseTypes.find(e => e.id === 2)
      const et3 = exerciseTypes.find(e => e.id === 3)
      if(planPresets.length === 0) {
        const plan1: Plan = {
          week: 999,
          type: et1,
          sets: 3,
          reps: 10,
          weight: 50,
          completed: false,
          exceptional: false,
        }
        const plan2: Plan = {
          week: 999,
          type: et2,
          sets: 3,
          reps: 10,
          weight: 50,
          completed: false,
          exceptional: false,
        }
        const plan3: Plan = {
          week: 999,
          type: et3,
          sets: 3,
          reps: 10,
          weight: 50,
          completed: false,
          exceptional: false,
        }
        const maxId = 0
       
        realm.create("Plan", {
          ...plan1,
          id: maxId + 1
        })
        realm.create("Plan", {
          ...plan2,
          id: maxId + 2
        })
        realm.create("Plan", {
          ...plan3,
          id: maxId + 3
        })
    
        const thePlans = plans.filter(e => e.week === 999)
    
        realm.create("PlanPreset", {
          id: 1,
          name: "Monday",
          plans: [...thePlans]
        })}
    })
  }
};
