"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";

import { loginSchema } from "@/lib/validations/auth";
import { authService } from "@/services/auth/auth.services";
import { AuthForm } from "@/components/ui/auth/AuthForm";
import { AuthInput } from "@/components/ui/AuthInput";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const router = useRouter();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setGlobalError("");
    try {
      await authService.login(data);
      router.push("/feed");
    } catch {
      setGlobalError("შესვლა ვერ მოხერხდა");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="🚗 შესვლა"
      subtitle="შესვლა შენს ანგარიშში"
      onSubmit={form.handleSubmit(onLogin)}
      isLoading={isLoading}
      globalError={globalError}
      submitLabel="შესვლა"
      linkText="არ გაქვს ანგარიში?"
      linkHref="/register"
    >
      <AuthInput
        label="ელ. ფოსტა"
        id="email"
        type="email"
        register={form.register}
        error={form.formState.errors.email?.message}
      />
      <AuthInput
        label="პაროლი"
        id="password"
        type="password"
        register={form.register}
        error={form.formState.errors.password?.message}
      />
    </AuthForm>
  );
}
