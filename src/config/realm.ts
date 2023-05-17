// realmConfig.ts
import Realm from "realm";
import { getWeekNumber } from "../utils/util";

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
      categoryId: "int",
    },
  };

  id!: number;
  name!: string;
  categoryId!: number;
}

export class ExerciseSchema extends Realm.Object {
  static schema = {
    name: "Exercise",
    primaryKey: "id",
    properties: {
      id: { type: "int?", indexed: true, optional: true },
      type: "int",
      sets: "int",
      reps: "int",
      date: "string",
      week: "int",
      month: "int",
      year: "int",
      weight: "float",
    },
  };

  id!: number;
  typeId!: number;
  sets!: number;
  reps!: number;
  date!: string;
  week!: number;
  year!: number;
  month!: number;
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

export class PlanSchema extends Realm.Object {
  static schema = {
    name: "Plan",
    primaryKey: "id",
    properties: {
      id: { type: "int?", indexed: true, optional: true},
      week: "int",
      type: "ExerciseType",
      sets: "int",
      reps: "int",
      weight: "float",
      completed: "bool"
    }
  };
  id!: number;
  week!: number;
  type!: ExerciseTypeSchema;
  sets!: number;
  reps!: number;
  weight!: number;
  completed!: boolean
}

export class OldExerciseSchema extends Realm.Object {
  static schema = {
    name: "Exercise",
    primaryKey: "id",
    properties: {
      id: { type: "int?", indexed: true, optional: true },
      type: "ExerciseType",
      sets: "int",
      reps: "int",
      date: "date", // this is still a Date
      weight: "float",
    },
  };

  id!: number;
  type!: ExerciseTypeSchema;
  sets!: number;
  reps!: number;
  date!: Date; // this is still a Date
  weight!: number;
}

export class OldExerciseTypeSchema extends Realm.Object {
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


const realmConfig: Realm.Configuration = {
  schema: [ExerciseSchema, ExerciseTypeSchema, CategorySchema, MonthSchema, PlanSchema],
  schemaVersion: 12,
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
    if (oldRealm.schemaVersion < 12) {
      
      const oldExercises = oldRealm.objects<OldExerciseSchema>('Exercise');
      const newExercises = newRealm.objects<ExerciseSchema>('Exercise');
      const oldExerciseTypes = oldRealm.objects<OldExerciseTypeSchema>('ExerciseType');
      const newExerciseTypes = newRealm.objects<ExerciseTypeSchema>('ExerciseType');
      
      for (let i = 0; i < oldExercises.length; i++) {
        const currentDate = oldExercises[i].date
        const currentUTCDate = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds()));
        const weekNumber = getWeekNumber(currentUTCDate);
        newExercises[i].date = oldExercises[i].date.toISOString();
        newExercises[i].typeId = oldExercises[i].type.id
        newExercises[i].week = weekNumber
        newExercises[i].year = currentUTCDate.getFullYear()
        newExercises[i].month = currentUTCDate.getMonth()
      }
      for(let i=0; i < oldExerciseTypes.length; i++) {
        newExerciseTypes[i].categoryId = oldExerciseTypes[i].category.id
      }
    }
}}




export default realmConfig;