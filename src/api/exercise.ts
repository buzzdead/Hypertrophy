import { Results } from "realm";
import {Exercise, Plan} from "../../typings/types";
import {ExerciseSchema, MonthSchema, PlanSchema} from "../config/realm";
import {RealmWrapper} from "./RealmWrapper";

const rw = new RealmWrapper();
const realm = rw.getRealm();

const getMaxId = () => {
  return rw.getMaxId<ExerciseSchema>("Exercise");
};

const getRealmObjectFromPrimaryKey = (id: number) => {
  return realm.objectForPrimaryKey<Exercise>("Exercise", id);
};

const months = realm.objects<MonthSchema>("Month");
const exercises = realm.objects<ExerciseSchema>("Exercise");
const plans = realm.objects<PlanSchema>("Plan")

export async function findAllDuplicateExercises(exercise: Exercise) {
  const exercises = realm.objects<ExerciseSchema>("Exercise");
  return exercises.filter(
    e =>
      e.type.name === exercise.type?.name &&
      e.date.getFullYear() === exercise.date.getFullYear() &&
      e.date.getMonth() === exercise.date.getMonth() &&
      e.date.getDate() === exercise.date.getDate(),
  );
}

export async function addExercise(exercise: Exercise) {
  const id = getMaxId();
  exercise.id = id;
  if (exercise.weight === "") exercise.weight = 0;
  const eMonth = exercise.date.getMonth();
  const eYear = exercise.date.getFullYear().toString();
  const month = months.find(m => m.year === eYear && m.month === eMonth);
  const exerciseToAdd: ExerciseSchema = exercise as ExerciseSchema

  await rw.performWriteTransaction(() => {
    if (month !== undefined) month.exerciseCount += 1;
    else {
      realm.create("Month", {
        id: rw.getMaxId<MonthSchema>("Month"),
        year: eYear,
        month: eMonth,
        exerciseCount: 1,
      });
    }
    realm.create("Exercise", exerciseToAdd);
  });
}

//Check if exercise is duplicate matters
export async function saveExercise(exercise: Exercise) {
  const {id, type, sets, reps, date, weight} = exercise;
  if (weight === "") exercise.weight = 0;

  const existingExercise = realm.objectForPrimaryKey<Exercise>("Exercise", id);
  if (!existingExercise) throw new Error();

  await rw.performWriteTransaction(() => {
    existingExercise.type = type;
    existingExercise.sets = sets;
    existingExercise.reps = reps;
    existingExercise.date = date;
    existingExercise.weight = weight;
  });
}
export async function fetchExercises(limitBy?: { by: "Month" | "Week"; when: number }) {
  console.log("fetching exercises");
  if (limitBy && limitBy.by === "Month") {
    const month = limitBy.when;
    return Array.from(realm.objects<ExerciseSchema>('Exercise').filtered('month == $0', month));
  }
  else if(limitBy && limitBy.by === "Week") {
    const week = limitBy.when;
    return Array.from(realm.objects<ExerciseSchema>('Exercise').filtered('week == $0', week));
  }
  return Array.from(exercises);
}

export async function getWeekMinMax() {
  const uniqueExercises = exercises
  .filtered('TRUEPREDICATE DISTINCT(week)')
  .sorted('week')
  .map(exercise => exercise.week);
  return Array.from(uniqueExercises)
}

export async function fetchExerciseById(id: number) {
  const exercise = getRealmObjectFromPrimaryKey(id);
  return exercise;
}

export async function deleteExercise(exercise: Exercise) {
  const exerciseSchema = getRealmObjectFromPrimaryKey(exercise.id);
  const eMonth = exercise.date.getMonth();
  const eYear = exercise.date.getFullYear().toString();
  const month: Optional<MonthSchema> = months.find(m => m.year === eYear && m.month === eMonth);
  await rw.performWriteTransaction(() => {
    if (month !== undefined) month.exerciseCount -= 1;
    if (month?.exerciseCount === 0) realm.delete(month);
    realm.delete(exerciseSchema);
  });
}

// Plans

export async function addPlan(plan: Plan) {
  await rw.performWriteTransaction(() => {
    realm.create("Plan", {
      ...plan,
      id: rw.getMaxId<PlanSchema>("Plan")
    });
  });
}

export async function editPlan(newPlan: Plan) {
  if(!newPlan?.id || !newPlan?.type) throw new Error
  const currentPlan = realm.objectForPrimaryKey<PlanSchema>("Plan", newPlan?.id)
  if(!currentPlan) throw new Error
  const {weight, type, sets, reps, week} = newPlan
  await rw.performWriteTransaction(() => {
    currentPlan.weight = weight
    currentPlan.reps = reps
    currentPlan.week = week
    currentPlan.sets = sets
    currentPlan.type = type
  })
}

export async function deletePlan(planId: number) {
  const plan = realm.objectForPrimaryKey<PlanSchema>("Plan", planId);
  await rw.performWriteTransaction(() => {
    realm.delete(plan)
  })
}

// Months
export async function fetchMonths() {
  return months;
}
