// src/features/exercise/exerciseSlice.ts
import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as exerciseAPI from '../api/exercise';
import { ExerciseSchema, ExerciseTypeSchema } from '../config/realm';
import { RootState } from './store';

interface ExerciseState {
  exercises: ExerciseSchema[];
  exercisesLoaded: boolean
  status: string
}

const exerciseAdapter = createEntityAdapter<ExerciseSchema>()

interface SerializableExerciseSchema {
    id: number;
    type: ExerciseTypeSchema;
    sets: number;
    reps: number;
    weight: number;
    date: string; // This is now a string
  }

export const fetchExercisesAsync = createAsyncThunk<ExerciseSchema[], void, {state: RootState}>(
    'exercises/fetchExercisesAsync',
    async (_, thunkAPI) => {
        try{
            const response = await exerciseAPI.fetchExercises()
            return response
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const exerciseSlice = createSlice({
  name: 'exercise',
  initialState: exerciseAdapter.getInitialState<ExerciseState>({
    exercises: [],
    exercisesLoaded: false,
    status: "idle"
}),
  reducers: {
  },
  extraReducers: (builder => {
    builder.addCase(fetchExercisesAsync.pending, (state) => {
        state.status = 'pendingFetchProducts'
    })
    builder.addCase(fetchExercisesAsync.fulfilled, (state, action) => {
        exerciseAdapter.setAll(state, action.payload)
        state.status = 'idle'
        state.exercisesLoaded = true
    })
    builder.addCase(fetchExercisesAsync.rejected, (state, action) => {
        console.log(action.payload)
        state.status = 'idle'
    })    
})})

export const productSelectors = exerciseAdapter.getSelectors((state: RootState) => state.exercise)
export default exerciseSlice;
