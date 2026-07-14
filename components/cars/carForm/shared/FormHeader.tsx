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
  <div className="flex items-center justify-between mb-4 border-b-2 border-border pb-6">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-accent animate-pulse" />
        <span className="text-xs text-accent font-mono uppercase tracking-wider">
          წარმოადგინე შენი ავტომობილი - შენი ხასიათის ანარეკლი.
        </span>
      </div>
      <h1 className="text-3xl md:text-3xl font-bold text-text-primary">
        {isEditing ? "ავტომობილის რედაქტირება" : "ავტომობილის დამატება"}
      </h1>
    </div>
    <button
      onClick={onClose}
      className="w-12 h-12 flex items-center justify-center border-2 border-border bg-surface-2 text-text-secondary hover:text-white hover:border-error hover:bg-error/10/20 transition-all duration-300"
    >
      <X size={24} />
    </button>
  </div>
);
