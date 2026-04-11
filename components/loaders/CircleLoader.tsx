import { Loader2 } from "lucide-react";

const CircleLoader = ({ size = 32, className = "" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <Loader2
        className={`animate-spin text-amber-600 ${className}`}
        size={size}
      />
      <span className="text-stone-400 text-sm animate-pulse">იტვირთება...</span>
    </div>
  );
};

export default CircleLoader;
