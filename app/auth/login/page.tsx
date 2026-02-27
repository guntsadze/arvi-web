"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";

import { loginSchema } from "@/lib/validations/auth";
import { authService } from "@/services/auth/auth.services";
import { AuthForm } from "@/components/ui/auth/AuthForm";
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

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <AuthForm
      onSubmit={handleSubmit(onLogin)}
      isLoading={isLoading}
      globalError={globalError}
      submitLabel="ავტორიზაცია"
      linkText="არ გაქვს ანგარიში? რეგისტრაცია"
      linkHref="/auth/register"
    >
      <div className="space-y-4">
        <Input
          label="ელ. ფოსტა / მომხმარებელი"
          id="identifier"
          type="text"
          placeholder="ENTER_IDENTIFIER..."
          {...register("identifier")}
        />

        <Input
          label="პაროლი"
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
        />
      </div>

      {/* გამყოფი ხაზი */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-800"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-mono">
          <span className="bg-[#1a1918] px-4 text-stone-500 tracking-[0.3em]">
            ან
          </span>
        </div>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="group relative w-full flex items-center justify-center gap-3 px-4 py-3 bg-stone-900 border-2 border-stone-800 hover:border-amber-500 transition-all duration-300 active:translate-y-0.5 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] hover:shadow-none"
      >
        {/* Google Icon SVG */}
        <svg
          className="w-5 h-5 group-hover:scale-110 transition-transform"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            className="text-stone-400 group-hover:text-amber-500 transition-colors"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            className="text-stone-400 group-hover:text-amber-500 transition-colors"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            className="text-stone-400 group-hover:text-amber-500 transition-colors"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          />
          <path
            fill="currentColor"
            className="text-stone-400 group-hover:text-amber-500 transition-colors"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
          />
        </svg>

        <span className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 group-hover:text-amber-500 transition-colors">
          Google_Auth_Node
        </span>

        {/* დეკორატიული ელემენტი კუთხეში (სურვილისამებრ) */}
        <div className="absolute top-0 right-0 w-1 h-1 bg-stone-700 group-hover:bg-amber-500"></div>
      </button>
    </AuthForm>
  );
}
