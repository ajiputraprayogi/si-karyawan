import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Membatasi root pencarian Turbopack hanya di dalam folder frontend
    root: __dirname,
  },
};

export default nextConfig;
