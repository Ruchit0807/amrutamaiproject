/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'https://amrutamaiproject-9.onrender.com'}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
