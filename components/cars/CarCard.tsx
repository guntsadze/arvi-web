"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye } from "lucide-react";

interface CarCardProps {
  car: any;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Link href={`/cars/${car.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3]">
          <Image
            src={car.coverImage || car.images?.[0] || "/car-placeholder.png"}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover"
          />
          {car.isProject && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              PROJECT
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">
            {car.make} {car.model}
          </h3>

          {car.nickname && (
            <p className="text-sm text-gray-600 mb-2">"{car.nickname}"</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span>{car.year}</span>
            <span>•</span>
            <span>{car.fuelType}</span>
            {car.horsepower && (
              <>
                <span>•</span>
                <span>{car.horsepower}HP</span>
              </>
            )}
          </div>

          {/* Owner */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={car.user.avatar || "/default-avatar.png"}
                alt={car.user.firstName}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-sm">{car.user.username}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <div className="flex items-center gap-1">
                <Heart size={16} />
                {car.likesCount}
              </div>
              <div className="flex items-center gap-1">
                <Eye size={16} />
                {car.viewsCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
