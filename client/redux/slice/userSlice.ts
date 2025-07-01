import { createSlice } from "@reduxjs/toolkit";
import { getUserId } from "../../utils/generateUserId";

export interface UserState {
  userId: string | null;
}

const initialState: UserState = {
  userId: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    initializeUserId: (state) => {
      if (!state.userId) {
        state.userId = getUserId();
      }
    },
  },
});

export const { setUserId, initializeUserId } = userSlice.actions;
export default userSlice.reducer;
