import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const baseConfig = defineCloudflareConfig({});

export default {
  ...baseConfig,
  edgeExternals: [
    "node:crypto",
    "@libsql/isomorphic-ws",
    "pg-cloudflare",
    "@libsql/client",
    "@libsql/hrana-client",
  ],
};
