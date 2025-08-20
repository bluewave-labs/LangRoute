'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarRail,
	SidebarTrigger,
	Sidebar as UISidebar,
} from '@shadcn-ui';

import { GoogleAuthButton, NavButton, ThemeToggle } from '@components';

import { NAV_ITEMS } from '@lib/config/nav';

import { LogoMark, LogoWordmark } from './Logo';

function MobileHeader() {
	const pathname = usePathname();
	const current = NAV_ITEMS.find((i) => pathname === i.href || pathname?.startsWith(i.href + '/'));
	return (
		<SidebarHeader className='flex w-full flex-row items-center justify-between md:hidden'>
			<p className='text-foreground text-base font-semibold'>
				{current?.label ?? (
					<>
						<strong>LANG</strong>ROUTE
					</>
				)}
			</p>
			<div className='flex items-center gap-2'>
				<ThemeToggle />
				<SidebarTrigger />
			</div>
		</SidebarHeader>
	);
}

export default function Sidebar() {
	const pathname = usePathname();

	return (
		// Responsive width override:
		// - base/desktop: 18rem (was 16rem)
		// - xl screens: 20rem
		// - 2xl screens: 22rem

		<UISidebar
			className='[--sidebar-width-icon:3.75rem] [--sidebar-width:12rem] xl:[--sidebar-width:15rem] 2xl:[--sidebar-width:18rem]'
			collapsible='icon'
			header={<MobileHeader />}
		>
			{/* Desktop header (logo / brand) */}

			<SidebarHeader className='hidden w-full flex-row items-center justify-between px-3 group-data-[collapsible=icon]:hidden md:flex xl:px-4'>
				<div className='flex items-center gap-3 xl:gap-4'>
					<LogoMark
						className='text-muted-foreground h-9 w-9 xl:h-10 xl:w-10'
						aria-hidden
					/>
					<LogoWordmark className='ml-1 text-[15px] font-semibold xl:text-base' />
				</div>
				<ThemeToggle />
			</SidebarHeader>

			{/* Compact brand bar — shows only in icon mode */}
			<SidebarHeader className='hidden items-center justify-center px-2 py-2 group-data-[collapsible=icon]:flex'>
				{/* Slightly larger than nav icons, fits inside the rail */}
				<LogoMark
					className='text-muted-foreground h-8 w-8'
					aria-hidden
				/>
			</SidebarHeader>

			{/* Nav */}
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{NAV_ITEMS.map((item) => {
							const Icon = item.icon;
							const active = pathname === item.href || pathname?.startsWith(item.href + '/');

							return (
								<SidebarMenuItem key={item.href}>
									<NavButton
										asChild
										isActive={!!active}
										size='default'
										className='w-full justify-start gap-2.5 md:h-9 md:text-[15px] xl:h-10 xl:gap-3 xl:text-base'
									>
										<Link
											href={item.href}
											className='no-underline decoration-transparent hover:no-underline'
										>
											<Icon
												className='h-5 w-5 md:h-6 md:w-6 xl:h-7 xl:w-7'
												aria-hidden
											/>
											{/* Hide text label in icon-collapsed mode */}
											<span className='truncate group-data-[collapsible=icon]:hidden'>
												{item.label}
											</span>
										</Link>
									</NavButton>
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			{/* Footer / account menu */}
			<SidebarFooter className='group-data-[collapsible=icon]:hidden'>
				<SidebarMenu>
					<SidebarMenuItem>
						<GoogleAuthButton variant='sidebar' />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</UISidebar>
	);
}
