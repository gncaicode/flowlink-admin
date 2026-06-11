/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mysql2", "bcryptjs"],
  },
};

export default nextConfig;
