import { Loader2 } from "lucide-react";

const CircleLoader = ({ size = 32, className = "" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <Loader2
        className={`animate-spin text-accent ${className}`}
        size={size}
      />
      <span className="text-text-secondary text-sm animate-pulse">იტვირთება...</span>
    </div>
  );
};

export default CircleLoader;
