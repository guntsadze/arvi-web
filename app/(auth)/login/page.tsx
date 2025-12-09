"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema } from "@/lib/validations/auth";
import { useAuth } from "@/contexts/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { authService } from "@/services/auth/auth.services";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // ღილაკის disabled-ის კონტროლი
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");
    try {
      const authData = await authService.login({
        email: data.email,
        password: data.password,
      });

      console.log("Login response:", authData.user); // user უნდა იყოს აქ არა null

      // router.push("/dashboard");
    } catch (e: any) {
      setError(e.message || "შესვლა ვერ მოხერხდა");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            🚗 შესვლა
          </CardTitle>
          <CardDescription className="text-center">
            შესვლა შენს ანგარიშში
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ელ. ფოსტა</Label>
              <Input id="email" type="email" {...register("email")} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">პაროლი</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !formState.isValid}
            >
              {isLoading ? "იტვირთება..." : "შესვლა"}
            </Button>
          </form>

          <div className="text-center text-sm mt-4">
            <span className="text-gray-600">არ გაქვს ანგარიში? </span>
            <Link href="/register" className="text-blue-600 hover:underline">
              რეგისტრაცია
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
