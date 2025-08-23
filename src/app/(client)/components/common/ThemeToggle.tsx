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
				iconOnly
				aria-label='Toggle theme'
				title='Toggle theme'
				disabled
			>
				<Moon className='size-6' />
			</Button>
		);
	}

	const resolved = theme === 'system' ? systemTheme : theme;
	const next = resolved === 'dark' ? 'light' : 'dark';

	// Choose one icon; keep it simple (lucide icons preferred)
	const Icon = resolved === 'dark' ? Sun : Moon;

	return (
		<Button
			type='button'
			onClick={() => setTheme(next!)}
			variant='ghost'
			size='icon'
			iconOnly
			aria-label='Toggle theme'
			title='Toggle theme'
			className='group-data-[collapsible=icon]:hidden'
		>
			<Icon className='size-6' />
		</Button>
	);
}
