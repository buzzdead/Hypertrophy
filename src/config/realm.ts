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
  schemaVersion: 11,
  onMigration: migration,
};

function migration(oldRealm: Realm, newRealm: Realm) {
  if(oldRealm.schemaVersion < 11){
  const oldCategories = oldRealm.objects<CategorySchema>("Category");
  const hasCategoryWithId0 = oldCategories.findIndex(c => c.id === 0) !== -1;

  if (hasCategoryWithId0) {
    const oldCategoryObjects = newRealm.objects<CategorySchema>("Category");
    oldCategoryObjects.forEach(category => category.id += 1)
      
    };
   
}}




export default realmConfig;