"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

interface ImageSliderProps {
  images: string[];
  aspectRatio?: string;
}

export function ImageSlider({
  images,
  aspectRatio = "aspect-[16/9]",
}: ImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);

  // ESC ღილაკით დახურვა
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMaximized(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (!images || images.length === 0) return null;

  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* მთავარი სლაიდერი პოსტში */}
      <div
        className={`relative ${aspectRatio} overflow-hidden bg-black group/slider cursor-zoom-in`}
      >
        <div
          className="absolute inset-0 z-10"
          onClick={() => setIsMaximized(true)}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full"
          >
            <Image
              src={images[current]}
              alt="Car"
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Hover Action: Zoom Icon */}
        <div className="absolute top-4 left-4 z-20 opacity-0 group-hover/slider:opacity-100 transition-opacity">
          <div className="bg-black/60 backdrop-blur-md p-2 border border-white/10 text-white">
            <Maximize2 size={16} />
          </div>
        </div>

        {/* ისრები */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 z-20 pointer-events-none">
            <button
              onClick={prev}
              className="p-2 bg-black/40 text-white backdrop-blur-sm hover:bg-amber-600 transition-all pointer-events-auto opacity-0 group-hover/slider:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              className="p-2 bg-black/40 text-white backdrop-blur-sm hover:bg-amber-600 transition-all pointer-events-auto opacity-0 group-hover/slider:opacity-100"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        {/* ინდიკატორები */}
        <div className="absolute bottom-4 w-full flex justify-center gap-1.5 z-20 px-10">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 transition-all duration-300 ${
                idx === current ? "w-8 bg-amber-500" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* FULLSCREEN MODAL (LIGHTBOX) */}
      <AnimatePresence>
        {isMaximized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-10"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMaximized(false)}
              className="absolute top-6 right-6 z-[110] text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <X size={32} />
            </button>

            {/* Modal Image Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full h-full max-w-6xl max-h-[80vh]"
              >
                <Image
                  src={images[current]}
                  alt="Car Fullscreen"
                  fill
                  className="object-contain"
                  quality={100}
                />
              </motion.div>

              {/* Modal Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-0 p-4 text-white/40 hover:text-amber-500 transition-all"
                  >
                    <ChevronLeft size={48} strokeWidth={1} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-0 p-4 text-white/40 hover:text-amber-500 transition-all"
                  >
                    <ChevronRight size={48} strokeWidth={1} />
                  </button>
                </>
              )}
            </div>

            {/* Modal Bottom Info */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`relative w-16 h-10 border-2 transition-all overflow-hidden ${
                      idx === current
                        ? "border-amber-500 scale-110"
                        : "border-transparent opacity-40 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt="thumb"
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
