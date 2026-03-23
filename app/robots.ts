import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/settings/", "/messages/", "/_next/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/auth/", "/settings/", "/messages/"],
      },
    ],
    sitemap: "https://arvi.ge/sitemap.xml",
    host: "https://arvi.ge",
  };
}
