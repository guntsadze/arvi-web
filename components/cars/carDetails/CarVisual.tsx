import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Car, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Car as CarType } from "../../../types/car.types";

interface CarVisualProps {
  car: CarType;
}

export const CarVisual: React.FC<CarVisualProps> = ({ car }) => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const photos = car.photos || [];

  const nextImage = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    },
    [photos.length]
  );

  const prevImage = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    },
    [photos.length]
  );

  const closeSlider = () => setIsSliderOpen(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSliderOpen) return;
      if (e.key === "Escape") closeSlider();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSliderOpen, nextImage, prevImage]);

  const sliderContent = (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center transition-all duration-500"
      onClick={closeSlider} // ღილაკის გარეთ დაკლიკება დახურვისთვის
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // არ დახუროს კლიკით ფოტოზე
      >
        {/* Close Button */}
        <button
          onClick={closeSlider}
          className="absolute top-6 right-6 text-white/50 hover:text-amber-500 transition-colors z-[110]"
        >
          <X size={40} strokeWidth={1} />
        </button>

        {/* Counter */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/40 tracking-[0.3em] text-xs font-light">
          {currentIndex + 1} / {photos.length}
        </div>

        {/* Navigation */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 md:left-10 p-4 text-white/30 hover:text-amber-500 hover:bg-white/5 rounded-full transition-all"
            >
              <ChevronLeft size={48} strokeWidth={1} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 md:right-10 p-4 text-white/30 hover:text-amber-500 hover:bg-white/5 rounded-full transition-all"
            >
              <ChevronRight size={48} strokeWidth={1} />
            </button>
          </>
        )}

        {/* Image */}
        <img
          src={photos[currentIndex]?.url}
          alt={`${car.make} ${car.model}`}
          className="max-w-full max-h-[80vh] object-contain select-none shadow-2xl shadow-amber-500/10 transition-all duration-500"
        />

        {/* Thumbnails */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
          {photos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-12 h-12 border-2 transition-all ${
                idx === currentIndex
                  ? "border-amber-500 scale-110"
                  : "border-white/10 opacity-40 hover:opacity-100"
              }`}
            >
              <img
                src={photo.url}
                className="w-full h-full object-cover"
                alt="thumbnail"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] flex items-center justify-center group">
      {/* მთავარი ქარდი */}
      <div
        onClick={() => photos.length > 0 && setIsSliderOpen(true)}
        className="relative w-full h-full grayscale contrast-125 sepia-[0.3] group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-[1.01] transition-all duration-700 ease-in-out bg-stone-900/50 border-2 border-stone-800 overflow-hidden cursor-pointer"
      >
        <div className="w-full h-full flex items-center justify-center">
          {photos.length > 0 ? (
            <img
              src={photos[0].url}
              alt={`${car.make} ${car.model}`}
              className="object-cover w-full h-full"
            />
          ) : (
            <Car className="w-24 h-24 text-stone-700 group-hover:text-amber-500 transition-colors duration-500" />
          )}
        </div>
      </div>

      {/* Slider Portal */}
      {isSliderOpen && createPortal(sliderContent, document.body)}
    </div>
  );
};
