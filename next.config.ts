import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["www.bmwgroup-classic.com", "res.cloudinary.com"],
  },
  output: "standalone",
  reactStrictMode: false,
};

export default nextConfig;
