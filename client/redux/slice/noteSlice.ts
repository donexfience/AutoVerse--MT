import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface Note {
  _id: string;
  title: string;
  content: string;
  position: {
    x: number;
    y: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  selectedNoteId: null,
  status: "idle",
  error: null,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes(state, action: PayloadAction<Note[]>) {
      state.notes = action.payload;
    },
    addNote(state, action: PayloadAction<Note>) {
      state.notes.push(action.payload);
    },
    updateNote(state, action: PayloadAction<Note>) {
      const index = state.notes.findIndex(
        (note) => note._id === action.payload._id
      );
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },
    deleteNote(state, action: PayloadAction<string>) {
      state.notes = state.notes.filter((note) => note._id !== action.payload);
    },
    setSelectedNoteId(state, action: PayloadAction<string | null>) {
      state.selectedNoteId = action.payload;
    },
  },
});

export const { setNotes, addNote, updateNote, deleteNote, setSelectedNoteId } =
  notesSlice.actions;

export default notesSlice.reducer;
