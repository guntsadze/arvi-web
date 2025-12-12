"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema } from "@/lib/validations/auth";
import { useAuth } from "@/contexts/auth-context";
import * as z from "zod";

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { register: registerUser } = useAuth();

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setError("");
    try {
      await registerUser({
        ...data,
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
      });

      router.push("/feed");
    } catch (e: any) {
      setError(e.message || "რეგისტრაცია ვერ მოხერხდა");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">✍️ რეგისტრაცია</h2>
          <p className="text-gray-600 mt-1">შექმენი ახალი ანგარიში</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={registerForm.handleSubmit(onRegister)}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                სახელი
              </label>
              <input
                id="firstName"
                {...registerForm.register("firstName")}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                გვარი
              </label>
              <input
                id="lastName"
                {...registerForm.register("lastName")}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              ელ. ფოსტა
            </label>
            <input
              id="email"
              type="email"
              {...registerForm.register("email")}
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
              {...registerForm.register("password")}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !registerForm.formState.isValid}
            className="w-full py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "იტვირთება..." : "რეგისტრაცია"}
          </button>
        </form>

        <div className="text-center text-sm mt-4">
          <span className="text-gray-600">უკვე გაქვს ანგარიში? </span>
          <Link href="/login" className="text-indigo-600 hover:underline">
            შესვლა
          </Link>
        </div>
      </div>
    </div>
  );
}
