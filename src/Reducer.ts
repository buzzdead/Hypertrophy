export type ExerciseReducerState = {
  name: string;
  names: string[];
  sets: number;
  reps: number;
  weight: number | string
  category: string;
};

type Action =
  | { type: "setName"; payload: string }
  | { type: "setNames"; payload: string[] }
  | { type: "setSets"; payload: number }
  | { type: "setReps"; payload: number }
  | { type: "setCategory"; payload: string }
  | { type: "setWeight"; payload: number | string }

export default function exerciseListReducer(state: ExerciseReducerState, action: Action): ExerciseReducerState {
  switch (action.type) {
    case "setName":
      return { ...state, name: action.payload };
      case "setNames":
      return { ...state, names: action.payload };
    case "setSets":
      return { ...state, sets: action.payload };
    case "setReps":
      return { ...state, reps: action.payload };
    case "setCategory":
      return { ...state, category: action.payload };
    case "setWeight":
      return { ...state, weight: action.payload };
    default:
      throw new Error("Invalid action type");
  }
}
