/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  reactStrictMode: true,
  server: {
    host: "localhost",
    port: 3000,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });

    config.ignoreWarnings = [
      // https://webpack.js.org/configuration/other-options/#ignorewarnings
      {
        module: /node-fetch/,
        message: /.*Can't resolve 'encoding'.*/,
      },
    ];

    return config;
  },
};

export default nextConfig;
