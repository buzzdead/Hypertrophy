type State = {
  name: string;
  sets: number;
  reps: number;
  category: string;
  categories: string[];
  pickerVisible: boolean;
};

type Action =
  | { type: "setName"; payload: string }
  | { type: "setSets"; payload: number }
  | { type: "setReps"; payload: number }
  | { type: "setCategory"; payload: string }
  | {type: "setCategories"; payload: string[] }
  | { type: "togglePicker" };

export default function exerciseListReducer(state: State, action: Action): State {
  switch (action.type) {
    case "setName":
      return { ...state, name: action.payload };
    case "setSets":
      return { ...state, sets: action.payload };
    case "setReps":
      return { ...state, reps: action.payload };
    case "setCategory":
      return { ...state, category: action.payload };
    case "togglePicker":
      return { ...state, pickerVisible: !state.pickerVisible };
    case "setCategories":
        return { ...state, categories: action.payload };
    default:
      throw new Error("Invalid action type");
  }
}
