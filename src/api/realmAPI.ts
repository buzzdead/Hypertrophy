// realmAPI.ts
import { CategorySchema, ExerciseSchema, ExerciseTypeSchema, MonthSchema } from "../config/realmConfig";
import { Exercise } from "../../typings/types";
import RealmService from "./realmService";

const realmService = RealmService.getInstance();
const realm = realmService.getRealm();

export async function findAllDuplicateExercises(exercise: Exercise) {
  const exercises = realm.objects<ExerciseSchema>("Exercise");
  return exercises.filter(e => (e.type.name === exercise.type?.name && e.date.getFullYear() === exercise.date.getFullYear() && e.date.getMonth() === exercise.date.getMonth() && e.date.getDate() === exercise.date.getDate()))
}

export async function addExercise(exercise: Exercise) {
  const { type, sets, reps, date, weight } = exercise; 
  if (exercise.weight === "") exercise.weight = 0;
  const maxId = realm.objects("Exercise").max("id");
  const months = Array.from(realm.objects("Month")) as MonthSchema[]
  const eMonth = exercise.date.getMonth()
  const eYear = exercise.date.getFullYear().toString()
  const month: Optional<MonthSchema> = months.find(m => m.year === eYear && m.month === eMonth);

  const id = (maxId ? Number(maxId) + 1 : 1);

  realm.write(() => {
    if(month !== undefined) month.exerciseCount += 1
    else {
      realm.create("Month", {
        id: realm.objects("Month").length + 1,
        year: eYear,
        month: eMonth,
        exerciseCount: 1,
      })
    }
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
  const exerciseTypes = realm.objects<ExerciseTypeSchema>("ExerciseType").filtered('category.id = $0', category.id);
  const exercises = realm.objects<ExerciseSchema>("Exercise").filtered('type.id IN $0', exerciseTypes.map(et => et.id));
  
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
  const exerciseTypes = realm.objects<ExerciseTypeSchema>("ExerciseType").filtered('category.id = $0', exerciseType.id);
  const exercises = realm.objects<ExerciseSchema>("Exercise").filtered('type.id IN $0', exerciseTypes.map(et => et.id));
  
  realm.write(() => {
    realm.delete(exercises)
    realm.delete(exerciseTypes)
  })
}

export async function fetchMonths() {
  const months = realm.objects<MonthSchema>("Month")
  const array = Array.from(months)
  return array
}

export async function editExerciseType(exerciseTypeId: number, exerciseTypeName: string, category: CategorySchema) {
  const exerciseTypeToEdit = realm.objectForPrimaryKey<ExerciseTypeSchema>("ExerciseType", exerciseTypeId)
  if (!exerciseTypeToEdit) {
    throw new Error(`Exercise Type with ID ${exerciseTypeId} not found`)
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

export async function fetchExercises(limitBy?: {by: 'Month', when: number}) {
  let exercises = realm.objects<ExerciseSchema>("Exercise");

  if (limitBy && limitBy.by === 'Month') {
    const month = limitBy.when;
    const year = new Date().getFullYear(); // or use a specific year if needed
    const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

const endDate = new Date(year, month + 1, 1); 
    exercises = exercises.filtered("date >= $0 AND date < $1", startDate, endDate);
  }

  return Array.from(exercises);
}

export async function fetchExerciseById(id: number) {
  const exercise = realm.objectForPrimaryKey<ExerciseSchema>("Exercise", id);
  return exercise;
}

export async function deleteExercise(exercise: Exercise) {
  const exerciseSchema = realm.objectForPrimaryKey<ExerciseSchema>("Exercise", exercise.id);
  const months = Array.from(realm.objects("Month")) as MonthSchema[]
  const eMonth = exercise.date.getMonth()
  const eYear = exercise.date.getFullYear().toString()
  const month: Optional<MonthSchema> = months.find(m => m.year === eYear && m.month === eMonth);
  realm.write(() => {
    if(month !== undefined) month.exerciseCount -= 1
    if(month?.exerciseCount === 0) realm.delete(month)
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

export async function fetchExerciseTypesByCategory(categoryId: number) {
  const exerciseTypes = realm.objects<ExerciseTypeSchema>("ExerciseType").filtered('category.id = $0', categoryId);
  const exerciseTypesArray = Array.from(exerciseTypes);
  return exerciseTypesArray;
}