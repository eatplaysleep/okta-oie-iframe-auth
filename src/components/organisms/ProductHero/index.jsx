/** @format */

import * as React from 'react';
import { LoginButton, Typography } from '../../../components';
import { ProductHeroLayout } from './ProductHeroLayout';

const backgroundImage =
	'https://images.unsplash.com/photo-1534854638093-bada1813ca19?auto=format&fit=crop&w=1400&q=80';

export const ProductHero = () => {
	return (
		<ProductHeroLayout
			sxBackground={{
				backgroundImage: `url(${backgroundImage})`,
				backgroundColor: '#7fc7d9', // Average color of the background image.
				backgroundPosition: 'center',
			}}
		>
			{/* Increase the network loading priority of the background image. */}
			<img
				style={{ display: 'none' }}
				src={backgroundImage}
				alt='increase priority'
			/>
			<Typography color='inherit' align='center' variant='h2' marked='center'>
				Upgrade your Sundays
			</Typography>
			<Typography
				color='inherit'
				align='center'
				variant='h5'
				sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
			>
				Enjoy secret offers up to -70% off the best luxury hotels every Sunday.
			</Typography>
			<LoginButton
				color='secondary'
				size='large'
				variant='contained'
				sx={{ mw: 200 }}
			>
				Get Started
			</LoginButton>
			<Typography variant='body2' color='inherit' sx={{ mt: 2 }}>
				Discover the experience
			</Typography>
		</ProductHeroLayout>
	);
};
