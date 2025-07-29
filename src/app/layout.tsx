import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

import Providers from './providers';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: {
		default: 'LangRoute',
		template: '%s | LangRoute',
	},
	description:
		'Self-hostable, open-source LLM gateway that mimics the OpenAI API while routing traffic to multiple providers.',
	keywords: ['LLM', 'OpenAI', 'API Gateway', 'Self-hosted', 'Anthropic', 'Mistral', 'Azure OpenAI'],
	authors: [{ name: 'Bluewave Labs' }],
	creator: 'Bluewave Labs',
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://lang-route.vercel.app',
		title: 'LangRoute - Self-hostable LLM Gateway',
		description:
			'Open-source LLM gateway that mimics the OpenAI API while routing traffic to multiple providers.',
		siteName: 'LangRoute',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'LangRoute - Self-hostable LLM Gateway',
		description:
			'Open-source LLM gateway that mimics the OpenAI API while routing traffic to multiple providers.',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
};

/**
 * Root layout component for the LangRoute application.
 * Provides global font configuration and wraps the entire app with providers
 * for React Query, NextAuth, and react-hot-toast.
 *
 * @param children - The page content to be rendered within the layout
 */
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
		>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
