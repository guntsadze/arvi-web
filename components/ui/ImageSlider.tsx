"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Layers } from "lucide-react";

interface MediaItem {
  url: string;
  publicId?: string;
  mediaType?: "IMAGE" | "VIDEO";
}

interface ImageSliderProps {
  media: MediaItem[];
  aspectRatio?: string;
}

export function ImageSlider({
  media,
  aspectRatio = "aspect-[16/9]",
}: ImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);

  const imageUrls = useMemo(() => {
    if (!media) return [];
    return media.map((item) => (typeof item === "string" ? item : item.url));
  }, [media]);

  const count = imageUrls.length;

  const next = useCallback(
    (e?: React.MouseEvent | KeyboardEvent) => {
      e?.stopPropagation();
      setCurrent((prev) => (prev + 1) % count);
    },
    [count],
  );

  const prev = useCallback(
    (e?: React.MouseEvent | KeyboardEvent) => {
      e?.stopPropagation();
      setCurrent((prev) => (prev - 1 + count) % count);
    },
    [count],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMaximized) return;
      if (e.key === "Escape") setIsMaximized(false);
      if (e.key === "ArrowRight") next(e);
      if (e.key === "ArrowLeft") prev(e);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMaximized, next, prev]);

  if (!imageUrls || imageUrls.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrent(index);
    setIsMaximized(true);
  };

  const renderGrid = () => {
    const CountBadge = () => (
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-1 border border-white/10 rounded-sm pointer-events-none">
        <Layers size={12} className="text-amber-500" />
        <span className="text-[10px] font-mono font-bold text-white tracking-wider">
          {count} PHOTOS
        </span>
      </div>
    );

    const GridImage = ({
      src,
      index,
      className = "",
    }: {
      src: string;
      index: number;
      className?: string;
    }) => (
      <div
        className={`relative h-full cursor-zoom-in overflow-hidden group border border-stone-800/50 ${className}`}
        onClick={() => openLightbox(index)}
      >
        <Image
          src={src}
          alt={`Media ${index}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
    );

    if (count === 1) {
      return (
        <div className={`relative w-full ${aspectRatio}`}>
          <GridImage src={imageUrls[0]} index={0} />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className={`relative grid grid-cols-2 gap-2 p-1 ${aspectRatio}`}>
          <CountBadge />
          <GridImage src={imageUrls[0]} index={0} />
          <GridImage src={imageUrls[1]} index={1} />
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className={`relative grid grid-cols-2 gap-2 p-1 ${aspectRatio}`}>
          <CountBadge />
          <GridImage src={imageUrls[0]} index={0} />
          <div className="grid grid-rows-2 gap-2">
            <GridImage src={imageUrls[1]} index={1} />
            <GridImage src={imageUrls[2]} index={2} />
          </div>
        </div>
      );
    }

    return (
      <div
        className={`relative grid grid-cols-4 grid-rows-2 gap-2 p-1 ${aspectRatio}`}
      >
        <CountBadge />
        <GridImage
          src={imageUrls[0]}
          index={0}
          className="col-span-3 row-span-2"
        />
        <GridImage src={imageUrls[1]} index={1} />
        <div
          className="relative h-full cursor-zoom-in overflow-hidden group border border-stone-800/50"
          onClick={() => openLightbox(2)}
        >
          <Image
            src={imageUrls[2]}
            alt="More"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {count > 3 && (
            <div className="absolute inset-0 bg-stone-900/90 flex flex-col items-center justify-center text-white border-l border-stone-800">
              <span className="text-lg font-bold">+{count - 3}</span>
              <span className="text-[9px] uppercase tracking-tighter opacity-60">
                More
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="relative bg-[#1a1817] overflow-hidden border-y border-stone-800">
        {renderGrid()}
      </div>

      <AnimatePresence>
        {isMaximized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center p-4 gap-2"
          >
            <button
              onClick={() => setIsMaximized(false)}
              className="absolute top-6 right-6 z-[110] text-white/30 hover:text-white transition-colors p-2"
            >
              <X size={32} strokeWidth={1.5} />
            </button>

            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div
                key={current}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full h-full max-w-6xl max-h-[80vh]"
              >
                <Image
                  src={imageUrls[current]}
                  alt={`Full ${current}`}
                  fill
                  className="object-contain"
                  quality={100}
                  priority
                />
              </motion.div>

              {count > 1 && (
                <>
                  <button
                    onClick={(e) => prev(e)}
                    className="absolute left-4 p-4 text-white/20 hover:text-amber-500 transition-all"
                  >
                    <ChevronLeft size={48} strokeWidth={1} />
                  </button>
                  <button
                    onClick={(e) => next(e)}
                    className="absolute right-4 p-4 text-white/20 hover:text-amber-500 transition-all"
                  >
                    <ChevronRight size={48} strokeWidth={1} />
                  </button>
                </>
              )}
            </div>

            <div className="mt-auto mb-6 flex gap-3 p-2 bg-stone-900/50 border border-white/5 rounded-lg max-w-[90vw]">
              {imageUrls.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`relative flex-shrink-0 w-16 h-12 border transition-all duration-300 ${
                    idx === current
                      ? "border-amber-500 scale-110 opacity-100"
                      : "border-transparent opacity-30 hover:opacity-60"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
