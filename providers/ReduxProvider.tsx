"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ReactNode, useEffect } from "react";
import Cookie from "js-cookie";
import { setUser } from "@/store/slices/userSlice";
import { PresenceProvider } from "@/context/PresenceContext";

export function ReduxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      const token = Cookie.get("token");

      if (userStr && token) {
        try {
          const user = JSON.parse(userStr);
          store.dispatch(setUser({ user, token }));
        } catch (error) {
          localStorage.removeItem("user");
          Cookie.remove("token");
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
