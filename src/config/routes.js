/** @format */

import { Home, Profile } from '../components';

export const routes = [
  // {
  // 	path: '/login/callback',
  // 	component: AppLoginCallback,
  // },
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
