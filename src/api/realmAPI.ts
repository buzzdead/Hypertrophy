// realmAPI.ts
import {ExerciseSchema} from "../config/realmConfig";
import {Exercise} from "../types";
import RealmService from "./realmService";

const realmService = RealmService.getInstance();
const realm = realmService.getRealm();

export async function addExercise(exercise: Exercise) {
  const {name, sets, reps, date, category} = exercise;
  const id = realm.objects("Exercise").length + 1;

  realm.write(() => {
    realm.create("Exercise", {
      id,
      name,
      sets,
      reps,
      date,
      category,
    });
  });
}

export async function fetchExercises() {
  const exercises = realm.objects<ExerciseSchema>("Exercise");
  const exercisesArray = Array.from(exercises);
  return exercisesArray;
}

export async function fetchExerciseById(id: number) {
  const exercise = realm.objectForPrimaryKey<ExerciseSchema>("Exercise", id);
  return exercise;
}

export async function fetchUniqueCategories(): Promise<string[]> {
  const exercises = realm.objects<Exercise>("Exercise");
  const categories = Array.from(new Set(exercises.map(e => e.category)));
  return categories;
}

export async function fetchUniqueExerciseTypes(category: string): Promise<string[]> {
  const exercises = realm.objects<Exercise>("Exercise");
  const categories = exercises.filter(e => e.category === category).map(e2 => e2.name)
  return categories;
}
