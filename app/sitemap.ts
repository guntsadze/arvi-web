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

  // ✅ Cars
  let carRoutes: MetadataRoute.Sitemap = [];
  try {
    const carsRes = await fetch("https://api.arvi.ge/cars/trending?limit=500", {
      next: { revalidate: 3600 },
    });
    if (carsRes.ok) {
      const carsJson = await carsRes.json();
      const cars = Array.isArray(carsJson) ? carsJson : (carsJson.data ?? []);
      carRoutes = cars.map((car: any) => ({
        url: `https://arvi.ge/cars/${car.id}`,
        lastModified: new Date(car.updatedAt ?? car.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (e) {
    console.error("sitemap: cars fetch failed", e);
  }

  // ✅ Users
  let userRoutes: MetadataRoute.Sitemap = [];
  try {
    const usersRes = await fetch("https://api.arvi.ge/Users?page=1&limit=500", {
      next: { revalidate: 3600 },
    });
    if (usersRes.ok) {
      const usersJson = await usersRes.json();
      const users = Array.isArray(usersJson)
        ? usersJson
        : (usersJson.data ?? []);
      userRoutes = users.map((user: any) => ({
        url: `https://arvi.ge/user/${user.username}`,
        lastModified: new Date(user.updatedAt ?? user.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (e) {
    console.error("sitemap: users fetch failed", e);
  }

  // ✅ Marketplace
  let marketRoutes: MetadataRoute.Sitemap = [];
  try {
    const marketRes = await fetch(
      "https://api.arvi.ge/marketplace/featured?limit=500",
      {
        next: { revalidate: 3600 },
      },
    );
    if (marketRes.ok) {
      const marketJson = await marketRes.json();
      const listings = Array.isArray(marketJson)
        ? marketJson
        : (marketJson.data ?? []);
      marketRoutes = listings.map((listing: any) => ({
        url: `https://arvi.ge/marketplace/${listing.id}`,
        lastModified: new Date(listing.updatedAt ?? listing.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (e) {
    console.error("sitemap: marketplace fetch failed", e);
  }

  return [...staticRoutes, ...carRoutes, ...userRoutes, ...marketRoutes];
}
