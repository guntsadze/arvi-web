import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["www.bmwgroup-classic.com"],
  },
};

export default nextConfig;
