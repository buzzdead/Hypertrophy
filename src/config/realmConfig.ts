// realmConfig.ts
import Realm from "realm";

export class CategorySchema extends Realm.Object {
  static schema = {
    name: "Category",
    primaryKey: "id",
    properties: {
      id: { type: "int?", indexed: true, optional: true },
      name: "string",
    },
  };

  id!: number;
  name!: string;
}

export class ExerciseTypeSchema extends Realm.Object {
  static schema = {
    name: "ExerciseType",
    primaryKey: "id",
    properties: {
      id: { type: "int?", indexed: true, optional: true },
      name: "string",
      category: "Category",
    },
  };

  id!: number;
  name!: string;
  category!: CategorySchema;
}

export class ExerciseSchema extends Realm.Object {
  static schema = {
    name: "Exercise",
    primaryKey: "id",
    properties: {
      id: { type: "int?", indexed: true, optional: true },
      type: "ExerciseType",
      sets: "int",
      reps: "int",
      date: "date",
      weight: "float",
    },
  };

  id!: number;
  type!: ExerciseTypeSchema;
  sets!: number;
  reps!: number;
  date!: Date;
  weight!: number;
}

export class MonthSchema extends Realm.Object {
  static schema = {
    name: "Month",
    primaryKey: "id",
    properties: {
      id: { type: "int?", indexed: true, optional: true},
      year: "string",
      month: "int",
      exerciseCount: "int",
    },
  };

  id!: number;
  year!: string;
  month!: number;
  exerciseCount!: number;
}

const realmConfig: Realm.Configuration = {
  schema: [ExerciseSchema, ExerciseTypeSchema, CategorySchema, MonthSchema],
  schemaVersion: 10,
  onMigration: migration,
};

function migration(oldRealm: Realm, newRealm: Realm) {
  const exercises = oldRealm.objects("Exercise");
  if(oldRealm.schemaVersion < 10){
  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i] as ExerciseSchema; // cast to ExerciseSchema type
    const date = exercise.date; // should not produce an error now
    const month = date.getMonth();
    const year = date.getFullYear().toString();

    // Find or create the corresponding MonthSchema object
    
    let monthObj = newRealm.objects("Month").filtered("year == $0 AND month == $1", year, month)[0] as MonthSchema;

    if (!monthObj) {
      const id = newRealm.objects("Month").length + 1
      const newMonth = {id: id, year: year, month: month, exerciseCount: 1};
      newRealm.create("Month", newMonth);
    } else {
      monthObj.exerciseCount++;
    }
  }}
}



export default realmConfig;