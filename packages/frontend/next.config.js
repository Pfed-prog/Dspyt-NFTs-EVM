/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.nftstorage.link",
      },
      {
        protocol: "https",
        hostname: "**.pinsave.app",
      },
    ],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
