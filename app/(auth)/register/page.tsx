"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";

import { registerSchema } from "@/lib/validations/auth";
import { authService } from "@/services/auth/auth.services";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthForm } from "@/components/ui/auth/AuthForm";

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const router = useRouter();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setGlobalError("");
    try {
      await authService.register(data);
      // router.push("/feed");
    } catch (e: any) {
      setGlobalError(e.message || "რეგისტრაცია ვერ მოხერხდა");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="✍️ რეგისტრაცია"
      subtitle="შექმენი ახალი ანგარიში"
      onSubmit={form.handleSubmit(onRegister)}
      isLoading={isLoading}
      globalError={globalError}
      submitLabel="რეგისტრაცია"
      linkText="უკვე გაქვს ანგარიში?"
      linkHref="/login"
    >
      <div className="grid grid-cols-2 gap-4">
        <AuthInput
          label="სახელი"
          id="firstName"
          register={form.register}
          error={form.formState.errors.firstName?.message}
        />
        <AuthInput
          label="გვარი"
          id="lastName"
          register={form.register}
          error={form.formState.errors.lastName?.message}
        />
        <AuthInput
          label="UserName"
          id="username"
          register={form.register}
          error={form.formState.errors.username?.message}
        />
      </div>
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
