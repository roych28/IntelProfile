/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io']
  },
  productionBrowserSourceMaps: true,
  output: "standalone",
};

module.exports = nextConfig;
