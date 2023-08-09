import {Exercise, Plan} from "../../typings/types";
import {ExerciseSchema, ExerciseTypeSchema, MonthSchema, PlanSchema} from "../config/realm";
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

const addMetric = (exercise: ExerciseSchema, metric: number) => {
  const exerciseType = exercise.type
  exerciseType.exerciseCount += 1
  if(exerciseType.exerciseCount === 1) exercise.type.averageMetric = metric
  else  exerciseType.averageMetric = ((exerciseType.exerciseCount * exerciseType.averageMetric) + metric) / (exerciseType.exerciseCount + 1)
}

const removeMetric = (exercise: ExerciseSchema) => {
  const exerciseType = exercise.type
  if(exerciseType.exerciseCount === 1) {
    exerciseType.averageMetric = 0
    exerciseType.exerciseCount = 0
  }
  else {
  const avgMetricTotal = exerciseType.averageMetric * exerciseType.exerciseCount
  const newAvgMetric = (avgMetricTotal - exercise.metric) / (exerciseType.exerciseCount - 1)
  exerciseType.averageMetric = newAvgMetric
  exerciseType.exerciseCount -= 1
  }
}

export async function addExercise(exercise: Exercise) {
  let newMonthAdded = false;
  const id = getMaxId();
  exercise.id = id;
  if (exercise.weight === "") exercise.weight = 0;
  const eMonth = exercise.date.getMonth();
  const eYear = exercise.date.getFullYear().toString();
  const month = months.find(m => m.year === eYear && m.month === eMonth);
  const exerciseToAdd: ExerciseSchema = exercise as ExerciseSchema
  const stdReps = exercise.type?.stdMetricReps || 10
  const stdSets = exercise.type?.stdMetricSets || 3
  let metric = (exercise.weight as number) * exercise.reps * exercise.sets;
        let stdMetric = (exercise.weight as number) * stdSets * stdReps
        if (exercise.sets > stdSets) { stdMetric *= (0.1 * (exercise.sets - stdSets)) }
        if(exercise.type && exercise.type.exerciseCount > 0){
        const howMuchBigger = stdMetric / exercise.type.averageMetric
        if (howMuchBigger > 1.4) {
          metric *= Math.min((stdMetric / exercise.type.averageMetric), 1.6)
        }}
  exerciseToAdd.metric = metric
  await rw.performWriteTransaction(() => {
    if (month !== undefined) month.exerciseCount += 1;
    else {
      realm.create("Month", {
        id: rw.getMaxId<MonthSchema>("Month"),
        year: eYear,
        month: eMonth,
        exerciseCount: 1,
      });
      newMonthAdded = true
    }
    realm.create("Exercise", exerciseToAdd);
    addMetric(exerciseToAdd, metric)
  });
  return newMonthAdded
}

//Check if exercise is duplicate matters
export async function saveExercise(exercise: Exercise) {
  const {id, type, sets, reps, date, weight, exceptional, metric} = exercise;
  if (weight === "") exercise.weight = 0;

  const existingExercise = realm.objectForPrimaryKey<Exercise>("Exercise", id);
  if (!existingExercise) throw new Error();

  await rw.performWriteTransaction(() => {
    removeMetric(existingExercise as ExerciseSchema)
    existingExercise.type = type;
    existingExercise.sets = sets;
    existingExercise.reps = reps;
    existingExercise.date = date;
    existingExercise.weight = weight;
    existingExercise.metric = metric;
    existingExercise.exceptional = exceptional;
    addMetric(existingExercise as ExerciseSchema, metric)
  });
}
export async function fetchExercises(limitBy?: { by: "Month" | "Week"; when: number }) {
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
  let monthDeleted = false
  const exerciseSchema = getRealmObjectFromPrimaryKey(exercise.id);
  const eMonth = exercise.date.getMonth();
  const eYear = exercise.date.getFullYear().toString();
  const month: Optional<MonthSchema> = months.find(m => m.year === eYear && m.month === eMonth);
  await rw.performWriteTransaction(() => {
    if (month !== undefined) month.exerciseCount -= 1;
    if (month?.exerciseCount === 0) {realm.delete(month); monthDeleted = true}
    removeMetric(exercise as ExerciseSchema)
    realm.delete(exerciseSchema);
  });
  return monthDeleted
}

// Plans

export async function addPlan(plan: Plan) {
  await rw.performWriteTransaction(() => {
    realm.create("Plan", {
      ...plan,
      id: rw.getMaxId<PlanSchema>("Plan"),
      weight: Number(plan.weight)
    });
  });
}

export async function editPlan(newPlan: Plan) {
  if(!newPlan?.id || !newPlan?.type) throw new Error
  const currentPlan = realm.objectForPrimaryKey<PlanSchema>("Plan", newPlan?.id)
  if(!currentPlan) throw new Error
  const {weight, type, sets, reps, week} = newPlan as PlanSchema
  await rw.performWriteTransaction(() => {
    currentPlan.weight = Number(weight)
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

export async function setPlanCompleted(plan: PlanSchema) {
  if(!plan) throw new Error
  await rw.performWriteTransaction(() => {
    plan.completed = true
  })
}

export async function fetchPlanById(planId: number) {
  const plan = realm.objectForPrimaryKey<PlanSchema>("Plan", planId);
  if(!plan) throw new Error
  return plan
}

// Months
export async function fetchMonths() {
  return months;
}
