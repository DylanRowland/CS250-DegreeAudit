import type { NextConfig } from "next";

// Local Python server location
const BACKEND_ORIGIN = "http://127.0.0.1:8000";
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // API call so frontend and backend can communicate
        source: "/api/v1/:path*",
        destination: `${BACKEND_ORIGIN}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
