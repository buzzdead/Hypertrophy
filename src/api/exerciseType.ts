import { ExerciseTypeSchema, CategorySchema, ExerciseSchema } from "../config/realm";
import { RealmWrapper } from "./RealmWrapper";

const rw = new RealmWrapper();
const realm = rw.getRealm();
const realmObject = realm.objects<ExerciseTypeSchema>("ExerciseType")
const exercises = realm.objects<ExerciseSchema>("Exercise")

const getMaxId = () => {
  return rw.getMaxId<ExerciseTypeSchema>("ExerciseType");
}

const getRealmObjectFromPrimaryKey = (id: number) => {
  return realm.objectForPrimaryKey<ExerciseTypeSchema>("ExerciseType", id)
}

export async function deleteExerciseType(exerciseType: ExerciseTypeSchema) {
  const filteredExercises = Array.from(exercises.filtered("type.id = $0", exerciseType.id));
  await rw.performWriteTransaction(() => {
    realm.delete(filteredExercises);
    realm.delete(exerciseType);
  });
}

export async function editExerciseType(exerciseTypeId: number, exerciseTypeName: string, category: CategorySchema) {
  const exerciseTypeToEdit = getRealmObjectFromPrimaryKey(exerciseTypeId);
  if (!exerciseTypeToEdit) {
    throw new Error(`Exercise Type with ID ${exerciseTypeId} not found`);
  }

  const newExerciseTypeName = realmObject.find(et => et.name === exerciseTypeName && et.id !== exerciseTypeId) ? exerciseTypeName + '(1)' : exerciseTypeName


  await rw.performWriteTransaction(() => {
    exerciseTypeToEdit.name = newExerciseTypeName;
    exerciseTypeToEdit.category = category;
  });
}

export async function addExerciseType(exerciseType: string, category: CategorySchema) {
  if (!category) throw new Error(`Category not found`);
  const newExerciseTypeName = realmObject.find(et => et.name === exerciseType) ? exerciseType + '(1)' : exerciseType
  await rw.performWriteTransaction(() => {
    realm.create("ExerciseType", {
      id: getMaxId(),
      name: newExerciseTypeName,
      category: category,
      exerciseCount: 0,
      averageMetric: 0
    });
  });
}

export async function fetchExerciseTypesByCategory(categoryId: number) {
  const exerciseTypes = realmObject.filtered("category.id = $0", categoryId);
  const exerciseTypesArray = Array.from(exerciseTypes);
  return exerciseTypesArray;
}

export async function changeExerciseType(exerciseTypeId: number, sets: number, reps: number) {
  const exerciseType = realmObject.find(e => e.id === exerciseTypeId)
  if(!exerciseType) throw new Error
  await rw.performWriteTransaction(() => {
    exerciseType.stdMetricReps = reps
    exerciseType.stdMetricSets = sets
  })
}

export async function setAllExerciseTypesMetrics(sets: number, reps: number) {
  await rw.performWriteTransaction(() => {
    realmObject.forEach(ro => {
      ro.stdMetricReps = reps
      ro.stdMetricSets = sets
    })
  })
}

export async function resetMetrics() {
  await rw.performWriteTransaction(() => {

    realmObject.forEach(ro => {
      const theseExercises = exercises.filter(e => e.type.id === ro.id)
      const sumOfMetrics = theseExercises.reduce((sum, exercise) => {
        const metric = exercise.weight * exercise.reps * exercise.sets;
        return sum + metric;
      }, 0);
      const averageMetric = sumOfMetrics / theseExercises.length;
      ro.averageMetric = averageMetric
      ro.exerciseCount = theseExercises.length
    })

    realmObject.forEach(ro => {
      const filteredExercises = exercises.filter(e => e.type.id === ro.id)
      const newETMetric = filteredExercises.reduce((sum, exercise) => {
        let metric = exercise.weight * exercise.reps * exercise.sets;
        const stdMetric = exercise.weight * ro.stdMetricReps * ro.stdMetricSets
        if (exercise.sets > ro.stdMetricSets) { metric *= (1 - (0.1 * (exercise.sets - ro.stdMetricSets))) }
        const howMuchBigger = stdMetric / exercise.type.averageMetric
        if (howMuchBigger > 1.4) {
          metric *= Math.min((stdMetric / exercise.type.averageMetric), 1.8)
        }
        exercise.metric = metric
        return sum + metric
      }, 0)
      ro.averageMetric = newETMetric / filteredExercises.length
    })
  });
}
