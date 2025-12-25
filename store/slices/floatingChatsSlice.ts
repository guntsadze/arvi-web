import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FloatingChat } from "@/types/chat.types";

interface FloatingChatsState {
  openChats: FloatingChat[];
  maxChats: number; // მაქსიმუმ რამდენი ჩატი იყოს ღია
}

const initialState: FloatingChatsState = {
  openChats: [],
  maxChats: 3, // Facebook-ის მსგავსად 3 ჩატი
};

const floatingChatsSlice = createSlice({
  name: "floatingChats",
  initialState,
  reducers: {
    openChat: (state, action: PayloadAction<FloatingChat>) => {
      const exists = state.openChats.find(
        (chat) => chat.id === action.payload.id
      );

      if (!exists) {
        // თუ მაქსიმუმს მიაღწია, პირველს ვშლით
        if (state.openChats.length >= state.maxChats) {
          state.openChats.shift();
        }
        state.openChats.push(action.payload);
      } else {
        // თუ არსებობს, გავხსნათ (unminimize)
        const index = state.openChats.findIndex(
          (chat) => chat.id === action.payload.id
        );
        state.openChats[index].isMinimized = false;
      }
    },
    closeChat: (state, action: PayloadAction<string>) => {
      state.openChats = state.openChats.filter(
        (chat) => chat.id !== action.payload
      );
    },
    toggleMinimize: (state, action: PayloadAction<string>) => {
      const chat = state.openChats.find((chat) => chat.id === action.payload);
      if (chat) {
        chat.isMinimized = !chat.isMinimized;
      }
    },
    closeAllChats: (state) => {
      state.openChats = [];
    },
  },
});

export const { openChat, closeChat, toggleMinimize, closeAllChats } =
  floatingChatsSlice.actions;
export default floatingChatsSlice.reducer;

// Selectors
export const selectOpenChats = (state: { floatingChats: FloatingChatsState }) =>
  state.floatingChats.openChats;
