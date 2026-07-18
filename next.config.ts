/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  transpilePackages: ["@chakra-ui/react", "@ark-ui/react"],
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;