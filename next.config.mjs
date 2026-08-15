/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['0.0.0.0', 'localhost', '127.0.0.1'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
