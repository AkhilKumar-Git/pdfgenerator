/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    responseLimit: "50mb",
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
