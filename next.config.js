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

  // async rewrites() {
  //   return [
  //     {
  //       source: '/binance/:path*',
  //       destination: `https://api.binance.com/:path*`,
  //     },
  //     {
  //       source: '/pancake/:path*',
  //       destination: 'https://tokens.pancakeswap.finance/:path*',
  //     },
  //     {
  //       source: '/gstatic/:path*',
  //       destination: 'http://www.gstatic.com/:path*',
  //     },
  //     {
  //       source: '/mexc/:path*',
  //       destination: 'https://api.mexc.com/:path*',
  //     },
  //   ];
  // },

  // async rewrites() {
  //   return [
  //     {
  //       source: '/exApi/pancake/:path*',
  //       destination: 'https://tokens.pancakeswap.finance/:path*',
  //     },
  //     {
  //       source: '/exApi/gstatic/:path*',
  //       destination: 'http://www.gstatic.com/:path*',
  //     },
  //     {
  //       source: '/exApi/binance/:path*',
  //       destination: 'https://api.binance.com/:path*',
  //     },
  //     {
  //       source: '/exApi/mexc/:path*',
  //       destination: 'https://api.mexc.com/:path*',
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
