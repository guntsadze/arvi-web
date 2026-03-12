import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/messaging.types";

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.currentUser = action.payload.user;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { user: UserState }) =>
  state.user.currentUser;
export const selectIsAuthenticated = (state: { user: UserState }) =>
  state.user.isAuthenticated;
