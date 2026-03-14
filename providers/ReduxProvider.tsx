"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ReactNode, useEffect } from "react";
import { setUser } from "@/store/slices/userSlice";
import { PresenceProvider } from "@/context/PresenceContext";

export function ReduxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          store.dispatch(setUser({ user }));
        } catch (error) {
          localStorage.removeItem("user");
        }
      }
    }
  }, []);

  return (
    <Provider store={store}>
      <PresenceProvider>{children}</PresenceProvider>
    </Provider>
  );
}
