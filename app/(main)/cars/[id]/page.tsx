import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Car,
  User,
  Calendar,
  Fuel,
  Gauge,
  Settings,
  MapPin,
} from "lucide-react";
import { carsService } from "@/services/cars/cars.service";
import { cookies } from "next/headers";

// ტიპები (შეგიძლია გადაიტანო ცალკე ფაილში თუ გინდა)
type CarData = {
  id: string;
  make: string;
  model: string;
  year: number;
  nickname?: string | null;
  description?: string | null;
  horsepower?: number | null;
  torque?: number | null;
  fuelType?: string | null;
  transmission?: string | null;
  driveType?: string | null;
  mileage?: number | null;
  location?: string | null;
  images: string[]; // მასივი URL-ების
  createdAt: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };
};

export default async function CarPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const car = await carsService.getCarDetails(id, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!car) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 text-accent hover:text-accent mb-6 transition-colors"
        >
          ← უკან მანქანების სიაში
        </Link>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images Gallery */}
          <div className="space-y-4">
            {car.photos && car.photos.length > 0 ? (
              <>
                {/* Main Image - პირველი ფოტო */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-surface-1">
                  <Image
                    src={car.photos[0].url}
                    alt={`${car.make} ${car.model} - მთავარი ფოტო`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Thumbnails - დანარჩენი ფოტოები (თუ 1-ზე მეტია) */}
                {car.photos.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                    {car.photos.slice(1).map((photo, index) => (
                      <div
                        key={photo.id}
                        className="relative aspect-square rounded-lg overflow-hidden bg-surface-1 cursor-pointer hover:opacity-90 transition-opacity"
                        // სურვილისამებრ: onClick-ით გახსნა მთავარ ფოტოდ
                      >
                        <Image
                          src={photo.url}
                          alt={`${car.make} ${car.model} - ფოტო ${index + 2}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, 15vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* No photos fallback */
              <div className="relative aspect-video rounded-xl bg-surface-1 flex items-center justify-center flex-col gap-4">
                <Car size={80} className="text-text-primary" />
                <p className="text-text-secondary text-lg">
                  ფოტოები არ არის ატვირთული
                </p>
              </div>
            )}
          </div>

          {/* Car Info */}
          <div className="space-y-6">
            {/* Title & Nickname */}
            <div>
              <h1 className="text-4xl font-bold">
                {car.year} {car.make} {car.model}
              </h1>
              {car.nickname && (
                <p className="text-2xl text-accent mt-2">"{car.nickname}"</p>
              )}
            </div>

            {/* Owner */}
            <Link
              href={`/profile/${car.user.username}`}
              className="flex items-center gap-3 hover:bg-surface-1-hover p-3 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-surface-2 overflow-hidden flex items-center justify-center">
                {car.user.avatar ? (
                  <Image
                    src={car.user.avatar?.url}
                    alt={car.user.username}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <User size={24} className="text-accent" />
                )}
              </div>
              <div>
                <p className="text-sm text-text-secondary">მფლობელი</p>
                <p className="font-medium">
                  {car.user.firstName} {car.user.lastName} (@{car.user.username}
                  )
                </p>
              </div>
            </Link>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4">
              {car.horsepower && (
                <div className="bg-surface-1 rounded-lg p-4">
                  <p className="text-text-secondary text-sm flex items-center gap-2">
                    <Gauge size={16} />
                    ცხ.ძ.
                  </p>
                  <p className="text-xl font-bold">{car.horsepower} hp</p>
                </div>
              )}

              {car.torque && (
                <div className="bg-surface-1 rounded-lg p-4">
                  <p className="text-text-secondary text-sm">ბრუნვის მომენტი</p>
                  <p className="text-xl font-bold">{car.torque} Nm</p>
                </div>
              )}

              {car.fuelType && (
                <div className="bg-surface-1 rounded-lg p-4">
                  <p className="text-text-secondary text-sm flex items-center gap-2">
                    <Fuel size={16} />
                    საწვავი
                  </p>
                  <p className="text-xl font-bold">{car.fuelType}</p>
                </div>
              )}

              {car.transmission && (
                <div className="bg-surface-1 rounded-lg p-4">
                  <p className="text-text-secondary text-sm flex items-center gap-2">
                    <Settings size={16} />
                    გადაცემათა კოლოფი
                  </p>
                  <p className="text-xl font-bold">{car.transmission}</p>
                </div>
              )}

              {car.driveType && (
                <div className="bg-surface-1 rounded-lg p-4">
                  <p className="text-text-secondary text-sm">წამყვანი</p>
                  <p className="text-xl font-bold">{car.driveType}</p>
                </div>
              )}

              {car.mileage !== null && car.mileage !== undefined && (
                <div className="bg-surface-1 rounded-lg p-4">
                  <p className="text-text-secondary text-sm">გარბენი</p>
                  <p className="text-xl font-bold">
                    {car.mileage.toLocaleString()} კმ
                  </p>
                </div>
              )}

              {car.location && (
                <div className="bg-surface-1 rounded-lg p-4 col-span-2">
                  <p className="text-text-secondary text-sm flex items-center gap-2">
                    <MapPin size={16} />
                    ადგილმდებარეობა
                  </p>
                  <p className="text-xl font-bold">{car.location}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {car.description && (
              <div className="bg-surface-1 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">აღწერა</h3>
                <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {car.description}
                </p>
              </div>
            )}

            {/* Created Date */}
            <div className="text-sm text-text-secondary flex items-center gap-2">
              <Calendar size={16} />
              დამატებულია: {new Date(car.createdAt).toLocaleDateString("ka-GE")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
