"use client";

import Link from "next/link";
import { Wrench } from "lucide-react";

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
  <div className="min-h-screen flex items-center justify-center bg-[#151413] relative overflow-hidden">
    {/* Background Decors */}
    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-600/20 blur-[100px] rounded-full"></div>

    <div className="relative w-full max-w-md mx-4">
      {/* Main Card Container with Torn Effect */}
      <div className="relative group">
        {/* Shadow Layer */}
        <div
          className="absolute inset-0 bg-black transform translate-x-3 translate-y-3"
          style={{ filter: "url(#rugged-tear-auth)" }}
        />

        {/* Content Layer */}
        <div
          className="relative bg-[#dcd8c8] p-8 md:p-10"
          style={{ filter: "url(#rugged-tear-auth)" }}
        >
          {/* Screws */}
          <div className="absolute top-4 left-4 text-stone-400 opacity-50">
            +
          </div>
          <div className="absolute top-4 right-4 text-stone-400 opacity-50">
            +
          </div>
          <div className="absolute bottom-4 left-4 text-stone-400 opacity-50">
            +
          </div>
          <div className="absolute bottom-4 right-4 text-stone-400 opacity-50">
            +
          </div>

          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-stone-800 pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-stone-800 p-3 rounded-full text-amber-500 shadow-lg border-2 border-stone-600">
                <Wrench size={32} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-stone-800 uppercase tracking-tighter">
              {title}
            </h2>
            <p className="text-stone-600 font-mono text-xs tracking-widest mt-2 uppercase">
              {subtitle}
            </p>
          </div>

          {globalError && (
            <div className="mb-6 p-4 bg-red-900/10 border-l-4 border-red-700 text-red-900 text-xs font-mono font-bold">
              ⚠️ SYSTEM ERROR: {globalError}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {children}

            <button
              type="submit"
              disabled={isLoading}
              className="
                            w-full py-4 mt-4
                            bg-stone-800 text-[#EBE9E1]
                            font-black uppercase tracking-[0.2em] text-sm
                            border-2 border-transparent
                            hover:bg-amber-600 hover:text-stone-900
                            shadow-[4px_4px_0px_0px_#1c1917]
                            hover:shadow-[2px_2px_0px_0px_#1c1917] hover:translate-x-[2px] hover:translate-y-[2px]
                            active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-150
                        "
            >
              {isLoading ? "AUTHENTICATING..." : submitLabel}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-stone-400 border-dashed">
            <span className="text-stone-600 text-sm font-serif italic">
              {linkText}{" "}
            </span>
            <Link
              href={linkHref}
              className="ml-2 font-bold uppercase text-amber-700 hover:text-stone-900 underline decoration-2 decoration-amber-500 underline-offset-4 transition-colors"
            >
              {linkHref.includes("login") ? "Access Log" : "New Registration"}
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* SVG Filters for Auth (slightly cleaner tear than main input) */}
    <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        <filter
          id="rugged-tear-auth"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="4"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  </div>
);
