import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  allowedDevOrigins: [
    "3000-cs-341c4021-fc79-47fb-955d-acfa9075dcc0.cs-asia-east1-vger.cloudshell.dev",
    "8080-cs-341c4021-fc79-47fb-955d-acfa9075dcc0.cs-asia-east1-vger.cloudshell.dev",
  ],
};

export default nextConfig;
