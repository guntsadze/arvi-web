"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "@/lib/validations/auth";
import { authService } from "@/services/auth/auth.services";
import { AuthForm } from "@/components/auth/AuthForm";
import Input from "@/components/ui/Input";

import { AuthDivider } from "@/components/auth/AuthDivider";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { RestoreAccountModal } from "@/components/auth/RestoreAccountModal";
import { setUser } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store/hooks";

type LoginForm = z.infer<typeof loginSchema>;

interface DeletedAccountState {
  identifier?: string;
  password?: string;
  userId?: string;
  deletedAt: string;
  restoreError?: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [deletedAccount, setDeletedAccount] =
    useState<DeletedAccountState | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    const error = searchParams.get("error");
    const userId = searchParams.get("userId");
    const deletedAt = searchParams.get("deletedAt");

    if (error === "ACCOUNT_DELETED" && userId && deletedAt) {
      setDeletedAccount({ userId, deletedAt });
    } else if (error === "OAUTH_FAILED") {
      setError("identifier", { message: "Google ავტორიზაცია ვერ მოხერხდა" });
    }

    if (error) window.history.replaceState({}, "", "/login");
  }, [searchParams, setError]);

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      dispatch(setUser({ user: response.user }));
      router.push("/feed");
      router.refresh();
    } catch (err: any) {
      const errorData = err.response?.data || err.data;
      if (err.status === 409 && errorData?.error === "ACCOUNT_DELETED") {
        setDeletedAccount({
          identifier: data.identifier,
          password: data.password,
          userId: errorData.userId,
          deletedAt: errorData.deletedAt,
        });
      } else {
        setError("identifier", {
          message: errorData?.message ?? "არასწორი მონაცემები",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!deletedAccount) return;
    setIsRestoring(true);
    setDeletedAccount((prev) =>
      prev ? { ...prev, restoreError: undefined } : null,
    );

    try {
      const { restoreToken } = await authService.requestRestore({
        identifier: deletedAccount.identifier,
        password: deletedAccount.password,
        userId: deletedAccount.userId,
      });
      await authService.restoreAccount({ restoreToken });
      setDeletedAccount(null);
      // router.push("/feed");
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.data?.message ||
        "აღდგენა ვერ მოხერხდა";
      setDeletedAccount((prev) =>
        prev ? { ...prev, restoreError: message } : null,
      );
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <>
      <AuthForm
        onSubmit={handleSubmit(onLogin)}
        isLoading={isLoading}
        globalError={errors.identifier?.message}
        submitLabel="ავტორიზაცია"
        linkText="არ გაქვს ანგარიში? რეგისტრაცია"
        linkHref="/register"
      >
        <div className="space-y-4">
          <Input
            label="ელ. ფოსტა / მომხმარებელი"
            id="identifier"
            {...register("identifier")}
          />
          <Input
            label="პაროლი"
            id="password"
            type="password"
            {...register("password")}
          />
        </div>

        <AuthDivider />

        <GoogleLoginButton onClick={authService.redirectToGoogle} />
      </AuthForm>

      {deletedAccount && (
        <RestoreAccountModal
          restoreError={deletedAccount.restoreError}
          isRestoring={isRestoring}
          onClose={() => setDeletedAccount(null)}
          onRestore={handleRestore}
        />
      )}
    </>
  );
}
