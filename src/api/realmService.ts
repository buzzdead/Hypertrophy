// RealmService.ts
import Realm from "realm";
import realmConfig, { CategorySchema, ExerciseSchema, ExerciseTypeSchema } from "../config/realmConfig";

class RealmService {
  private static instance: RealmService;
  private realm: Realm;

  private constructor() {
    this.realm = new Realm(realmConfig);
    /* const categories = this.realm.objects<CategorySchema>("Category");
    const exerciseTypes = this.realm.objects<ExerciseTypeSchema>("ExerciseType");
    const exercises = this.realm.objects<ExerciseSchema>("Exercise");


    this.realm.write(() => {
      this.realm.delete(exerciseTypes);
      this.realm.delete(categories);
      this.realm.delete(exercises)
      // Create categories
      const categoriesData = [
        { name: "Shoulder"},
        { name: "Arms"},
        { name: "Chest"},
        { name: "Legs"},
        { name: "Abs"},
        { name: "Back"}
      ];

      const createdCategories: CategorySchema[] = []; // Use an array instead of a Map
      categoriesData.forEach((e) => {
        const createdCategorie = this.realm.create<CategorySchema>("Category", {
          id: this.realm.objects<CategorySchema>("Category").length,
          name: e.name,
        });
        createdCategories.push(createdCategorie); // Add the created object to the array
      });
    
      // Create exercise types
      const exerciseTypesData = [
        // Shoulder
        { name: "Shoulder press", category: createdCategories[0]},
        { name: "Traps", category: createdCategories[0]},
        { name: "Face pull", category: createdCategories[0]},
        { name: "Front Lats", category: createdCategories[0]},
        { name: "Back Lats", category: createdCategories[0]},
        { name: "Side Lats", category: createdCategories[0]},
    
        // Arms
        { name: "Bicep Curl", category: createdCategories[1]},
        { name: "Skullcrusher", category: createdCategories[1]},
        { name: "Rocking Pushdown", category: createdCategories[1]},
    
        // Chest
        { name: "Bench press", category: createdCategories[2]},
        {  name: "Chest press", category: createdCategories[2]},
    
        // Legs
        {  name: "Reverse Leg Extension", category: createdCategories[3] },
        {  name: "Glute kickback", category: createdCategories[3] },
        {  name: "Squat", category: createdCategories[3] },
        {  name: "Leg curls", category: createdCategories[3] },
        {  name: "Leg extension", category: createdCategories[3] },
        {  name: "Seated Leg Press", category: createdCategories[3] },
        {  name: "Seated Calf Raise", category: createdCategories[3] },
    
        // Abs
        {  name: "Ab crunches", category: createdCategories[4] },

        {  name: "Lat Pulldown", category: createdCategories[5] }
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
    ];
    
    for (const exercise of exercisesData) {
      const exerciseType = exercise.type;
      this.realm.create<ExerciseSchema>("Exercise", {
        id: this.realm.objects<ExerciseSchema>("Exercise").length, // Add this line
        type: exerciseType as ExerciseTypeSchema,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        date: exercise.date,
      });
    }
  }) */}
    
    


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
