import {Exercise} from "../../typings/types";
import {ExerciseSchema, MonthSchema} from "../config/realm";
import {RealmWrapper} from "./RealmWrapper";

const rw = new RealmWrapper();
const realm = rw.getRealm();

const getMaxId = () => {
  return rw.getMaxId<Exercise>("Exercise");
};

const getRealmObjectFromPrimaryKey = (id: number) => {
  return realm.objectForPrimaryKey<Exercise>("Exercise", id);
};

const months = realm.objects<MonthSchema>("Month");
const exercises = realm.objects<ExerciseSchema>("Exercise");

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
    realm.create("Exercise", exercise);
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
export async function fetchExercises(limitBy?: {by: "Month"; when: number}) {
  if (limitBy && limitBy.by === "Month") {
    const month = limitBy.when;
    const year = new Date().getFullYear(); // or use a specific year if needed
    const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    const endDate = new Date(year, month + 1, 1);
    return Array.from(exercises.filtered("date >= $0 AND date < $1", startDate, endDate));
  }
  return Array.from(exercises);
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

export async function fetchMonths() {
  return months;
}
