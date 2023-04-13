import { Exercise } from "../typings/types";
import { CategorySchema, ExerciseTypeSchema } from "./config/realmConfig";

export interface ExerciseReducerType extends Pick<Exercise, "date" | "sets" | "reps" | "weight"> {
  category: Nullable<CategorySchema>,
  exerciseType: Nullable<ExerciseTypeSchema>
  validWeight: boolean
}

type Action =
  | { type: "setType"; payload: ExerciseTypeSchema }
  | { type: "setSets"; payload: number }
  | { type: "setReps"; payload: number }
  | { type: "setWeight"; payload: {value: number | string, validWeight: boolean} }
  | { type: "setCategory"; payload: Nullable<CategorySchema> }
  | { type: "setExerciseType"; payload: Nullable<ExerciseTypeSchema> }

export default function exerciseListReducer(state: ExerciseReducerType, action: Action): ExerciseReducerType {
  switch (action.type) {
    case "setSets":
      return { ...state, sets: action.payload };
    case "setReps":
      return { ...state, reps: action.payload };
    case "setWeight":
      return { ...state, weight: action.payload.value, validWeight: action.payload.validWeight };
    case "setCategory": 
      return { ...state, category: action.payload }
    case "setExerciseType": 
      return { ...state, exerciseType: action.payload }
    default:
      throw new Error("Invalid action type");
  }
}
