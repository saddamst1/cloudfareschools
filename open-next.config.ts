import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const baseConfig = defineCloudflareConfig({});

export default {
  ...baseConfig,
  buildCommand: "npx next build",
};
