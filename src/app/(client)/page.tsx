import Link from 'next/link';

import { Cpu, Database, Shield, Zap } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shadcn-ui';

import GoogleAuthButton from '@components/auth/GoogleAuthButton';
import { Button } from '@components/common/Buttons';
import { HeroCTAButtons, NavButtons } from '@components/common/ConditionalButtons';
import { LogoMark, LogoWordmark } from '@components/layout/Logo';

/**
 * LangRoute landing page - the main entry point for the application.
 * Showcases the core value proposition as a self-hostable LLM gateway
 * and provides clear paths to authentication and dashboard.
 */
export default function HomePage() {
	return (
		<div className='from-background via-background to-muted/20 flex min-h-screen flex-col bg-gradient-to-br'>
			{/* Header */}
			<header className='container mx-auto flex items-center justify-between px-6 py-8'>
				<div className='flex items-center space-x-2'>
					<LogoMark className='bg-primary/10 text-primary-foreground h-12 w-12 rounded-lg' />
					<LogoWordmark className='text-xl font-semibold' />
				</div>

				<nav className='flex items-center space-x-4'>
					<GoogleAuthButton />
					<NavButtons />
					<Button asChild>
						<Link href='/register'>Get Started</Link>
					</Button>
				</nav>
			</header>

			{/* Hero Section */}
			<main className='container mx-auto flex-1 px-6 py-16'>
				<div className='mx-auto max-w-6xl text-center'>
					<h2 className='text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-6xl'>
						Self-hostable{' '}
						<span className='from-primary to-chart-1 bg-gradient-to-r bg-clip-text text-transparent'>
							LLM Gateway
						</span>
					</h2>

					<p className='text-muted-foreground mb-8 text-lg sm:text-xl'>
						Open-source LLM proxy that mimics the OpenAI API while routing traffic to multiple
						providers.
						<br />
						Deploy anywhere, control everything.
					</p>

					<div className='mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row'>
						<HeroCTAButtons />
					</div>

					{/* Features Grid */}
					<div className='grid gap-8 py-5 sm:grid-cols-2 lg:grid-cols-4'>
						<Card className='gap-0 border-0 bg-transparent text-center shadow-none'>
							<CardHeader className='px-0 pb-4'>
								<div className='bg-primary/10 text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
									<Shield className='h-6 w-6' />
								</div>
								<CardTitle className='text-lg'>Self-Hosted</CardTitle>
							</CardHeader>
							<CardContent className='px-0'>
								<CardDescription className='text-base'>
									Deploy on your infrastructure. Full control over your data and API keys.
								</CardDescription>
							</CardContent>
						</Card>

						<Card className='gap-0 border-0 bg-transparent text-center shadow-none'>
							<CardHeader className='px-0 pb-4'>
								<div className='bg-chart-1/10 text-chart-1 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
									<Zap className='h-6 w-6' />
								</div>
								<CardTitle className='text-lg'>OpenAI Compatible</CardTitle>
							</CardHeader>
							<CardContent className='px-0'>
								<CardDescription className='text-base'>
									Drop-in replacement for OpenAI API. No code changes required.
								</CardDescription>
							</CardContent>
						</Card>

						<Card className='gap-0 border-0 bg-transparent text-center shadow-none'>
							<CardHeader className='px-0 pb-4'>
								<div className='bg-chart-2/10 text-chart-2 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
									<Database className='h-6 w-6' />
								</div>
								<CardTitle className='text-lg'>Multi-Provider</CardTitle>
							</CardHeader>
							<CardContent className='px-0'>
								<CardDescription className='text-base'>
									Route to Google, OpenAI, Anthropic, Mistral, and more.
								</CardDescription>
							</CardContent>
						</Card>

						<Card className='gap-0 border-0 bg-transparent text-center shadow-none'>
							<CardHeader className='px-0 pb-4'>
								<div className='bg-chart-3/10 text-chart-3 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
									<Cpu className='h-6 w-6' />
								</div>
								<CardTitle className='text-lg'>Real-time Analytics</CardTitle>
							</CardHeader>
							<CardContent className='px-0'>
								<CardDescription className='text-base'>
									Live logs, usage metrics, cost tracking, and performance monitoring.
								</CardDescription>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className='bg-muted/30 border-t'>
				<div className='container mx-auto flex flex-col items-center justify-between px-6 py-8 sm:flex-row'>
					<div className='flex items-center space-x-2'>
						<LogoMark className='bg-primary/10 text-primary-foreground h-10 w-10 rounded-lg' />
						<LogoWordmark className='text-sm font-medium' />
					</div>

					<div className='text-muted-foreground mt-4 flex items-center space-x-6 text-sm sm:mt-0'>
						<a
							href='https://github.com/bluewave-labs/langRoute'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-foreground'
						>
							GitHub
						</a>
						<a
							href='https://docs.langRoute.dev'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-foreground'
						>
							Documentation
						</a>
						<a
							href='mailto:support@langRoute.dev'
							className='hover:text-foreground'
						>
							Support
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
