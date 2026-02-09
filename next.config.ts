import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["www.bmwgroup-classic.com", "res.cloudinary.com"],
  },
  output: "standalone",
};

export default nextConfig;
