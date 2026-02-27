import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // images: {
  //   domains: ["www.bmwgroup-classic.com", "res.cloudinary.com"],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.bmwgroup-classic.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
