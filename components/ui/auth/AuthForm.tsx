"use client";

import Link from "next/link";

interface AuthFormProps {
  title: string;
  subtitle: string;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  children: React.ReactNode;
  globalError?: string;
  submitLabel: string;
  linkText: string;
  linkHref: string;
}

export const AuthForm = ({
  title,
  subtitle,
  onSubmit,
  isLoading,
  children,
  globalError,
  submitLabel,
  linkText,
  linkHref,
}: AuthFormProps) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-600 mt-1">{subtitle}</p>
      </div>

      {globalError && (
        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-sm">
          {globalError}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {submitLabel}
          {isLoading && <span className="ml-2">⏳</span>}
        </button>
      </form>

      <div className="text-center text-sm mt-4">
        <span className="text-gray-600">{linkText} </span>
        <Link href={linkHref} className="text-indigo-600 hover:underline">
          {linkHref.includes("login") ? "შესვლა" : "რეგისტრაცია"}
        </Link>
      </div>
    </div>
  </div>
);
