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

const realmConfig: Realm.Configuration = {
  schema: [ExerciseSchema, ExerciseTypeSchema, CategorySchema],
  schemaVersion: 6,
  onMigration: migration,
};

function migration(oldRealm: Realm, newRealm: Realm) {  
}

export default realmConfig;