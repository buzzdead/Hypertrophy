// realmConfig.ts
import Realm from "realm";

export class ExerciseSchema extends Realm.Object {
  static schema = {
    name: "Exercise",
    primaryKey: "id",
    properties: {
      id: "int",
      name: "string",
      sets: "int",
      reps: "int",
      date: "date",
      category: "string",
      weight: "float",
    },
  };

  id!: number;
  name!: string;
  sets!: number;
  reps!: number;
  date!: Date;
  weight!: number;
  category!: string;
}

const realmConfig: Realm.Configuration = {
  schema: [ExerciseSchema],
  schemaVersion: 3,
  onMigration: migration,
};

function migration(oldRealm: Realm, newRealm: Realm) {
  if (oldRealm.schemaVersion < 3) {
    const oldExercises = oldRealm.objects('Exercise');

    for (let i = 0; i < oldExercises.length; i++) {
      const oldExercise = oldExercises[i] as ExerciseSchema;

      // Create a new exercise object with the new schema and copy the old properties
      newRealm.create(
        'Exercise',
        {
          id: oldExercise.id,
          name: oldExercise.name,
          sets: oldExercise.sets,
          reps: oldExercise.reps,
          date: oldExercise.date,
          category: oldExercise.category,
          weight: oldExercise.weight || 0, // Set the weight property to 0 if it's not already defined
        },
        Realm.UpdateMode.Modified
      );
    }
  }
}

export default realmConfig;