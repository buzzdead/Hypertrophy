import {CategorySchema, ExerciseTypeSchema, ExerciseSchema} from "../config/realm";
import { colors } from "../utils/color";
import {RealmWrapper} from "./RealmWrapper";

const rw = new RealmWrapper();
const realm = rw.getRealm();
const realmObject = realm.objects<CategorySchema>("Category")

export async function addCategory(category: string) {
  const newCategoryName = realmObject.find(c => c.name === category) ? category + '(1)' : category
  await rw.performWriteTransaction(() => {
    realm.create("Category", {
      id: rw.getMaxId<CategorySchema>("Category"),
      name: newCategoryName,
      color: colors.categories.Default
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
  if(categoryToEdit.name === categoryName) return
  const newCategoryName = realmObject.find(c => c.name === categoryName) ? categoryName + '(1)' : categoryName
  await rw.performWriteTransaction(() => {
    categoryToEdit.name = newCategoryName;
  });
}

export async function changeCategoryColor(category: CategorySchema) {
  const categoryToEdit = realm.objectForPrimaryKey<CategorySchema>("Category", category.id);
  if (!categoryToEdit) throw new Error();
  await rw.performWriteTransaction(() => {
    categoryToEdit.color = category.color;
  });
}
