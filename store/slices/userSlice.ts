import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/messaging.types";

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isInitialized: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User }>) => {
      state.currentUser = action.payload.user;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
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
export const selectIsInitialized = (state: { user: UserState }) =>
  state.user.isInitialized;
