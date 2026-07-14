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
          "relative rounded-sm border-2 border-border bg-surface-1 overflow-hidden",
          "group-hover:border-accent transition-all duration-300",
          "flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        )}
      >
        {mainPhoto ? (
          <Image
            src={mainPhoto}
            alt={`${car.make} ${car.model || "Car"}`}
            fill
            sizes="(max-width: 768px) 64px, 80px" // ოპტიმიზაციისთვის
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <CarIcon
            size={size === "sm" ? 18 : 24}
            className="text-text-muted group-hover:text-accent transition-colors"
          />
        )}
      </div>

      {showLabel && (
        <p className="text-[8px] font-mono text-text-secondary text-center mt-1.5 truncate w-full group-hover:text-accent transition-colors uppercase tracking-tighter">
          {car.make}
        </p>
      )}
    </Link>
  );
};
