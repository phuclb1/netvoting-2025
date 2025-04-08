import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");

// validate env before build
import "./env";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["jotai-devtools"],
  experimental: {
    swcPlugins: [
      ["@swc-jotai/debug-label", {}],
      ["@swc-jotai/react-refresh", {}],
    ],
  },
};

export default withNextIntl(nextConfig);
