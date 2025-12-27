"use client";

import Image from "next/image";
import { Gauge, Zap, Wind, Disc, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

export default function E34HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1c1917] border-b-4 border-stone-800 p-6">
      {/* 1. უკანა ფონი - მილიმეტრული ქაღალდის ეფექტი */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #44403c 1px, transparent 1px),
            linear-gradient(to bottom, #44403c 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* რადიალური გრადიენტი ცენტრში */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(245,158,11,0.1) 0%, transparent 70%)",
        }}
      />

      {/* 2. დეკორატიული ტექსტები (ფონზე) - გაუმჯობესებული */}
      <div className="absolute top-10 left-4 md:left-20 text-[120px] md:text-[200px] font-black text-stone-800/40 leading-none select-none z-0 tracking-tighter">
        E34
      </div>
      <div className="absolute bottom-0 right-0 text-[100px] md:text-[180px] font-black text-stone-800/30 leading-none select-none z-0 tracking-tighter">
        M5
      </div>

      {/* 3. მთავარი კონტეინერი */}
      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center items-center px-4">
        {/* სათაური და ქვესათაური */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-amber-700/30 bg-amber-950/20 rounded-full">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className="text-xs md:text-sm text-amber-600 font-mono uppercase tracking-wider">
              Legendary M Series
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#dcd8c8] mb-3 tracking-tight">
            BMW E34 M5
          </h1>
          <p className="text-sm md:text-base text-stone-400 font-mono max-w-2xl mx-auto">
            The ultimate business sedan that redefined performance.
            <span className="text-amber-600"> Hand-built precision.</span>
          </p>
        </div>

        {/* მანქანის ვიზუალი */}
        <div className="relative w-full max-w-5xl h-[45vh] md:h-[40vh] flex items-center justify-center group">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-1/2 bg-stone-800/50 animate-pulse rounded-lg" />
            </div>
          )}

          {/* სურათი */}
          <div
            className={`relative w-full h-full grayscale contrast-125 sepia-[0.3] group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-105 transition-all duration-700 ease-in-out ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src="https://www.bmwgroup-classic.com/content/dam/grpw/websites/bmwgroup-classic_com/productcatalog2/images_pc/AF-55240-1.png/_jcr_content/renditions/original"
              alt="BMW E34 M5 Side Profile"
              fill
              className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]"
              priority
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* გაუმჯობესებული ანოტაციები */}
          <div className="absolute top-[30%] left-[20%] w-[1px] h-20 bg-amber-600/60 hidden md:block group-hover:bg-amber-500 transition-colors">
            <div className="absolute -top-2 -left-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-amber-600/60 group-hover:w-40 transition-all" />
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-500 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
              Engine: S38B38 (3.8L I6)
            </div>
          </div>

          <div className="absolute bottom-[25%] left-[23%] w-[1px] h-16 bg-stone-500/60 hidden md:block rotate-12 group-hover:bg-stone-400 transition-colors">
            <div className="absolute top-0 left-0 w-20 h-[1px] bg-stone-500/60 -translate-x-full group-hover:w-24 transition-all" />
            <div className="absolute -top-4 -left-28 text-[10px] font-mono text-stone-400 uppercase text-right opacity-0 group-hover:opacity-100 transition-opacity">
              Whl: M-System II "Throwing Stars"
            </div>
          </div>

          <div className="absolute top-[35%] right-[15%] w-[1px] h-24 bg-stone-500/60 hidden md:block group-hover:bg-stone-400 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-[1px] bg-stone-500/60 group-hover:w-32 transition-all" />
            <div className="absolute -top-5 right-0 text-[10px] font-mono text-stone-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
              Chassis: Sedan (WBA...)
            </div>
          </div>
        </div>

        {/* 4. ტექნიკური მონაცემების დაფა */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-4xl mt-8 md:mt-10 border-t border-stone-700 pt-6 md:pt-8">
          <SpecBox
            icon={<Zap className="text-amber-600" />}
            label="Power Output"
            value="340 HP"
            sub="7,000 RPM"
          />
          <SpecBox
            icon={<Gauge className="text-amber-600" />}
            label="Top Speed"
            value="250 km/h"
            sub="Electronically Limited"
          />
          <SpecBox
            icon={<Wind className="text-amber-600" />}
            label="0-100 km/h"
            value="5.9 sec"
            sub="Manual 5-Speed"
          />
          <SpecBox
            icon={<Disc className="text-amber-600" />}
            label="Production"
            value="1988-1995"
            sub="Garching, Germany"
          />
        </div>

        {/* CTA ღილაკი - მთავარი ელემენტი */}
        <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="/feed"
            className="group relative px-8 py-4 bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold text-sm md:text-base uppercase tracking-widest transition-all duration-300 overflow-hidden"
          >
            {/* ღილაკის ანიმირებული ფონი */}
            <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />

            {/* ტექსტი და ხატულა */}
            <span className="relative flex items-center gap-3">
              Explore Gallery
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </span>

            {/* გრანიცა ეფექტი */}
            <span className="absolute top-0 left-0 w-full h-[2px] bg-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            <span className="absolute bottom-0 right-0 w-full h-[2px] bg-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right" />
          </a>

          {/* დამატებითი ღილაკი (ოფციონალური) */}
          <button className="px-6 py-4 border-2 border-stone-700 hover:border-amber-600 text-stone-400 hover:text-amber-600 font-mono text-xs md:text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            Technical Specs
          </button>
        </div>
      </div>

      {/* სტიკერი "Verified" - გაუმჯობესებული */}
      <div className="absolute top-6 md:top-10 right-6 md:right-10 border-2 border-amber-700 p-2 rotate-[-5deg] opacity-90 mix-blend-screen hidden md:block hover:rotate-0 transition-transform duration-300">
        <div className="border border-amber-700 px-4 py-1">
          <span className="text-amber-600 font-black text-lg md:text-xl tracking-widest uppercase">
            CLASSIC
          </span>
        </div>
      </div>

      {/* მობილური badge */}
      <div className="absolute top-4 right-4 md:hidden border border-amber-700/50 px-3 py-1 bg-amber-950/30">
        <span className="text-amber-600 font-bold text-xs tracking-wider uppercase">
          M5
        </span>
      </div>

      {/* სკანერის ეფექტი */}
      <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-scan opacity-30 pointer-events-none" />
    </div>
  );
}

// გაუმჯობესებული SpecBox კომპონენტი
function SpecBox({ icon, label, value, sub }: any) {
  return (
    <div className="flex flex-col items-start p-3 md:p-4 border border-stone-800 bg-[#292524] hover:border-amber-700/50 hover:bg-[#312e29] transition-all duration-300 group cursor-pointer hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]">
      <div className="mb-2 opacity-70 group-hover:opacity-100 transition-opacity group-hover:scale-110 transform duration-300">
        {icon}
      </div>
      <span className="text-[10px] md:text-xs text-stone-500 font-mono uppercase tracking-widest mb-1">
        {label}
      </span>
      <span className="text-lg md:text-xl lg:text-2xl font-black text-[#dcd8c8] group-hover:text-amber-600 transition-colors">
        {value}
      </span>
      <span className="text-[8px] md:text-[9px] text-amber-700 font-mono mt-1 group-hover:text-amber-500 transition-colors">
        {sub}
      </span>
    </div>
  );
}
