"use client";

import Link from "next/link";
import { ShieldCheck, Cpu } from "lucide-react";

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
  <div className="min-h-screen flex items-center justify-center bg-[#1c1917] relative overflow-hidden">
    {/* Background Grid & Effects */}
    <div
      className="absolute inset-0 opacity-20 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, #44403c 1px, transparent 1px),
          linear-gradient(to bottom, #44403c 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />

    {/* Animated Scanline - კლასი "animate-scan" უნდა დაამატო globals.css-ში, 
       თუ არ დაამატებ, უბრალოდ ხაზი იქნება ანიმაციის გარეშე, შეცდომას არ გამოიწვევს */}
    <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-scan opacity-20 pointer-events-none" />

    {/* Decorative Big Text */}
    <div className="absolute -bottom-20 -right-20 text-[200px] font-black text-stone-800/20 leading-none select-none pointer-events-none z-0">
      SYSTEM
    </div>

    <div className="relative z-10 w-full max-w-md mx-4">
      {/* Main Card Container */}
      <div className="relative group bg-[#201d1b] border border-stone-800 p-8 md:p-10 shadow-2xl">
        {/* Tech Corners */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-600" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-600" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-600" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-600" />

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-900 border border-stone-700 mb-6 group-hover:border-amber-600/50 transition-colors duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <ShieldCheck className="w-8 h-8 text-amber-600" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-8 bg-stone-700" />
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-[0.3em]">
              Secure Access
            </span>
            <div className="h-px w-8 bg-stone-700" />
          </div>

          <h2 className="text-3xl font-black text-[#EBE9E1] uppercase tracking-tighter">
            {title}
          </h2>
          <p className="text-stone-500 font-mono text-xs mt-2 uppercase">
            {subtitle}
          </p>
        </div>

        {globalError && (
          <div className="mb-6 p-4 bg-red-900/10 border border-red-900/50 flex items-start gap-3">
            <div className="text-red-500 mt-0.5">
              <Cpu size={16} className="animate-pulse" />
            </div>
            <div>
              <span className="text-red-500 text-[10px] font-mono uppercase tracking-widest block mb-1">
                System Error
              </span>
              <span className="text-red-400 text-xs font-mono block">
                {globalError}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {children}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              clipPath:
                "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
            }}
            className="
                w-full py-4 mt-6
                bg-amber-700 text-stone-900
                font-black uppercase tracking-[0.2em] text-sm
                hover:bg-amber-600 
                transition-all duration-200
                shadow-[0_0_20px_rgba(180,83,9,0.2)]
                hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]
                disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isLoading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              submitLabel
            )}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-stone-800">
          <span className="text-stone-600 text-xs font-mono uppercase mr-2">
            {linkText}
          </span>
          <Link
            href={linkHref}
            className="text-amber-600 hover:text-amber-500 text-xs font-bold font-mono uppercase tracking-wider hover:underline underline-offset-4 decoration-amber-600/50 transition-all"
          >
            {linkHref.includes("login") ? "Open Log" : "Initialize"} →
          </Link>
        </div>
      </div>
    </div>
  </div>
);
