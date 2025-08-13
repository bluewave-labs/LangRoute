'use client';

import { useRouter } from 'next/navigation';

/**
 * Custom hook for dashboard-related functionality
 */
export default function useDashboard() {
	const router = useRouter();

	const navigateToModels = () => {
		router.push('/models');
	};

	const navigateToAnalytics = () => {
		router.push('/analytics');
	};

	const navigateToLogs = () => {
		router.push('/logs');
	};

	const navigateToKeyManagement = () => {
		router.push('/key-management');
	};

	return {
		navigateToModels,
		navigateToAnalytics,
		navigateToLogs,
		navigateToKeyManagement,
	};
}
