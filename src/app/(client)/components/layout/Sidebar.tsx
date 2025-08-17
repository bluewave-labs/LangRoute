'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarTrigger,
	Sidebar as UISidebar,
} from '@shadcn-ui';

import { GoogleAuthButton, ThemeToggle } from '@components';

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
			className='[--sidebar-width:12rem] xl:[--sidebar-width:15rem] 2xl:[--sidebar-width:18rem]'
			collapsible='icon'
			header={<MobileHeader />}
		>
			{/* Desktop header (logo / brand) */}
			<SidebarHeader className='hidden w-full flex-row items-center justify-between px-3 md:flex xl:px-4'>
				<div className='flex items-center gap-3 xl:gap-4'>
					<LogoMark
						className='text-muted-foreground h-9 w-9 xl:h-10 xl:w-10'
						aria-hidden
					/>
					<LogoWordmark className='ml-1 text-[15px] font-semibold xl:text-base' />
				</div>
				<ThemeToggle />
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
									<SidebarMenuButton
										asChild
										isActive={!!active}
										aria-current={active ? 'page' : undefined}
										className='md:h-9 md:text-[15px] xl:h-10 xl:text-base'
									>
										<Link
											href={item.href}
											className='gap-2.5 no-underline decoration-transparent hover:no-underline xl:gap-3'
										>
											<Icon
												className='h-5 w-5 md:h-6 md:w-6 xl:h-7 xl:w-7'
												aria-hidden
											/>
											<span className='truncate'>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			{/* Footer / account menu */}
			<SidebarFooter>
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
