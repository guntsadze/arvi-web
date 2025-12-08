"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema } from "@/lib/validations/auth";
import { useAuth } from "@/contexts/auth-context";
import * as z from "zod";

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

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { register: registerUser } = useAuth();

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
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
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            ✍️ რეგისტრაცია
          </CardTitle>
          <CardDescription className="text-center">
            შექმენი ახალი ანგარიში
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <Label htmlFor="firstName">სახელი</Label>
                <Input
                  id="firstName"
                  {...registerForm.register("firstName")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">გვარი</Label>
                <Input
                  id="lastName"
                  {...registerForm.register("lastName")}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ელ. ფოსტა</Label>
              <Input
                id="email"
                type="email"
                {...registerForm.register("email")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">პაროლი</Label>
              <Input
                id="password"
                type="password"
                {...registerForm.register("password")}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !registerForm.formState.isValid}
            >
              {isLoading ? "იტვირთება..." : "რეგისტრაცია"}
            </Button>
          </form>

          <div className="text-center text-sm mt-4">
            <span className="text-gray-600">უკვე გაქვს ანგარიში? </span>
            <Link href="/login" className="text-blue-600 hover:underline">
              შესვლა
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
