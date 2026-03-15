import Link from "next/link";
import { Car as CarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CarAvatarItemProps {
  car: {
    id: string;
    make: string;
    model?: string;
    photos?: { url: string }[];
  };
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export const CarAvatarItem = ({
  car,
  size = "md",
  showLabel = true,
  className,
}: CarAvatarItemProps) => {
  // ზომების რუკა (დესკტოპის ვერსიის 16x16 არის 'md')
  const sizes = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const mainPhoto =
    car.photos && car.photos.length > 0 ? car.photos[0].url : null;

  return (
    <Link
      href={`/cars/${car.id}`}
      className={cn("flex flex-col items-center group shrink-0", className)}
    >
      <div
        className={cn(
          sizes[size],
          "rounded-sm border-2 border-stone-700 bg-stone-900 overflow-hidden",
          "group-hover:border-amber-500 transition-all duration-300",
          "flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        )}
      >
        {mainPhoto ? (
          <Image
            src={mainPhoto}
            alt={`${car.make} ${car.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <CarIcon
            size={size === "sm" ? 18 : 24}
            className="text-stone-700 group-hover:text-amber-500 transition-colors"
          />
        )}
      </div>

      {showLabel && (
        <p className="text-[8px] font-mono text-stone-500 text-center mt-1.5 truncate w-full group-hover:text-amber-500 transition-colors uppercase tracking-tighter">
          {car.make}
        </p>
      )}
    </Link>
  );
};
