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
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
};

export default nextConfig;
