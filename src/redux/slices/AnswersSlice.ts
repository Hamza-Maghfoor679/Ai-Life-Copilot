import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type of a single answer
interface Answer {
  answer: string[]
}

// Define the slice state
interface AnswerState {
  answer: Answer[];
}

// Initial state
const initialState: AnswerState = {
  answer: [],
};

// Create slice
const answerSlice = createSlice({
  name: "answer",
  initialState,
  reducers: {
    setAnswersInSlice: (state, action: PayloadAction<Answer>) => {
      // Add a new answer to the array
      state.answer = [action.payload]
    },
  },
});

// Export actions and reducer
export const { setAnswersInSlice } = answerSlice.actions;
export default answerSlice.reducer;
