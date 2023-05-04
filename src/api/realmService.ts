// RealmService.ts
import Realm from "realm";
import realmConfig, { CategorySchema, ExerciseSchema, ExerciseTypeSchema } from "../config/realmConfig";

class RealmService {
  private static instance: RealmService;
  private realm: Realm;

  private constructor() {
    this.realm = new Realm(realmConfig);
    const categories = this.realm.objects<CategorySchema>("Category");
    const exerciseTypes = this.realm.objects<ExerciseTypeSchema>("ExerciseType");
    const exercises = this.realm.objects<ExerciseSchema>("Exercise");
    console.log(categories.length, exerciseTypes.length, exercises.length)
 

    if(categories.length === 0 && exerciseTypes.length === 0 && exercises.length === 0){
    this.realm.write(() => {
      this.realm.delete(categories);
      this.realm.delete(exerciseTypes);
      this.realm.delete(exercises);
      // Create categories
      const categoriesData = [    { name: "Chest"},    { name: "Back"},    { name: "Shoulders"},    { name: "Arms"},    { name: "Legs"},    { name: "Abs"}, ];

  const createdCategories: CategorySchema[] = []; // Use an array instead of a Map
  categoriesData.forEach((e) => {
    const createdCategory = this.realm.create<CategorySchema>("Category", {
      id: this.realm.objects<CategorySchema>("Category").length,
      name: e.name,
    });
    createdCategories.push(createdCategory); // Add the created object to the array
  });

  // Create exercise types
  const exerciseTypesData = [    // Chest    { name: "Bench Press", category: createdCategories[0]},
    { name: "Incline Bench Press", category: createdCategories[0]},
    { name: "Decline Bench Press", category: createdCategories[0]},
    { name: "Dumbbell Flyes", category: createdCategories[0]},
    { name: "Cable Crossover", category: createdCategories[0]},
    { name: "Push-Ups", category: createdCategories[0]},
    { name: "Dips", category: createdCategories[0]},

    // Back
    { name: "Bent-Over Row", category: createdCategories[1]},
    { name: "Pull-Up", category: createdCategories[1]},
    { name: "Chin-Up", category: createdCategories[1]},
    { name: "Lat Pulldown", category: createdCategories[1]},
    { name: "Seated Cable Row", category: createdCategories[1]},
    { name: "T-Bar Row", category: createdCategories[1]},

    // Shoulders
    { name: "Military Press", category: createdCategories[2]},
    { name: "Arnold Press", category: createdCategories[2]},
    { name: "Dumbbell Lateral Raise", category: createdCategories[2]},
    { name: "Barbell Upright Row", category: createdCategories[2]},
    { name: "Front Raise", category: createdCategories[2]},
    { name: "Face Pull", category: createdCategories[2]},
    { name: "Shrugs", category: createdCategories[2]},

    // Arms
    { name: "Bicep Curl", category: createdCategories[3]},
    { name: "Hammer Curl", category: createdCategories[3]},
    { name: "Tricep Pushdown", category: createdCategories[3]},
    { name: "Skullcrusher", category: createdCategories[3]},
    { name: "Dumbbell Overhead Extension", category: createdCategories[3]},
    { name: "Barbell Curl", category: createdCategories[3]},
    { name: "Close-Grip Bench Press", category: createdCategories[3]},

    // Legs
    { name: "Squat", category: createdCategories[4]},
    { name: "Leg Press", category: createdCategories[4]},
    { name: "Deadlift", category: createdCategories[4]},
    { name: "Lunges", category: createdCategories[4]},
    { name: "Leg Extension", category: createdCategories[4]},
{ name: "Leg Curl", category: createdCategories[4]},
{ name: "Calf Raise", category: createdCategories[7]},
{ name: "Seated Leg Curl", category: createdCategories[4]},

// Abs
{ name: "Crunches", category: createdCategories[5]},
{ name: "Plank", category: createdCategories[5]},
{ name: "Russian Twist", category: createdCategories[5]},
{ name: "Leg Raise", category: createdCategories[5]},
{ name: "Ab Wheel Rollout", category: createdCategories[5]},

// Glutes
{ name: "Hip Thrust", category: createdCategories[4]},
{ name: "Glute Bridge", category: createdCategories[4]},
{ name: "Lunges", category: createdCategories[4]},
{ name: "Step-Up", category: createdCategories[4]},
{ name: "Kickbacks", category: createdCategories[4]},

// Calves
{ name: "Standing Calf Raise", category: createdCategories[4]},
{ name: "Seated Calf Raise", category: createdCategories[4]},
{ name: "Donkey Calf Raise", category: createdCategories[4]},
{ name: "Toe Press", category: createdCategories[4]},
  ];
  const createdExerciseTypes: ExerciseTypeSchema[] = []; // Use an array instead of a Map
  exerciseTypesData.forEach((e) => {
  const createdExerciseType = this.realm.create<ExerciseTypeSchema>("ExerciseType", {
  id: this.realm.objects<ExerciseTypeSchema>("ExerciseType").length,
  name: e.name,
  category: e.category,
  });
  createdExerciseTypes.push(createdExerciseType); // Add the created object to the array
  });

    const exercisesData = [
      // Shoulder
      { type: createdExerciseTypes[10], sets: 3, reps: 10, weight: 40, date: new Date("2023-03-26")},
      { type: createdExerciseTypes[6], sets: 3, reps: 10, weight: 12.5, date: new Date("2023-03-26")},
      { type: createdExerciseTypes[11], sets: 3, reps: 10, weight: 50, date: new Date("2023-03-26")},
      { type: createdExerciseTypes[0], sets: 3, reps: 10, weight: 14, date: new Date("2023-03-26")},
      { type: createdExerciseTypes[12], sets: 3, reps: 10, weight: 40, date: new Date("2023-03-27") },
      { type: createdExerciseTypes[18], sets: 3, reps: 10, weight: 46, date: new Date("2023-03-27") },
      { type: createdExerciseTypes[2], sets: 3, reps: 10, weight: 15, date: new Date("2023-03-27") },
      { type: createdExerciseTypes[7], sets: 3, reps: 8, weight: 14, date: new Date("2023-03-27") },
      { type: createdExerciseTypes[13], sets: 3, reps: 7, weight: 60, date: new Date("2023-03-27") },
      { type: createdExerciseTypes[10], sets: 2, reps: 8, weight: 45, date: new Date("2023-03-27") },
      { type: createdExerciseTypes[18], sets: 3, reps: 10, weight: 46, date: new Date("2023-03-29") },
      { type: createdExerciseTypes[6], sets: 3, reps: 10, weight: 12.5, date: new Date("2023-03-29") },
      { type: createdExerciseTypes[0], sets: 3, reps: 10, weight: 17.5, date: new Date("2023-03-29") },
      { type: createdExerciseTypes[1], sets: 3, reps: 10, weight: 20, date: new Date("2023-03-29") },
      { type: createdExerciseTypes[6], sets: 2, reps: 6, weight: 17.5, date: new Date("2023-03-29") },
      { type: createdExerciseTypes[14], sets: 3, reps: 10, weight: 46, date: new Date("2023-03-29") },
      { type: createdExerciseTypes[9], sets: 3, reps: 8, weight: 50, date: new Date("2023-03-29") },
      { type: createdExerciseTypes[16], sets: 2, reps: 12, weight: 130, date: new Date("2023-03-31") },

      { type: createdExerciseTypes[18], sets: 3, reps: 10, weight: 46, date: new Date("2023-03-31") },
      { type: createdExerciseTypes[2], sets: 3, reps: 8, weight: 15, date: new Date("2023-03-31") },
      { type: createdExerciseTypes[19], sets: 3, reps: 10, weight: 50, date: new Date("2023-03-31") },

      { type: createdExerciseTypes[6], sets: 3, reps: 10, weight: 12.5, date: new Date("2023-03-31") },
      { type: createdExerciseTypes[3], sets: 3, reps: 10, weight: 5, date: new Date("2023-03-31") },

      { type: createdExerciseTypes[16], sets: 3, reps: 10, weight: 120, date: new Date("2023-03-31") },

      { type: createdExerciseTypes[6], sets: 2, reps: 6, weight: 17.5, date: new Date("2023-03-31") },

      { type: createdExerciseTypes[17], sets: 3, reps: 8, weight: 60, date: new Date("2023-03-31") },

      { type: createdExerciseTypes[18], sets: 3, reps: 15, weight: 46, date: new Date("2023-04-02") },
      { type: createdExerciseTypes[6], sets: 3, reps: 11, weight: 12.5, date: new Date("2023-04-02") },
      { type: createdExerciseTypes[0], sets: 3, reps: 11, weight: 17.5, date: new Date("2023-04-02") },

      { type: createdExerciseTypes[6], sets: 2, reps: 6, weight: 17.5, date: new Date("2023-04-02") },

      { type: createdExerciseTypes[15], sets: 3, reps: 9, weight: 50, date: new Date("2023-04-02") },
      { type: createdExerciseTypes[9], sets: 3, reps: 10, weight: 50, date: new Date("2023-04-02") },

      { type: createdExerciseTypes[18], sets: 3, reps: 10, weight: 53, date: new Date("2023-04-04") },
      { type: createdExerciseTypes[6], sets: 3, reps: 10, weight: 12.5, date: new Date("2023-04-04") },

      { type: createdExerciseTypes[7], sets: 3, reps: 10, weight: 14, date: new Date("2023-04-04") },

      { type: createdExerciseTypes[17], sets: 3, reps: 10, weight: 60, date: new Date("2023-04-04") },

      { type: createdExerciseTypes[8], sets: 3, reps: 10, weight: 17.5, date: new Date("2023-04-04") },
      { type: createdExerciseTypes[6], sets: 3, reps: 7, weight: 15, date: new Date("2023-04-04") },
      { type: createdExerciseTypes[10], sets: 3, reps: 10, weight: 40, date: new Date("2023-04-04")},
      { type: createdExerciseTypes[6], sets: 3, reps: 10, weight: 12.5, date: new Date("2023-04-04")},
      { type: createdExerciseTypes[11], sets: 3, reps: 10, weight: 50, date: new Date("2023-04-04")},
      { type: createdExerciseTypes[0], sets: 3, reps: 10, weight: 14, date: new Date("2023-04-04")},
      { type: createdExerciseTypes[12], sets: 3, reps: 10, weight: 40, date: new Date("2023-04-05") },
      { type: createdExerciseTypes[18], sets: 3, reps: 10, weight: 46, date: new Date("2023-04-05") },
      { type: createdExerciseTypes[2], sets: 3, reps: 10, weight: 15, date: new Date("2023-04-05") },
      { type: createdExerciseTypes[7], sets: 3, reps: 8, weight: 14, date: new Date("2023-04-05") },
      { type: createdExerciseTypes[13], sets: 3, reps: 7, weight: 60, date: new Date("2023-04-05") },
      { type: createdExerciseTypes[10], sets: 2, reps: 8, weight: 45, date: new Date("2023-04-05") },
      { type: createdExerciseTypes[18], sets: 3, reps: 10, weight: 46, date: new Date("2023-04-07") },
      { type: createdExerciseTypes[6], sets: 3, reps: 10, weight: 12.5, date: new Date("2023-04-07") },
      { type: createdExerciseTypes[0], sets: 3, reps: 10, weight: 17.5, date: new Date("2023-04-07") },
      { type: createdExerciseTypes[1], sets: 3, reps: 10, weight: 20, date: new Date("2023-04-07") },
      { type: createdExerciseTypes[6], sets: 2, reps: 6, weight: 17.5, date: new Date("2023-04-07") },
      { type: createdExerciseTypes[14], sets: 3, reps: 10, weight: 46, date: new Date("2023-04-07") },
      { type: createdExerciseTypes[9], sets: 3, reps: 8, weight: 50, date: new Date("2023-04-07") },
      { type: createdExerciseTypes[16], sets: 2, reps: 12, weight: 130, date: new Date("2023-04-09") },
      { type: createdExerciseTypes[6], sets: 2, reps: 15, weight: 0, date: new Date("2023-04-09") },
      { type: createdExerciseTypes[7], sets: 3, reps: 10, weight: 40, date: new Date("2023-04-10") },
      { type: createdExerciseTypes[8], sets: 3, reps: 12, weight: 25, date: new Date("2023-04-12") },
      { type: createdExerciseTypes[9], sets: 4, reps: 8, weight: 60, date: new Date("2023-04-14") },
      { type: createdExerciseTypes[10], sets: 3, reps: 12, weight: 30, date: new Date("2023-04-16") },
      { type: createdExerciseTypes[11], sets: 5, reps: 5, weight: 80, date: new Date("2023-04-18") },
      { type: createdExerciseTypes[12], sets: 4, reps: 6, weight: 70, date: new Date("2023-04-20") },
      { type: createdExerciseTypes[13], sets: 3, reps: 12, weight: 10, date: new Date("2023-04-22") },
      { type: createdExerciseTypes[14], sets: 2, reps: 15, weight: 0, date: new Date("2023-04-23") },
      { type: createdExerciseTypes[15], sets: 3, reps: 10, weight: 35, date: new Date("2023-04-24") },
      { type: createdExerciseTypes[16], sets: 2, reps: 12, weight: 130, date: new Date("2023-04-09") }
      
    ];
    /* for (const exercise of exercisesData) {
      const exerciseType = exercise.type;
      this.realm.create<ExerciseSchema>("Exercise", {
        id: this.realm.objects<ExerciseSchema>("Exercise").length + 1, // Add this line
        type: exerciseType as ExerciseTypeSchema,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        date: exercise.date,
      });
    } */
  
  })
}
}
    
    


  public static getInstance(): RealmService {
    if (!RealmService.instance) {
      RealmService.instance = new RealmService();
    }
    return RealmService.instance;
  }

  public getRealm(): Realm {
    return this.realm;
  }
}

export default RealmService;
