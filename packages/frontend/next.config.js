/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
      },
      {
        protocol: "https",
        hostname: "**.pinsave.app",
      },
      {
        protocol: "https",
        hostname: "gold-accurate-leopard-8.mypinata.cloud",
      },
    ],
    minimumCacheTTL: 31536000,
    unoptimized: true,
  },
};

export default nextConfig;
