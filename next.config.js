/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["files.edgestore.dev", "localhost", "127.0.0.1"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
      },
      {
        protocol: "https",
        hostname: "**.edgestore.dev",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@auth/prisma-adapter"],
    optimizeCss: false,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        utf8: "utf8",
        jose: "jose",
      });
    }
    return config;
  },
  // تعطيل static optimization للـ API routes
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
