import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/settings/", "/messages/"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/_next/static/"],
        disallow: ["/api/", "/auth/", "/settings/", "/messages/"],
      },
    ],
    sitemap: "https://arvi.ge/sitemap.xml",
    host: "https://arvi.ge",
  };
}
