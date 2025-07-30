import {
	BookOpen,
	Brain,
	ChartLine,
	KeyRound,
	SlidersHorizontal,
	SquareTerminal,
} from 'lucide-react';

const pages = [
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
	{
		icon: Brain,
		text: 'Models',
		href: '/models',
	},
];

export default pages;
