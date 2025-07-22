'use client';

import { usePathname } from 'next/navigation';

import { useIsMobile } from '@/hooks/use-mobile';
import pages from '@/lib/pages';

const Header = () => {
	const pathname = usePathname();
	const currPage = pages.find(({ href }) => href === pathname);
	const isMobile = useIsMobile();

	if (isMobile) return null;

	if (pathname === '/') return null;

	if (!currPage) return null;

	return (
		<header className='border-b border-[#EAEAEA] pt-6 pb-4 pl-14'>
			<h1 className='text-sm font-semibold text-gray-800'>{currPage.text}</h1>
		</header>
	);
};

export default Header;
