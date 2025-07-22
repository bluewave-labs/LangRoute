import { Button, FormInput, Label, Select, Separator } from '@/components';
import {
	SelectContent,
	SelectGroup,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function KeyCreateModal() {
	return (
		<>
			<SheetHeader className='pb-0'>
				<SheetTitle>Create virtual key</SheetTitle>
			</SheetHeader>

			<Separator />

			<form className='flex h-full flex-col'>
				<div className='grid flex-1 auto-rows-min gap-10 px-4'>
					{/* Key Info */}
					<div className='grid gap-5'>
						<div>
							<h3 className='h3'>Key details</h3>
							<p className='body2'>
								Assign an alias and description to help organise keys across projects and
								environments.
							</p>
						</div>
						<FormInput
							label='Name of the key'
							name='alias'
							placeHolder='Alias'
						/>
						<FormInput
							label='Description'
							name='description'
							placeHolder='A short description of the virtual key'
						/>
					</div>

					{/* AI Provider Info */}
					<div className='grid gap-5'>
						<div>
							<h3 className='h3'>AI provider settings</h3>
							<p className='body2'>Add the credentials for your preferred AI provider.</p>
						</div>
						<div className='grid gap-2'>
							<Label>AI provider</Label>
							<Select>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Select an AI provider' />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>AI providers</SelectLabel>
										{/* <SelectItem value=''></SelectItem> */}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div className='grid gap-2'>
							<Label>API key of the provider</Label>
							<Select>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Select an API key' />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>API keys</SelectLabel>
										{/* <SelectItem value=''></SelectItem> */}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<SheetFooter>
					<Button type='submit'>Generate</Button>
				</SheetFooter>
			</form>
		</>
	);
}
