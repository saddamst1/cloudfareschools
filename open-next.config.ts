// open-next.config.ts — SchoolsPedia Cloudflare Pages configuration
// Uses defineCloudflareConfig() helper which sets all required fields automatically.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // No R2 incremental cache — relying on Cloudflare CDN edge caching via Cache-Control headers
  // For best results consider enabling R2 caching later:
  // https://opennext.js.org/cloudflare/caching
});
