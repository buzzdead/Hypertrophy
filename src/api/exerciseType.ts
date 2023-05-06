import {ExerciseTypeSchema, CategorySchema} from "../config/realm";
import {RealmWrapper} from "./RealmWrapper";

const rw = new RealmWrapper();
const realm = rw.getRealm();
const realmObject = realm.objects<ExerciseTypeSchema>("ExerciseType")

const getMaxId = () => {
    return rw.getMaxId<ExerciseTypeSchema>("ExerciseType");
}

const getRealmObjectFromPrimaryKey = (id: number) => {
    return realm.objectForPrimaryKey<ExerciseTypeSchema>("ExerciseType", id)
}

export async function deleteExerciseType(exerciseType: ExerciseTypeSchema) {
  const exercises = realmObject.filtered("type.id = $0", exerciseType.id);
  await rw.performWriteTransaction(() => {
    realm.delete(exercises);
    realm.delete(exerciseType);
  });
}

export async function editExerciseType(exerciseTypeId: number, exerciseTypeName: string, category: CategorySchema) {
  const exerciseTypeToEdit = getRealmObjectFromPrimaryKey(exerciseTypeId);
  if (!exerciseTypeToEdit) {
    throw new Error(`Exercise Type with ID ${exerciseTypeId} not found`);
  }

  await rw.performWriteTransaction(() => {
    exerciseTypeToEdit.name = exerciseTypeName;
    exerciseTypeToEdit.category = category;
  });
}

export async function addExerciseType(exerciseType: string, category: CategorySchema) {
  if (!category) throw new Error(`Category not found`);
  await rw.performWriteTransaction(() => {
    realm.create("ExerciseType", {
      id: getMaxId(),
      name: exerciseType,
      category: category,
    });
  });
}

export async function fetchExerciseTypes() {
  const exerciseTypes = realmObject
  const exerciseTypesArray = Array.from(exerciseTypes);
  return exerciseTypesArray;
}

export async function fetchExerciseTypesByCategory(categoryId: number) {
  const exerciseTypes = realmObject.filtered("category.id = $0", categoryId);
  const exerciseTypesArray = Array.from(exerciseTypes);
  return exerciseTypesArray;
}
