import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Standalone bundles the server and its dependencies into .next/standalone,
	// which is what a Docker runner stage would copy. Matches catch-the-craft.
	output: "standalone",
};

export default nextConfig;
