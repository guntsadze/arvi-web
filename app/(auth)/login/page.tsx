"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { AuthCard } from "@/components/auth/AuthCard";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [initialError, setInitialError] = useState<string | undefined>();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "OAUTH_FAILED") {
      setInitialError("Google ავტორიზაცია ვერ მოხერხდა, სცადეთ ხელახლა");
    }
    if (error) window.history.replaceState({}, "", "/login");
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <AuthCard initialError={initialError} />
    </div>
  );
}
