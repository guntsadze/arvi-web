import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import floatingChatsReducer from "./slices/floatingChatsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    floatingChats: floatingChatsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
