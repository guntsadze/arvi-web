"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function Page() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    console.log("Zustand user updated:", user);
  }, [user]);

  return <div>{user ? `Welcome, ${user.firstName}` : "Not logged in"}</div>;
}
