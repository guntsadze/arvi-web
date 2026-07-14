import React from "react";
import { Save } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

export const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  isEditing,
  onCancel,
}) => {
  return (
    <div className="flex gap-4 pt-10 border-t border-border sticky bottom-0 bg-background/95 backdrop-blur py-6 z-20">
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 bg-accent text-background py-4 font-black uppercase tracking-[0.2em] hover:bg-primary-hover transition-all shadow-[0_0_20px_rgba(180,83,9,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Save className="w-5 h-5" />
            {isEditing ? "ავტომობილის განახლება..." : "ავტომობილის დამატება..."}
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            {isEditing ? "ავტომობილის განახლება" : "ავტომობილის დამატება"}
          </>
        )}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-8 py-4 font-bold uppercase tracking-wider text-text-secondary border-2 border-border hover:border-border hover:text-text-secondary transition-colors bg-background"
      >
        გასვლა
      </button>
    </div>
  );
};
