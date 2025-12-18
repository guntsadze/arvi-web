import React from "react";
import { Upload } from "lucide-react";

export const ImageUpload: React.FC = () => (
  <div className="relative border-2 border-dashed border-stone-700 bg-stone-800/30 flex flex-col items-center justify-center p-6 text-stone-500 hover:border-amber-600 hover:text-amber-500 transition-colors cursor-pointer group h-full min-h-[160px]">
    <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
    <span className="text-xs uppercase tracking-widest font-mono text-center">
      Upload Photos
    </span>
    <span className="text-[9px] text-stone-600 mt-2 font-mono text-center px-4">
      Drag drop or click to access local storage
    </span>
  </div>
);
