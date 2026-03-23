"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations/auth";
import { authService } from "@/services/auth/auth.services";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import Input from "@/components/ui/Input";

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("AUTH_REQUIRED", handleOpen);
    return () => window.removeEventListener("AUTH_REQUIRED", handleOpen);
  }, []);

  const onLogin = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      dispatch(setUser({ user: response.user }));
      setIsOpen(false);
      window.location.reload(); // სესიის სრულად აღსადგენად
    } catch (err: any) {
      setError("identifier", { message: "ავტორიზაცია ვერ მოხერხდა" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-[400px] bg-[#0f0d0c] border border-stone-900 p-8 shadow-2xl relative">
        {/* UI Elements */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-amber-600/20" />

        <div className="mb-8">
          <h2 className="text-amber-600 font-mono text-[14px] uppercase tracking-[0.2em]">
            Session Expired
          </h2>
          <p className="text-stone-500 font-mono text-[10px] mt-1 uppercase">
            Please re-authenticate to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
          <Input label="Email / Username" {...register("identifier")} />
          <Input label="Password" type="password" {...register("password")} />

          <button
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-black font-mono text-[11px] py-3 uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Login"}
          </button>

          <button
            type="button"
            onClick={() => (window.location.href = "/register")}
            className="w-full border border-stone-800 text-stone-500 hover:text-[#EBE9E1] font-mono text-[10px] py-2 uppercase transition-colors"
          >
            Create New Account
          </button>
        </form>

        <button
          onClick={() => setIsOpen(false)}
          className="w-full mt-4 text-[9px] font-mono text-stone-700 hover:text-stone-400 uppercase tracking-widest transition-colors"
        >
          [ Cancel and go back ]
        </button>
      </div>
    </div>
  );
}
