"use client";

import { useRouter } from "next/navigation";
import Cookie from "js-cookie";

export default function Home() {
  const router = useRouter();
  const token = Cookie.get("token");
  if (!token) {
    router.push("/login");
  } else {
    router.push("/feed");
  }
}
