module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				background: 'var(--color-background)',
				foreground: 'var(--color-foreground)',
				border: 'var(--color-border)',
			},
			borderRadius: {
				sm: 'var(--radius-sm)',
				md: 'var(--radius-md)',
				lg: 'var(--radius-lg)',
				xl: 'var(--radius-xl)',
			},
			fontFamily: {
				sans: 'var(--font-geist-sans)',
				mono: 'var(--font-geist-mono)',
			},
		},
	},
	plugins: [],
};
