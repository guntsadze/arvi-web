import React from "react";

interface RatingSliderProps {
  label: string;
  name: any;
  register: any;
  description: { [key: number]: string };
}

export const RatingSlider: React.FC<RatingSliderProps> = ({
  label,
  name,
  register,
  description,
}) => {
  const { onChange, ...rest } = register(name, { valueAsNumber: true });
  const [currentRating, setCurrentRating] = React.useState(7);

  const getRatingDescription = (rating: number) => {
    if (rating >= 9) return description[10] || "Excellent (9-10)";
    if (rating >= 7) return description[7] || "Very Good (7-8)";
    if (rating >= 5) return description[5] || "Good (5-6)";
    if (rating >= 3) return description[3] || "Average (3-4)";
    return description[1] || "Poor (1-2)";
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setCurrentRating(value);
    onChange(event); // Ensure react-hook-form updates
  };

  return (
    <div className="space-y-2 p-4 border border-stone-800 bg-stone-900/20">
      <label className="block text-[10px] uppercase tracking-widest text-stone-400 font-mono">
        {label}
      </label>
      <input
        type="range"
        min="1"
        max="10"
        step="1"
        {...rest}
        onChange={handleSliderChange}
        value={currentRating}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-stone-700 accent-orange-500"
      />
      <div className="flex justify-between text-xs text-stone-500">
        <span>1</span>
        <span>10</span>
      </div>
      <p className="text-sm text-orange-400">
        <span className="font-semibold">Rating: {currentRating}/10</span> -{" "}
        {getRatingDescription(currentRating)}
      </p>
    </div>
  );
};
