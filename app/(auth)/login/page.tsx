"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema } from "@/lib/validations/auth";
import { authService } from "@/services/auth/auth.services";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");
    try {
      const authData = await authService.login({
        email: data.email,
        password: data.password,
      });

      console.log("Login response:", authData);

      router.push("/dashboard");
    } catch (e: any) {
      setError("შესვლა ვერ მოხერხდა");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">🚗 შესვლა</h2>
          <p className="text-gray-600 text-sm mt-1">შესვლა შენს ანგარიშში</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              ელ. ფოსტა
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              პაროლი
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !formState.isValid}
            className="w-full py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "იტვირთება..." : "შესვლა"}
          </button>
        </form>

        <div className="text-center text-sm mt-4">
          <span className="text-gray-600">არ გაქვს ანგარიში? </span>
          <Link href="/register" className="text-indigo-600 hover:underline">
            რეგისტრაცია
          </Link>
        </div>
      </div>
    </div>
  );
}
