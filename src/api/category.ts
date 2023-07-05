import {CategorySchema, ExerciseTypeSchema, ExerciseSchema} from "../config/realm";
import {RealmWrapper} from "./RealmWrapper";

const rw = new RealmWrapper();
const realm = rw.getRealm();

export async function addCategory(category: string) {
  await rw.performWriteTransaction(() => {
    realm.create("Category", {
      id: rw.getMaxId<CategorySchema>("Category"),
      name: category,
    });
  });
}

export async function deleteCategory(category: CategorySchema) {
  const exerciseTypes = realm.objects<ExerciseTypeSchema>("ExerciseType").filtered("category.id = $0", category.id);
  const exercises = realm.objects<ExerciseSchema>("Exercise").filtered(
    "type.id IN $0",
    exerciseTypes.map(et => et.id),
  );

  await rw.performWriteTransaction(() => {
    realm.delete(exercises);
    realm.delete(exerciseTypes);
    realm.delete(category);
  });
}

export async function editCategory(categoryId: number, categoryName: string) {
  const categoryToEdit = realm.objectForPrimaryKey<CategorySchema>("Category", categoryId);
  if (!categoryToEdit) throw new Error();
  await rw.performWriteTransaction(() => {
    categoryToEdit.name = categoryName;
  });
}

export async function changeCategoryColor(category: CategorySchema) {
  const categoryToEdit = realm.objectForPrimaryKey<CategorySchema>("Category", category.id);
  if (!categoryToEdit) throw new Error();
  await rw.performWriteTransaction(() => {
    categoryToEdit.color = category.color;
  });
}
