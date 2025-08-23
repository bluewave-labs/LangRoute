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
		// Sidebar widths (custom properties):
		// - base: 14rem
		// - xl:   15rem
		// - 2xl:  16rem
		// Collapsed icon width: 4.2rem
		<UISidebar
			className='[--sidebar-width-icon:4rem] [--sidebar-width:14rem] xl:[--sidebar-width:15rem] 2xl:[--sidebar-width:16rem]'
			collapsible='icon'
			header={<MobileHeader />}
		>
			{/* Desktop header (logo / brand) */}
			<SidebarHeader className='hidden w-full flex-row items-center justify-between md:flex'>
				<div className='flex items-center gap-1 xl:gap-2'>
					<LogoMark
						className='h-10 w-10 rounded-lg xl:h-12 xl:w-12'
						aria-hidden
					/>
					<LogoWordmark className='ml-1 text-[15px] font-semibold group-data-[collapsible=icon]:hidden xl:text-base' />
				</div>
				<ThemeToggle />
			</SidebarHeader>

			{/* Nav */}
			<SidebarContent className='ml-0.5 pt-2'>
				<SidebarGroup>
					<SidebarMenu className='flex flex-col items-stretch gap-1.5'>
						{NAV_ITEMS.map((item) => {
							const Icon = item.icon;
							const active = pathname === item.href || pathname?.startsWith(item.href + '/');

							return (
								<SidebarMenuItem
									key={item.href}
									className='text-muted-foreground'
								>
									<SidebarMenuButton
										asChild
										isActive={!!active}
										aria-current={active ? 'page' : undefined}
										className='gap-2.5 md:h-9 md:text-sm xl:!h-10 xl:gap-3 xl:text-base group-data-[collapsible=icon]:xl:!size-10 [&>svg]:!size-6'
										tooltip={item.label}
									>
										<Link
											href={item.href}
											aria-label={item.label}
											className='no-underline decoration-transparent'
										>
											<Icon
												aria-hidden
												className='mr-2'
											/>
											<span className='truncate group-data-[collapsible=icon]:hidden'>
												{item.label}
											</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			{/* Footer / account menu */}
			<SidebarFooter className='m-2'>
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
