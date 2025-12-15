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
import Input from "@/components/ui/Input";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
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
      onSubmit={handleSubmit(onLogin)}
      isLoading={isLoading}
      globalError={globalError}
      submitLabel="შესვლა"
      linkText="არ გაქვს ანგარიში?"
      linkHref="/register"
    >
      <Input label="ელ. ფოსტა" id="email" type="email" {...register("email")} />

      <Input
        label="პაროლი"
        id="password"
        type="password"
        {...register("password")}
      />
    </AuthForm>
  );
}
