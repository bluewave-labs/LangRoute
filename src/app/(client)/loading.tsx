export default function Loading() {
	return (
		<div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900'>
			<div className='flex flex-col items-center space-y-6 p-8'>
				{/* Main spinner with glow effect */}
				<div className='relative'>
					<div className='absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-900 to-blue-100 opacity-20 blur-xl'></div>
					<div className='from-primary aspect-square h-32 w-32 animate-spin rounded-full bg-gradient-to-bl to-blue-50 p-3 md:h-48 md:w-48 dark:to-blue-950'>
						<div className='h-full w-full rounded-full bg-slate-100 backdrop-blur-md dark:bg-slate-900'></div>
					</div>
				</div>

				{/* Loading text with gradient */}
				<div className='space-y-2 text-center'>
					<h2 className='from-primary bg-gradient-to-r to-slate-700 bg-clip-text text-xl font-semibold text-transparent dark:from-slate-100 dark:to-slate-300'>
						Loading LangRoute
					</h2>
					<p className='animate-pulse text-sm text-slate-600 dark:text-slate-400'>
						Setting up your dashboard...
					</p>
				</div>

				{/* Animated dots */}
				<div className='flex space-x-1'>
					<div className='bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]'></div>
					<div className='bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]'></div>
					<div className='bg-primary h-2 w-2 animate-bounce rounded-full'></div>
				</div>
			</div>
		</div>
	);
}
