/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: [],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/pancake/:path*',
        destination: 'https://tokens.pancakeswap.finance/:path*',
      },
      {
        source: '/gstatic/:path*',
        destination: 'http://www.gstatic.com/:path*',
      },
      {
        source: '/binance/:path*',
        destination: 'https://api.binance.com/:path*',
      },
      {
        source: '/mexc/:path*',
        destination: 'https://api.mexc.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
