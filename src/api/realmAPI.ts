// realmAPI.ts
import { CategorySchema, ExerciseSchema, ExerciseTypeSchema } from "../config/realmConfig";
import { Exercise } from "../../typings/types";
import RealmService from "./realmService";

const realmService = RealmService.getInstance();
const realm = realmService.getRealm();

export async function addExercise(exercise: Exercise) {
  const { type, sets, reps, date, weight } = exercise;
  if (exercise.weight === "") exercise.weight = 0;
  const id = realm.objects("Exercise").length + 1;

  realm.write(() => {
    realm.create("Exercise", {
      id,
      type,
      sets,
      reps,
      date,
      weight,
    });
  });
}

export async function saveExercise(exercise: Exercise) {
  const { id, type, sets, reps, date, weight } = exercise;
  if (weight === "") exercise.weight = 0;

  const existingExercise = realm.objectForPrimaryKey<Exercise>("Exercise", id);

  if (existingExercise) {
    realm.write(() => {
      existingExercise.type = type;
      existingExercise.sets = sets;
      existingExercise.reps = reps;
      existingExercise.date = date;
      existingExercise.weight = weight;
    })
  };
}

export async function addCategory(category: string) {
  const categories = realm.objects<CategorySchema>("Category");
  realm.write(() => {
    realm.create("Category", {
      id: categories.length + 1,
      name: category
    })
  })
}

export async function deleteCategory(category: CategorySchema) {
  const exerciseTypes = realm.objects<ExerciseTypeSchema>("ExerciseType").filter(et => et.category.id === category.id);
  const exercises = realm.objects<ExerciseSchema>("Exercise").filter(e => exerciseTypes.some(et => et.id === e.type.id))
  
  realm.write(() => {
    realm.delete(exercises)
    realm.delete(exerciseTypes)
    realm.delete(category)
  })
}

export async function editCategory(categoryId: number, categoryName: string) {
  const categoryToEdit = realm.objects<CategorySchema>("Category").find(c => c.id === categoryId)
  if (!categoryToEdit) {
    throw new Error(`Category with ID ${categoryId} not found`)
  }

  realm.write(() => {
    categoryToEdit.name = categoryName
  })
}

export async function deleteExerciseType(exerciseType: ExerciseTypeSchema) {
  const exerciseTypes = realm.objects<ExerciseTypeSchema>("ExerciseType").find(e => e.id === exerciseType.id)
  const exercises = realm.objects<ExerciseSchema>("Exercise").filter(e => (e.id === exerciseType.id))
  
  realm.write(() => {
    realm.delete(exercises)
    realm.delete(exerciseTypes)
  })
}

export async function editExerciseType(exerciseTypeId: number, exerciseTypeName: string, category: CategorySchema) {
  const exerciseTypeToEdit = realm.objects<ExerciseTypeSchema>("ExerciseType").find(c => c.id === exerciseTypeId)
  if (!exerciseTypeToEdit) {
    throw new Error(`Category with ID ${exerciseTypeName} not found`)
  }

  // Update categoryToEdit with the properties of category
  realm.write(() => {
    exerciseTypeToEdit.name = exerciseTypeName
    exerciseTypeToEdit.category = category
  })
} 

export async function addExerciseType(exerciseType: string, category: CategorySchema) {
  if(!category) return
  const exerciseTypes = realm.objects<ExerciseTypeSchema>("ExerciseType")
  realm.write(() => {
    realm.create("ExerciseType", {
      id: exerciseTypes.length + 1,
      name: exerciseType,
      category: category
    })
  })
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

export async function deleteExercise(exercise: Exercise) {
  const exerciseSchema = realm.objectForPrimaryKey<ExerciseSchema>("Exercise", exercise.id);
  realm.write(() => {
    realm.delete(exerciseSchema)
  })
}

export async function fetchCategories() {
  const categories = realm.objects<CategorySchema>("Category");
  const categoriesArray = Array.from(categories);
  return categoriesArray;
}

export async function fetchExerciseTypes() {
  const exerciseTypes = realm.objects<ExerciseTypeSchema>("ExerciseType");
  const exerciseTypesArray = Array.from(exerciseTypes);
  return exerciseTypesArray;
}

export async function fetchExerciseTypesByCategory(category: string) {
  const exerciseTypes = realm.objects<ExerciseTypeSchema>("ExerciseType").filter(e => e.category.name === category);
  const exerciseTypesArray = Array.from(exerciseTypes);
  return exerciseTypesArray;
}