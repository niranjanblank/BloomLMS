import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [

      {
        protocol: 'https',
        hostname:  "bmi1k3fdem.ufs.sh",
        port: '',
        pathname: '/**',
      },
    ]
  }
};

export default nextConfig;
