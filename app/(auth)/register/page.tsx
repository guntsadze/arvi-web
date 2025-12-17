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
import Input from "@/components/ui/Input";

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setGlobalError("");
    try {
      await authService.register(data);
      router.push("/feed");
    } catch (e: any) {
      setGlobalError(e.message || "რეგისტრაცია ვერ მოხერხდა");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      onSubmit={handleSubmit(onRegister)}
      isLoading={isLoading}
      globalError={globalError}
      submitLabel="რეგისტრაცია"
      linkText="უკვე გაქვს ანგარიში?"
      linkHref="/login"
    >
      <div className="grid grid-cols-1 gap-4">
        <Input label="სახელი" id="firstName" {...register("firstName")} />
        <Input label="გვარი" id="lastName" {...register("lastName")} />
        <Input label="UserName" id="username" {...register("username")} />
      </div>
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
