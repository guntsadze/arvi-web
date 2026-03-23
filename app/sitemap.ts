import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: "https://arvi.ge",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://arvi.ge/cars",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: "https://arvi.ge/marketplace",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: "https://arvi.ge/groups",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://arvi.ge/events",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // ✅ Cars — /cars/trending public endpoint
  const carsRes = await fetch("https://api.arvi.ge/cars/trending?limit=500")
    .then((res) => res.json())
    .catch(() => []);
  const cars = Array.isArray(carsRes) ? carsRes : (carsRes.data ?? []);
  const carRoutes: MetadataRoute.Sitemap = cars.map((car: any) => ({
    url: `https://arvi.ge/cars/${car.id}`,
    lastModified: new Date(car.updatedAt ?? car.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // ✅ Users — /Users public endpoint
  // ⚠️ შენი controller-ი /Users-ია დიდი U-თი!
  const usersRes = await fetch("https://api.arvi.ge/Users?page=1&limit=500")
    .then((res) => res.json())
    .catch(() => []);
  const users = Array.isArray(usersRes) ? usersRes : (usersRes.data ?? []);
  const userRoutes: MetadataRoute.Sitemap = users.map((user: any) => ({
    url: `https://arvi.ge/user/${user.username}`,
    lastModified: new Date(user.updatedAt ?? user.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // ✅ Marketplace — /marketplace/featured public endpoint
  const marketRes = await fetch(
    "https://api.arvi.ge/marketplace/featured?limit=500",
  )
    .then((res) => res.json())
    .catch(() => []);
  const listings = Array.isArray(marketRes)
    ? marketRes
    : (marketRes.data ?? []);
  const marketRoutes: MetadataRoute.Sitemap = listings.map((listing: any) => ({
    url: `https://arvi.ge/marketplace/${listing.id}`,
    lastModified: new Date(listing.updatedAt ?? listing.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...carRoutes, ...userRoutes, ...marketRoutes];
}
