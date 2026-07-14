"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ReactNode } from "react";
import { PresenceProvider } from "@/context/PresenceContext";

/**
 * Redux is no longer hydrated from localStorage. AuthProvider's getMe()
 * call is the single source of truth for auth state (see PART A of the
 * session-unification RFC) — it verifies against the backend and sets
 * isAuthenticated/currentUser/isInitialized accordingly.
 */
export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PresenceProvider>{children}</PresenceProvider>
    </Provider>
  );
}
