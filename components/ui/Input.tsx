"use client";

import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  errorMessage?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  icon,
  errorMessage,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative w-full max-w-md mx-auto p-2 ${className}`}>
      {/* 
        Label Section
        შევიტანეთ ცვლილება: დაემატა flex კონტეინერი, რომ ინდიკატორი და ტექსტი გვერდიგვერდ იყოს
      */}
      <div className="relative z-20 mb-2 inline-block">
        {/* შავი დახეული ფონი */}
        <div
          className="absolute inset-0 bg-stone-800"
          style={{ filter: "url(#rugged-tear-sm)" }}
        />

        {/* კონტენტი: ტექსტი + ინდიკატორი */}
        <div className="relative z-10 flex items-center justify-between gap-3 px-3 py-1.5">
          <label
            className={`
              uppercase tracking-[0.2em] text-[10px] font-black font-mono transition-colors duration-300 cursor-pointer
              ${isFocused ? "text-amber-500" : "text-[#EBE9E1]"}
            `}
          >
            {label}
          </label>

          {/* ინდიკატორი (ნათურა) */}
          <div
            className={`h-2 w-2 rounded-full transition-all duration-300 border border-stone-600
            ${
              isFocused
                ? "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,1)] border-amber-400"
                : "bg-stone-900 shadow-inner"
            }
          `}
          />
        </div>
      </div>

      {/* Main Input Wrapper */}
      <div className="relative w-full group h-16">
        {/* ფენა 1: შავი ფონი (ჩრდილი/სისქე) */}
        <div
          className="absolute inset-0 bg-[#1a1918] transition-transform duration-300"
          style={{
            filter: "url(#rugged-tear)",
            transform: isFocused
              ? "scale(1.02) rotate(-1deg)"
              : "scale(1) rotate(0deg)",
          }}
        />

        {/* ფენა 2: მთავარი ქაღალდი */}
        <div
          className="absolute inset-[2px] bg-[#EBE9E1] transition-all duration-300"
          style={{
            filter: "url(#rugged-tear)",
            backgroundColor: isFocused ? "#e1ded3" : "#EBE9E1",
          }}
        />

        {/* ფენა 3: კონტენტი */}
        <div className="relative z-10 flex items-center h-full w-full px-4">
          {icon && (
            <div
              className={`mr-4 transition-colors duration-300 ${
                isFocused ? "text-amber-700" : "text-stone-500"
              }`}
            >
              {icon}
            </div>
          )}

          <input
            {...props}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              w-full h-full bg-transparent outline-none border-none
              text-stone-900 font-serif text-xl tracking-wider placeholder:text-stone-400/60
              disabled:opacity-50
            `}
          />
        </div>

        {/* დეკორაცია: ბოლტები */}
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-900/30 blur-[1px] pointer-events-none" />
        <div className="absolute bottom-3 left-6 w-2 h-2 rounded-full bg-stone-500/20 blur-[2px] pointer-events-none" />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-3 relative inline-block">
          <span className="relative z-10 text-red-900 text-xs font-bold font-mono px-2 py-1 bg-red-400/20">
            ⚠ {errorMessage}
          </span>
          <div className="absolute bottom-0 left-0 w-full h-full border-b-2 border-red-600 -rotate-1 opacity-70" />
        </div>
      )}

      {/* SVG FILTERS */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="rugged-tear" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.045"
              numOctaves="5"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          <filter
            id="rugged-tear-sm"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.08"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="3"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default Input;
