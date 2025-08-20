'use client';

import { BarChart3, BookOpen, FileText, Rocket, Settings, UserPlus } from 'lucide-react';

import { SectionHeader } from '@components';

import ActionCard from './ActionCard';
import GetStartedCard from './GetStartedCard';

export default function DashboardContent() {
	return (
		<div className='mx-auto max-w-6xl space-y-8'>
			{/* Get Started Section */}
			<GetStartedCard
				title='Get started with LangRoute'
				description='Integrating LangRoute takes a few minutes and front end coding skills may be required. If you are not a developer, invite one of your coworkers to your team to help set things up.'
				icon={<Rocket className='h-5 w-5' />}
				actionLabel='Invite your team members'
				actionIcon={<UserPlus className='h-4 w-4' />}
			/>

			{/* Next Steps Section */}
			<div className='space-y-4'>
				<SectionHeader
					title='Next up...'
					icon={<span className='text-muted-foreground text-xs font-medium'>⚡</span>}
				/>

				{/* Cards Grid */}
				<div className='grid gap-6 sm:grid-cols-2'>
					<ActionCard
						title='Configure your LLM providers'
						description='LangRoute connects to several providers. Just add your API key for your provider and model, and connect via LangRoute.'
						actionLabel='Connect providers and models'
						actionIcon={<Settings className='h-4 w-4' />}
						href='/models'
						variant='default'
					/>

					<ActionCard
						title='Check your analytics'
						description='See how your API calls perform. See your overall cost, budget and check logs.'
						actionLabel='Go to analytics'
						actionIcon={<BarChart3 className='h-4 w-4' />}
						href='/analytics'
						variant='outline'
					/>

					<ActionCard
						title='View your logs'
						description='See your logs, broken down by user, time and cost. Get an understanding of the data sent to LLM providers, both internal and external.'
						actionLabel='View logs'
						actionIcon={<FileText className='h-4 w-4' />}
						href='/logs'
						variant='outline'
					/>

					<ActionCard
						title='Read our documentation'
						description='When you are in doubt, our documentation is the place you should check out first.'
						actionLabel='Go to documentation portal'
						actionIcon={<BookOpen className='h-4 w-4' />}
						href='/documentation'
						variant='outline'
						external
					/>
				</div>
			</div>
		</div>
	);
}
