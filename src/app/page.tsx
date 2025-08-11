import { ArrowRight, Cpu, Database, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

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
					<div className='bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg'>
						<Cpu className='h-5 w-5' />
					</div>
					<h1 className='text-xl font-semibold'>LangRoute</h1>
				</div>

				<nav className='flex items-center space-x-4'>
					<GoogleSignInButton />
					<Link
						href='/login'
						className='body1 hover:text-primary'
					>
						Sign In
					</Link>
					<Link
						href='/register'
						className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors'
					>
						Get Started
					</Link>
				</nav>
			</header>

			{/* Hero Section */}
			<main className='container mx-auto flex-1 px-6 py-16'>
				<div className='mx-auto max-w-4xl text-center'>
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
						<Link
							href='/register'
							className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-6 py-3 text-base font-medium transition-colors'
						>
							Start Free Trial
							<ArrowRight className='ml-2 h-4 w-4' />
						</Link>
						<Link
							href='/login'
							className='border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center rounded-md border px-6 py-3 text-base font-medium transition-colors'
						>
							Sign In to Dashboard
						</Link>
					</div>

					{/* Features Grid */}
					<div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
						<div className='flex flex-col items-center text-center'>
							<div className='bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
								<Shield className='h-6 w-6' />
							</div>
							<h3 className='h3 mb-2'>Self-Hosted</h3>
							<p className='body2'>
								Deploy on your infrastructure. Full control over your data and API keys.
							</p>
						</div>

						<div className='flex flex-col items-center text-center'>
							<div className='bg-chart-1/10 text-chart-1 mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
								<Zap className='h-6 w-6' />
							</div>
							<h3 className='h3 mb-2'>OpenAI Compatible</h3>
							<p className='body2'>Drop-in replacement for OpenAI API. No code changes required.</p>
						</div>

						<div className='flex flex-col items-center text-center'>
							<div className='bg-chart-2/10 text-chart-2 mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
								<Database className='h-6 w-6' />
							</div>
							<h3 className='h3 mb-2'>Multi-Provider</h3>
							<p className='body2'>Route to OpenAI, Anthropic, Mistral, Azure OpenAI, and more.</p>
						</div>

						<div className='flex flex-col items-center text-center'>
							<div className='bg-chart-3/10 text-chart-3 mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
								<Cpu className='h-6 w-6' />
							</div>
							<h3 className='h3 mb-2'>Real-time Analytics</h3>
							<p className='body2'>
								Live logs, usage metrics, cost tracking, and performance monitoring.
							</p>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className='bg-muted/30 border-t'>
				<div className='container mx-auto flex flex-col items-center justify-between px-6 py-8 sm:flex-row'>
					<div className='flex items-center space-x-2'>
						<div className='bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded'>
							<Cpu className='h-4 w-4' />
						</div>
						<span className='text-sm font-medium'>LangRoute</span>
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
