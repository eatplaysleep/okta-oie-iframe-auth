/** @format */

import { AppLoginCallback, Home, Profile } from '../components';

export const routes = [
	{
		path: '/login/callback',
		isExact: true,
		component: AppLoginCallback,
	},
	{
		path: '/profile',
		component: Profile,
		isSecure: true,
		isExact: true,
	},
	{
		path: '/*',
		component: Home,
	},
];
