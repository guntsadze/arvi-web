"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ReactNode, useEffect } from "react";
import Cookie from "js-cookie";
import { setUser } from "@/store/slices/userSlice";

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  useEffect(() => {
    // გვერდის ჩატვირთვისას ვამოწმებთ localStorage-ში user-ს
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      const token = Cookie.get("token");

      if (userStr && token) {
        try {
          const user = JSON.parse(userStr);
          store.dispatch(setUser({ user, token }));
        } catch (error) {
          console.error("User parse error:", error);
          localStorage.removeItem("user");
          Cookie.remove("token");
        }
      }
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
