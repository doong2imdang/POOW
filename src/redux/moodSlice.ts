import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Mood } from "../routes/Home";

interface MoodState {
  moods: Mood[];
}

const initialState: MoodState = {
  moods: [],
};

const moodSlice = createSlice({
  name: "moods",
  initialState,
  reducers: {
    setMoods(state, action: PayloadAction<Mood[]>) {
      state.moods = action.payload;
    },
    addMood(state, action: PayloadAction<Mood>) {
      state.moods.push(action.payload);
    },
    updateMood(
      state,
      action: PayloadAction<{ index: number; updatedMood: Mood }>
    ) {
      state.moods[action.payload.index] = action.payload.updatedMood;
    },
    removeMood(state, action: PayloadAction<number>) {
      state.moods.splice(action.payload, 1);
    },
  },
});

export const { setMoods, addMood, updateMood, removeMood } = moodSlice.actions;
export const moodReducer = moodSlice.reducer;
