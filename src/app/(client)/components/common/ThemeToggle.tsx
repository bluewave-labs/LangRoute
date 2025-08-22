'use client';

import { useEffect, useState } from 'react';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@components';

export default function ThemeToggle() {
	const { theme, setTheme, systemTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	if (!mounted) {
		return (
			<Button
				variant='ghost'
				size='icon'
				aria-label='Toggle theme'
				title='Toggle theme'
				disabled
			/>
		);
	}
	const resolved = theme === 'system' ? systemTheme : theme;
	const next = resolved === 'dark' ? 'light' : 'dark';

	{
		/* Cross-fade icons */
	}
	const toggle = (
		<span className='text-primary relative inline-block md:!h-4 md:!w-4 xl:!h-5.5 xl:!w-5.5'>
			<Sun
				className={`absolute inset-0 transition-transform md:!h-4 md:!w-4 xl:!h-5.5 xl:!w-5.5 ${resolved === 'dark' ? 'rotate-180' : 'rotate-0'} transition-opacity duration-300 ${resolved === 'dark' ? 'opacity-100' : 'opacity-0'}`}
				aria-hidden
			/>
			<Moon
				className={`absolute inset-0 transition-transform duration-300 md:!h-4 md:!w-4 xl:!h-5.5 xl:!w-5.5 ${resolved === 'dark' ? 'rotate-180' : 'rotate-0'} transition-opacity ${resolved === 'dark' ? 'opacity-0' : 'opacity-100'}`}
				aria-hidden
			/>
		</span>
	);

	return (
		<Button
			type='button'
			onClick={() => setTheme(next!)}
			variant='ghost'
			size='icon'
			startIcon={toggle}
			color='neutral'
			aria-label='Toggle theme'
			title='Toggle theme'
			className='mx-2 group-data-[collapsible=icon]:hidden'
		></Button>
	);
}
