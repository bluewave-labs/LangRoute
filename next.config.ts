import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '/**',
			},
		],
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
