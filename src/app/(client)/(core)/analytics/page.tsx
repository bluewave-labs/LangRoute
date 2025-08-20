'use client';

import { useState } from 'react';

import { ButtonGroup, ButtonGroupItem } from '@components';

export default function AnalyticsPage() {
	const [timePeriod, setTimePeriod] = useState('week');
	const [chartType, setChartType] = useState('line');

	return (
		<>
			<div className='px-20 py-10'>
				<div className='mb-6 space-y-4'>
					<div className='flex items-center gap-4'>
						<span className='text-foreground text-sm font-medium'>Time Period:</span>
						<ButtonGroup
							value={timePeriod}
							onValueChange={setTimePeriod}
							aria-label='Select time period'
						>
							<ButtonGroupItem value='day'>Day</ButtonGroupItem>
							<ButtonGroupItem value='week'>Week</ButtonGroupItem>
							<ButtonGroupItem value='month'>Month</ButtonGroupItem>
							<ButtonGroupItem value='year'>Year</ButtonGroupItem>
						</ButtonGroup>
					</div>

					<div className='flex items-center gap-4'>
						<span className='text-foreground text-sm font-medium'>Chart Type:</span>
						<ButtonGroup
							value={chartType}
							onValueChange={setChartType}
							aria-label='Select chart type'
						>
							<ButtonGroupItem value='line'>Line</ButtonGroupItem>
							<ButtonGroupItem value='bar'>Bar</ButtonGroupItem>
							<ButtonGroupItem value='area'>Area</ButtonGroupItem>
						</ButtonGroup>
					</div>
				</div>

				<div className='flex h-64 items-center justify-center rounded-lg border border-dashed'>
					<div className='text-center'>
						<p className='text-muted-foreground mb-2'>Analytics dashboard coming soon...</p>
						<p className='text-muted-foreground text-sm'>
							Current selection: {timePeriod} view, {chartType} chart
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
