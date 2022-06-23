const { withSentryConfig } = require("@sentry/nextjs");
const withPlugins = require("next-compose-plugins");

const SentryWebpackPluginOptions = {
  silent: false,
};

const plugins = [
  nextConfig => {
    if (process.env.VERCEL_ENV === "production") {
      return withSentryConfig(nextConfig, SentryWebpackPluginOptions);
    }
    return {};
  },
];

/**
 * @type {import('next').NextConfig}
 */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  publicRuntimeConfig: {
    env: process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

module.exports = withPlugins(plugins, config);
