import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/"],
        disallow: ["/settings/", "/messages/"],
      },
    ],
    sitemap: "https://arvi.ge/sitemap.xml",
  };
}
