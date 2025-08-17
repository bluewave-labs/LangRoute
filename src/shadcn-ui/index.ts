// Badge
export { Badge, badgeVariants } from './badge';

// Button
export { Button, buttonVariants } from './button';

// Card
export {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './card';

// Command
export {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from './command';

// Dialog
export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from './dialog';

// Input
export { Input } from './input';

// Label
export { Label } from './label';

// Multiple Selector
export { default as MultipleSelector } from './multiple-selector';
export type { Option, MultipleSelectorRef } from './multiple-selector';
export { useDebounce } from './multiple-selector';

// Select
export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from './select';

// Separator
export { Separator } from './separator';

// Sheet
export {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from './sheet';

// Table
export {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from './table';

// Tabs
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

// Form
export {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useFormField,
} from './form';

// Progress
export { Progress } from './progress';

// Switch
export { Switch } from './switch';

// Tooltip
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
export {
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
	SidebarProvider,
} from './sidebar';

export { Avatar, AvatarFallback, AvatarImage } from './avatar';

// src/shadcn-ui/index.ts  (add these lines)
export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuGroup,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuShortcut,
} from './dropdown-menu';
