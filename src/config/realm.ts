// realmConfig.ts
import Realm, { ObjectSchema } from "realm";
import { getWeekNumber } from "../utils/date";
import { colors } from "../utils/color";
import { Plan } from "../../typings/types";

export class CategorySchema extends Realm.Object {
  static schema: ObjectSchema = {
    name: "Category",
    primaryKey: "id",
    properties: {
      id: { type: "int", indexed: true },
      name: "string",
      color: "string",
    },
  };

  id!: number;
  name!: string;
  color!: string;
}

export class ExerciseTypeSchema extends Realm.Object {
  static schema: ObjectSchema = {
    name: "ExerciseType",
    primaryKey: "id",
    properties: {
      id: { type: "int", indexed: true },
      name: "string",
      category: "Category",
      exerciseCount: "int",
      averageMetric: "float",
      stdMetricReps: "int",
      stdMetricSets: "int"
    },
  };

  id!: number;
  name!: string;
  exerciseCount!: number;
  averageMetric!: number;
  stdMetricReps!: number;
  stdMetricSets!: number;
  category!: CategorySchema;
}

export class ExerciseSchema extends Realm.Object {
  static schema: ObjectSchema = {
    name: "Exercise",
    primaryKey: "id",
    properties: {
      id: { type: "int", indexed: true },
      week: { type: "int", indexed: true },
      month: { type: "int", indexed: true },
      year: { type: "int", indexed: true },
      type: "ExerciseType",
      sets: "int",
      reps: "int",
      date: "date",
      weight: "float",
      exceptional: "bool",
      metric: "float"
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
  year!: number
  exceptional!: boolean
  metric!: number
}

export class MonthSchema extends Realm.Object {
  static schema: ObjectSchema = {
    name: "Month",
    primaryKey: "id",
    properties: {
      id: { type: "int", indexed: true },
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
  static schema: ObjectSchema = {
    name: "Plan",
    primaryKey: "id",
    properties: {
      id: { type: "int", indexed: true },
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

export class PlanPresetSchema extends Realm.Object {
  static schema: ObjectSchema = {
    name: "PlanPreset",
    primaryKey: "id",
    properties: {
      id: { type: "int", indexed: true },
      name: "string",
      plans: { type: "list", objectType: "Plan" }
    }
  }
  id!: number;
  name!: string;
  plans!: PlanSchema[]
}

export class SettingsSchema extends Realm.Object {
  static schema: ObjectSchema = {
    name: "Settings",
    properties: {
      isFirstTimeUser: { type: "bool", default: true }
    }
  }
  isFirstTimeUser!: boolean;
}

const realmConfig: Realm.Configuration = {
  schema: [ExerciseSchema, ExerciseTypeSchema, CategorySchema, MonthSchema, PlanSchema, PlanPresetSchema, SettingsSchema],
  schemaVersion: 25,
  onMigration: migration,
};

function migration(oldRealm: Realm, newRealm: Realm) {
  if (oldRealm.schemaVersion < 11) {
    const oldCategories = oldRealm.objects<CategorySchema>("Category");
    const hasCategoryWithId0 = oldCategories.findIndex(c => c.id === 0) !== -1;

    if (hasCategoryWithId0) {
      const oldCategoryObjects = newRealm.objects<CategorySchema>("Category");
      oldCategoryObjects.forEach(category => category.id += 1)
    };
  }
  if (oldRealm.schemaVersion < 12) {
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
  if (oldRealm.schemaVersion < 14) {
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

    for (let i = 0; i < oldCategories.length; i++) {
      newCategories[i].id = oldCategories[i].id
    }
    for (let i = 0; i < oldExercises.length; i++) {
      newExercises[i].id = oldExercises[i].id
    }
    for (let i = 0; i < oldExerciseTypes.length; i++) {
      newExerciseTypes[i].id = oldExerciseTypes[i].id

    }
    for (let i = 0; i < oldPlans.length; i++) {
      newPlans[i].id = oldPlans[i].id

    }
    for (let i = 0; i < oldMonths.length; i++) {
      newMonths[i].id = oldMonths[i].id

    }

  }
  if (oldRealm.schemaVersion < 19) {
    const categories = newRealm.objects<CategorySchema>("Category");
    type CategoryColors = keyof typeof colors.categories;
    const categoryColors: string[] = Object.keys(colors.categories) as string[];
    categories.forEach(category => {
      const categoryName = category.name

      if (categoryColors.includes(categoryName)) {
        category.color = colors.categories[categoryName as CategoryColors]
      }
      else {
        category.color = colors.categories.Default
      }
    })
  }
  if (oldRealm.schemaVersion < 20) {
    const exerciseTypes = newRealm.objects<ExerciseTypeSchema>("ExerciseType")
    const exercises = newRealm.objects<ExerciseSchema>("Exercise")
    exerciseTypes.forEach(et => {
      const theseExercises = exercises.filter(e => e.type.id === et.id)
      const sumOfMetrics = theseExercises.reduce((sum, exercise) => {
        // Calculate the metric for the current exercise
        const metric = exercise.weight * exercise.reps * exercise.sets;
        // Add this metric to the running total
        return sum + metric;
      }, 0); // Start with a sum of 0

      // Calculate the average by dividing the sum by the number of exercises
      const averageMetric = sumOfMetrics / theseExercises.length;
      et.averageMetric = averageMetric
      et.exerciseCount = theseExercises.length
    })
  }
  if (oldRealm.schemaVersion < 21) {
    const exerciseTypes = newRealm.objects<ExerciseTypeSchema>("ExerciseType")
    const exercises = newRealm.objects<ExerciseSchema>("Exercise")

    exerciseTypes.forEach(et => {
      const filteredExercises = exercises.filter(e => e.type.id === et.id)
      const newETMetric = filteredExercises.reduce((sum, exercise) => {
        let metric = exercise.weight * exercise.reps * exercise.sets;
        const stdMetric = exercise.weight * 10 * 3
        if (exercise.sets > 3) { metric *= (1 - (0.1 * (exercise.sets - 3))) }
        const howMuchBigger = stdMetric / exercise.type.averageMetric
        if (howMuchBigger > 1.4) {
          metric *= Math.min((stdMetric / exercise.type.averageMetric), 1.8)
        }
        exercise.metric = metric
        return sum + metric
      }, 0)
      et.averageMetric = newETMetric / filteredExercises.length
    })
  }
  if (oldRealm.schemaVersion < 22) {
    const exerciseTypes = newRealm.objects<ExerciseTypeSchema>("ExerciseType")
    exerciseTypes.forEach(ex => {
      ex.stdMetricReps = 10
      ex.stdMetricSets = 3
    })
  }
  if (oldRealm.schemaVersion < 23) {
    const exerciseTypes = newRealm.objects<ExerciseTypeSchema>("ExerciseType")
    const plan1: Plan = {
      week: 999,
      type: exerciseTypes[1],
      sets: 3,
      reps: 10,
      weight: 50,
      completed: false,
      exceptional: false,
    }
    const plan2: Plan = {
      week: 999,
      type: exerciseTypes[2],
      sets: 3,
      reps: 10,
      weight: 50,
      completed: false,
      exceptional: false,
    }
    const plan3: Plan = {
      week: 999,
      type: exerciseTypes[3],
      sets: 3,
      reps: 10,
      weight: 50,
      completed: false,
      exceptional: false,
    }

    const plans = newRealm.objects<PlanSchema>("Plan")

    const maxId = plans.max("id") as number

    newRealm.create("Plan", {
      ...plan1,
      id: maxId + 1
    })
    newRealm.create("Plan", {
      ...plan2,
      id: maxId + 2
    })
    newRealm.create("Plan", {
      ...plan3,
      id: maxId + 3
    })

    const thePlans = plans.filter(e => e.week === 999)

    newRealm.create("PlanPreset", {
      id: 1,
      name: "Monday",
      plans: thePlans
    })
  }
  if (oldRealm.schemaVersion < 24) {
    const settings = newRealm.objects<SettingsSchema>("Settings")
    if (settings.length > 0) {
      return
    }
    else {
      newRealm.create("Settings", {
        isFirstTimeUser: true
      })
    }
  }
  if (oldRealm.schemaVersion < 25) {
    const newExercises = newRealm.objects<ExerciseSchema>("Exercise")
    newExercises.forEach(e => {
      const year = new Date(e.date).getFullYear()
      e.year = year;
    })
  }
}

export default realmConfig;