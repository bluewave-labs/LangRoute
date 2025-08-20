'use client';

import { useState } from 'react';

import { ButtonGroup, ButtonGroupItem } from '@components';

export default function LogsPage() {
	const [logLevel, setLogLevel] = useState('all');
	const [timeRange, setTimeRange] = useState('1h');

	return (
		<>
			<div className='px-20 py-10'>
				<div className='mb-6 space-y-4'>
					<div className='flex items-center gap-4'>
						<span className='text-foreground text-sm font-medium'>Log Level:</span>
						<ButtonGroup
							value={logLevel}
							onValueChange={setLogLevel}
							aria-label='Filter by log level'
						>
							<ButtonGroupItem value='all'>All</ButtonGroupItem>
							<ButtonGroupItem value='error'>Error</ButtonGroupItem>
							<ButtonGroupItem value='warn'>Warn</ButtonGroupItem>
							<ButtonGroupItem value='info'>Info</ButtonGroupItem>
						</ButtonGroup>
					</div>

					<div className='flex items-center gap-4'>
						<span className='text-foreground text-sm font-medium'>Time Range:</span>
						<ButtonGroup
							value={timeRange}
							onValueChange={setTimeRange}
							aria-label='Select time range'
						>
							<ButtonGroupItem value='15m'>15m</ButtonGroupItem>
							<ButtonGroupItem value='1h'>1h</ButtonGroupItem>
							<ButtonGroupItem value='6h'>6h</ButtonGroupItem>
							<ButtonGroupItem value='24h'>24h</ButtonGroupItem>
						</ButtonGroup>
					</div>
				</div>

				<div className='flex h-64 items-center justify-center rounded-lg border border-dashed'>
					<div className='text-center'>
						<p className='text-muted-foreground mb-2'>Logs dashboard coming soon...</p>
						<p className='text-muted-foreground text-sm'>
							Current filters: {logLevel} level, last {timeRange}
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
