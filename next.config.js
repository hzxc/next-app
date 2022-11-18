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
  // async headers() {
  //   return [
  //     {
  //       source: '/binance/:path*',
  //       headers: [
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'origin-when-cross-origin',
  //         },
  //       ],
  //     },
  //   ];
  // },

  async rewrites() {
    // beforeFiles: [
    //   // These rewrites are checked after headers/redirects
    //   // and before all files including _next/public files which
    //   // allows overriding page files
    //   {
    //     source: '/some-page',
    //     destination: '/somewhere-else',
    //     has: [{ type: 'query', key: 'overrideMe' }],
    //   },
    // ],
    // afterFiles: [
    //   // These rewrites are checked after pages/public files
    //   // are checked but before dynamic routes
    //   {
    //     source: '/non-existent',
    //     destination: '/somewhere-else',
    //   },
    // ],
    return [
      // These rewrites are checked after both pages/public files
      // and dynamic routes are checked
      {
        source: '/binance/:path*',
        destination: `https://api.binance.com/:path*`,
      },
      {
        source: '/pancake/:path*',
        destination: 'https://tokens.pancakeswap.finance/:path*',
      },
      {
        source: '/gstatic/:path*',
        destination: 'http://www.gstatic.com/:path*',
      },
      {
        source: '/mexc/:path*',
        destination: 'https://api.mexc.com/:path*',
      },
    ];
  },

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
