'use client';

import {
	BookOpen,
	ChartLine,
	ChevronsUpDown,
	KeyRound,
	SlidersHorizontal,
	SquareTerminal,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import logoLight from '@/assets/images/logo-light.svg';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarTrigger,
} from '../ui/sidebar';

const items = [
	{
		icon: SquareTerminal,
		text: 'Dashboard',
		href: '/',
	},
	{
		icon: ChartLine,
		text: 'Analytics',
		href: '/analytics',
	},
	{
		icon: BookOpen,
		text: 'Logs',
		href: '/logs',
	},
	{
		icon: SlidersHorizontal,
		text: 'Settings',
		href: '/settings',
	},
	{
		icon: KeyRound,
		text: 'Key management',
		href: '/keys',
	},
];

const MobileHeader = () => {
	const pathname = usePathname();
	const item = items.find(({ href }) => href === pathname);
	return (
		<SidebarHeader className='w-full flex-row items-center justify-between shadow-sm md:shadow-none'>
			<div className='flex w-full items-center gap-2'>
				<p className='text-foreground font-semibold'>
					{item?.text ?? (
						<>
							<strong className='text-foreground'>LANG</strong>ROUTE
						</>
					)}
				</p>
			</div>
			<SidebarTrigger className='text-foreground' />
		</SidebarHeader>
	);
};

const AppSidebar = () => {
	const pathname = usePathname();
	return (
		<Sidebar
			collapsible='icon'
			header={<MobileHeader />}
		>
			<SidebarHeader className='w-full flex-row items-center justify-between'>
				<div className='flex w-full items-center gap-2'>
					<Image
						src={logoLight}
						alt='LangRoute'
						width={32}
						height={32}
					/>
					<p className='font-semibold text-[#A4A4A4]'>
						<strong className='text-foreground'>LANG</strong>ROUTE
					</p>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{items.map((item) => (
							<SidebarMenuItem key={item.text}>
								<SidebarMenuButton
									asChild
									isActive={pathname === item.href}
								>
									<Link href={item.href}>
										<item.icon />
										<span>{item.text}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton className='justify-between'>
							<Avatar className='rounded-md'>
								<AvatarImage src='https://github.com/shadcn.png' />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className='grow'>
								<h2 className='text-secondary-foreground text-sm font-semibold'>John doe</h2>
								<p className='text-foreground text-xs'>john.doe@email.com</p>
							</div>
							<ChevronsUpDown />
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
};

export default AppSidebar;
