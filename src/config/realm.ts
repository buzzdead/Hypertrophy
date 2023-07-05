// realmConfig.ts
import Realm from "realm";
import { getWeekNumber } from "../utils/date";
import { colors } from "../utils/color";

export class CategorySchema extends Realm.Object {
  static schema = {
    name: "Category",
    primaryKey: "id",
    properties: {
      id: { type: "int", indexed: true},
      name: "string",
      color: "string",
    },
  };

  id!: number;
  name!: string;
  color!: string;
}

export class ExerciseTypeSchema extends Realm.Object {
  static schema = {
    name: "ExerciseType",
    primaryKey: "id",
    properties: {
      id: { type: "int", indexed: true},
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
      id: { type: "int", indexed: true},
      week: { type: "int", indexed: true },
      month: { type: "int", indexed: true },
      type: "ExerciseType",
      sets: "int",
      reps: "int",
      date: "date",
      weight: "float",
      exceptional: "bool"
    },
  };

  id!: number;
  type!: ExerciseTypeSchema;
  sets!: number;
  reps!: number;
  date!: Date;
  weight!: number;
  week!: number
  month!: number
  exceptional!: boolean
}

export class MonthSchema extends Realm.Object {
  static schema = {
    name: "Month",
    primaryKey: "id",
    properties: {
      id: { type: "int", indexed: true},
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
      id: { type: "int", indexed: true},
      week: "int",
      type: "ExerciseType",
      sets: "int",
      reps: "int",
      weight: "float",
      completed: "bool",
      exceptional: "bool",
    }
  };
  id!: number;
  week!: number;
  type!: ExerciseTypeSchema;
  sets!: number;
  reps!: number;
  weight!: number;
  completed!: boolean;
  exceptional!: boolean
}

const realmConfig: Realm.Configuration = {
  schema: [ExerciseSchema, ExerciseTypeSchema, CategorySchema, MonthSchema, PlanSchema],
  schemaVersion: 19,
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
}
if(oldRealm.schemaVersion < 12){
  const exercises = newRealm.objects<ExerciseSchema>("Exercise");
  exercises.forEach(exercise => {
    const currentDate = exercise.date
    const currentUTCDate = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds()));
    const weekNumber = getWeekNumber(currentUTCDate)
    const month = currentUTCDate.getMonth()
    exercise.week = weekNumber
    exercise.month = month
  })
}
if(oldRealm.schemaVersion < 14) {
  const oldCategories = oldRealm.objects<CategorySchema>("Category");
  const newCategories = newRealm.objects<CategorySchema>("Category");
  const oldExercises = oldRealm.objects<ExerciseSchema>("Exercise");
  const newExercises = newRealm.objects<ExerciseSchema>("Exercise");
  const oldPlans = oldRealm.objects<PlanSchema>("Plan");
  const newPlans = newRealm.objects<PlanSchema>("Plan");
  const oldExerciseTypes = oldRealm.objects<ExerciseTypeSchema>("ExerciseType");
  const newExerciseTypes = newRealm.objects<ExerciseTypeSchema>("ExerciseType");
  const oldMonths = oldRealm.objects<MonthSchema>("Month");
  const newMonths = newRealm.objects<MonthSchema>("Month");

  for(let i = 0; i < oldCategories.length; i++) {
    newCategories[i].id = oldCategories[i].id
  }
  for(let i = 0; i < oldExercises.length; i++) {
    newExercises[i].id = oldExercises[i].id
  }
  for(let i = 0; i < oldExerciseTypes.length; i++) {
    newExerciseTypes[i].id = oldExerciseTypes[i].id

  }
  for(let i = 0; i < oldPlans.length; i++) {
    newPlans[i].id = oldPlans[i].id

  }
  for(let i = 0; i < oldMonths.length; i++) {
    newMonths[i].id = oldMonths[i].id

  }

}
if(oldRealm.schemaVersion < 19) {
  const categories = newRealm.objects<CategorySchema>("Category");
  type CategoryColors = keyof typeof colors.categories;
  const categoryColors: string[] = Object.keys(colors.categories) as string[];
  categories.forEach(category => {
    const categoryName = category.name

    if(categoryColors.includes(categoryName)) {
      category.color = colors.categories[categoryName as CategoryColors]
    }
    else {
      category.color = colors.categories.Default
    }
  })
}
}

export default realmConfig;