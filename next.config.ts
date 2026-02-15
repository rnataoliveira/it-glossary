import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/it-glossary",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
