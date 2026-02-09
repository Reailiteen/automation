import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@automation/auth",
    "@automation/data",
    "@automation/services",
    "@automation/types",
    "@automation/utils",
    "@automation/agents",
  ],
};

export default nextConfig;
