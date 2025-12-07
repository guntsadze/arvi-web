"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock, User, Chrome, Apple } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { useAuth } from "@/contexts/auth-context";

type RegisterForm = z.infer<typeof registerSchema>;
type LoginForm = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const { login, register: registerUser } = useAuth();

  const handleOAuth = (provider: string) => {
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
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
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");
    try {
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 shadow-lg">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "შესვლა" : "რეგისტრაცია"}
        </h1>

        {/* Toggle */}
        <div className="flex bg-[#131313] rounded-md overflow-hidden mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm ${
              isLogin
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-[#222]"
            }`}
          >
            შესვლა
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm ${
              !isLogin
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-[#222]"
            }`}
          >
            რეგისტრაცია
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-900/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Forms */}
        {isLogin ? (
          // LOGIN
          <form
            onSubmit={loginForm.handleSubmit(onLogin)}
            className="space-y-4"
          >
            <div>
              <div className="text-sm mb-1">იმეილი</div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  {...loginForm.register("email")}
                  type="email"
                  className="w-full bg-[#121212] border border-gray-700 rounded-md pl-10 py-3 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <div className="text-sm mb-1">პაროლი</div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  {...loginForm.register("password")}
                  type="password"
                  className="w-full bg-[#121212] border border-gray-700 rounded-md pl-10 py-3 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md text-white flex justify-center gap-2"
            >
              {isLoading && <Loader2 className="animate-spin" />}
              შესვლა
            </button>
          </form>
        ) : (
          // REGISTER
          <form
            onSubmit={registerForm.handleSubmit(onRegister)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm mb-1">სახელი</div>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <input
                    {...registerForm.register("firstName")}
                    className="w-full bg-[#121212] border border-gray-700 rounded-md pl-10 py-3"
                  />
                </div>
              </div>

              <div>
                <div className="text-sm mb-1">გვარი</div>
                <input
                  {...registerForm.register("lastName")}
                  className="w-full bg-[#121212] border border-gray-700 rounded-md py-3 px-3"
                />
              </div>
            </div>

            <div>
              <div className="text-sm mb-1">იმეილი</div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  {...registerForm.register("email")}
                  type="email"
                  className="w-full bg-[#121212] border border-gray-700 rounded-md pl-10 py-3"
                />
              </div>
            </div>

            <div>
              <div className="text-sm mb-1">პაროლი</div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  {...registerForm.register("password")}
                  type="password"
                  className="w-full bg-[#121212] border border-gray-700 rounded-md pl-10 py-3"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md text-white flex justify-center gap-2"
            >
              {isLoading && <Loader2 className="animate-spin" />}
              რეგისტრაცია
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="my-6 border-t border-gray-700" />

        {/* OAuth */}
        <div className="space-y-3">
          <button
            onClick={() => handleOAuth("google")}
            className="w-full py-3 border border-gray-700 rounded-md flex items-center justify-center gap-3 hover:bg-[#222]"
          >
            <Chrome />
            Google
          </button>

          <button
            onClick={() => handleOAuth("facebook")}
            className="w-full py-3 border border-gray-700 rounded-md flex items-center justify-center gap-3 hover:bg-[#222]"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V11h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12z" />
            </svg>
            Facebook
          </button>

          <button
            onClick={() => handleOAuth("apple")}
            className="w-full py-3 border border-gray-700 rounded-md flex items-center justify-center gap-3 hover:bg-[#222] bg-black text-white"
          >
            <Apple />
            Apple
          </button>
        </div>
      </div>
    </div>
  );
}
