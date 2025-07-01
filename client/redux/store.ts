import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./slice/noteSlice";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
});
