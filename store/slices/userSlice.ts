import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/messaging.types";

interface UserState {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  currentUser: null,
  token: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { user: UserState }) =>
  state.user.currentUser;
export const selectToken = (state: { user: UserState }) => state.user.token;
export const selectIsAuthenticated = (state: { user: UserState }) =>
  state.user.isAuthenticated;
