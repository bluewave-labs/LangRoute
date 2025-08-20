'use client';

import { useEffect, useState } from 'react';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
	const { theme, setTheme, systemTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	if (!mounted) {
		return (
			<button
				type='button'
				aria-label='Toggle theme'
				title='Toggle theme'
				className='border-border text-muted-foreground inline-flex h-8 w-8 items-center justify-center rounded-md border'
			/>
		);
	}

	const resolved = theme === 'system' ? systemTheme : theme;
	const next = resolved === 'dark' ? 'light' : 'dark';

	return (
		<button
			type='button'
			onClick={() => setTheme(next!)}
			aria-label='Toggle theme'
			title='Toggle theme'
			// rotate on state change; smooth hover; keep border tokens
			className={`border-border text-muted-foreground hover:text-foreground inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border`}
		>
			{/* Cross-fade icons */}
			<span className='relative inline-block h-4 w-4'>
				<Sun
					className={`absolute inset-0 h-4 w-4 transition-transform ${resolved === 'dark' ? 'rotate-180' : 'rotate-0'} transition-opacity duration-300 ${resolved === 'dark' ? 'opacity-100' : 'opacity-0'}`}
					aria-hidden
				/>
				<Moon
					className={`absolute inset-0 h-4 w-4 transition-transform duration-300 ${resolved === 'dark' ? 'rotate-180' : 'rotate-0'} transition-opacity ${resolved === 'dark' ? 'opacity-0' : 'opacity-100'}`}
					aria-hidden
				/>
			</span>
		</button>
	);
}
