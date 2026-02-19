import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack(config) {
    config.resolve.alias["@"] = join(__dirname);
    return config;
  },
};

export default nextConfig;
