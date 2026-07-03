import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Membatasi root pencarian Turbopack hanya di dalam folder frontend
    root: __dirname,
  },
};

export default nextConfig;
