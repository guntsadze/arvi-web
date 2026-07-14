"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Terminal } from "lucide-react";

export const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
      {/* ფონის Carbon Texture ეფექტი */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="relative flex flex-col items-center">
        {/* ცენტრალური ანიმაციური წრე */}
        <div className="relative w-24 h-24 mb-8">
          {/* გარეთა მბრუნავი რგოლი */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-r-2 border-accent/30 rounded-full"
          />

          {/* შიდა მბრუნავი რგოლი (საპირისპიროდ) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border-b-2 border-l-2 border-accent rounded-full"
          />

          {/* ცენტრალური ხატულა */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Zap size={32} className="text-accent fill-accent/20" />
            </motion.div>
          </div>
        </div>

        {/* ტექსტური ინდიკატორი */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-text-secondary" />
            <span className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-[0.5em] animate-pulse">
              მონაცემები იტვირთება
            </span>
          </div>

          {/* პროგრესის იმიტაცია (დეკორატიული) */}
          <div className="w-48 h-[2px] bg-surface-1 overflow-hidden relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
