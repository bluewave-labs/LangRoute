import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	// Turbopack configuration
	turbopack: {
		// Explicitly set resolve extensions to acknowledge turbopack configuration
		// This satisfies the "turbopack is configured" requirement
		resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '/**',
			},
		],
		formats: ['image/webp', 'image/avif'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
	webpack: (config, { isServer }) => {
		// Handle node: prefix for modules like node:crypto used by argon2
		if (isServer) {
			config.externals.push({
				argon2: 'commonjs argon2',
			});
		}

		return config;
	},
	// Ensure argon2 (native module) is treated as external package
	serverExternalPackages: ['argon2'],
};

export default nextConfig;
