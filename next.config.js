/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io']
  },
  productionBrowserSourceMaps: true,
  output: "standalone",
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
