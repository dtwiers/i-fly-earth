import React, { useEffect, useState } from 'react'
import Page from '@/components/page'

const Index = () => {
	const [location, setLocation] = useState<GeolocationPosition | null>(null)
	useEffect(() => {
	if (typeof window !== 'undefined' && 'geolocation' in navigator) {
		const interval = setInterval(() => navigator.geolocation.getCurrentPosition(setLocation), 1000);
		return () => clearInterval(interval);
	}
}, []);
	return (
		<Page>
			<section className='mt-20'>
				<h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
					We grow a lot of rice.
				</h2>

				<p className='mt-2 text-gray-600 dark:text-gray-400'>
					latitude: {location?.coords?.latitude}
				</p>
				<p className='mt-2 text-gray-600 dark:text-gray-400'>
					longitude: {location?.coords?.longitude}
				</p>
				<p className='mt-2 text-gray-600 dark:text-gray-400'>
					altitude: {location?.coords?.altitude}
				</p>
				<p className='mt-2 text-gray-600 dark:text-gray-400'>
					speed: {location?.coords?.speed}
				</p>
			</section>
		</Page>
	)
}

export default Index
