import React from "react";
import { X, Sparkles } from "lucide-react";

interface FormHeaderProps {
  isEditing: boolean;
  onClose: () => void;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  isEditing,
  onClose,
}) => (
  <div className="flex items-center justify-between mb-12 border-b-2 border-stone-800 pb-6">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
        <span className="text-xs text-amber-600 font-mono uppercase tracking-wider">
          System Entry Interface
        </span>
      </div>
      <h1 className="text-3xl md:text-5xl font-black text-[#dcd8c8] tracking-tight uppercase">
        {isEditing ? "Edit Configuration" : "New Machine Entry"}
      </h1>
    </div>
    <button
      onClick={onClose}
      className="w-12 h-12 flex items-center justify-center border-2 border-stone-700 bg-stone-800 text-stone-400 hover:text-white hover:border-red-600 hover:bg-red-900/20 transition-all duration-300"
    >
      <X size={24} />
    </button>
  </div>
);
