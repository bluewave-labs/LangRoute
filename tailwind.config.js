module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
			},
			fontFamily: {
				sans: 'var(--font-geist-sans)',
				mono: 'var(--font-geist-mono)',
			},
		},
	},
	plugins: [],
};
