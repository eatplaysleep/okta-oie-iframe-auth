/** @format */
import { Fragment, useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import {
	Authenticators,
	Claims,
	Loader,
	Paper,
	Typography,
} from '../../components';
import { useAuthDispatch, useAuthState } from '../../providers';

const ENV = process.env.NODE_ENV;
const ORIGINS = process.env.REACT_APP_ORIGIN_ALLOW?.split(/, {0,2}/) || [];

export const Profile = () => {
	const dispatch = useAuthDispatch();
	const {
		user,
		isLoadingProfile,
		isStaleAuthenticators,
		isLoadingAuthenticators,
	} = useAuthState();
	const [profile, setProfile] = useState();
	const [authenticators, setAuthenticators] = useState();
	const [availableFactors, setAvailableFactors] = useState();

	useEffect(() => {
		const buildProfile = () => {
			let profile = [];

			for (const [key, value] of Object.entries(user)) {
				if (key === 'address') {
					for (const [addressKey, addressValue] of Object.entries(value)) {
						profile.push({ key: addressKey, value: addressValue });
					}
				} else {
					profile.push({ key: key, value: value });
				}
			}

			if (profile.length > 0) {
				return <Claims data={profile} />;
			} else return <></>;
		};

		const getAvailableFactors = () => {
			let url = `${window.location.origin}/api/${user?.sub}/factors/catalog`;

			return fetch(url)
				.then(resp => {
					return resp.json();
				})
				.then(resp => {
					if (Array.isArray(resp) && resp.length > 0) {
						setAvailableFactors(resp);
					}
					return resp;
				});
		};

		if (user) {
			console.log('building profile...');
			setProfile(() => buildProfile());
			getAvailableFactors();
		}
	}, [user]);

	useEffect(() => {
		const getAvailableFactors = () => {
			let url = `${window.location.origin}/api/${user?.sub}/factors/catalog`;

			return fetch(url)
				.then(resp => {
					return resp.json();
				})
				.then(resp => {
					if (Array.isArray(resp) && resp.length > 0) {
						setAvailableFactors(resp);
					}
					return resp;
				});
		};

		if (user && isStaleAuthenticators) {
			getAvailableFactors().then(() =>
				dispatch({ type: 'AUTHENTICATORS_REFRESH_SUCCESS' })
			);
		}
	}, [user, isStaleAuthenticators, dispatch]);

	useEffect(() => {
		if (availableFactors) {
			setAuthenticators(() => <Authenticators data={availableFactors} />);
		}
	}, [availableFactors]);

	useEffect(() => {
		const responseHandler = ({ origin, data }) => {
			if (ENV === 'production') {
				const isAllowed = ORIGINS.includes(origin);

				if (!isAllowed) {
					return;
				}
			}

			if (data?.type === 'onsuccess' && data?.result === 'success') {
				return dispatch({ type: 'REFRESH_AUTHENTICATORS' });
			}
		};

		const resolve = error => {
			if (error) {
				throw error;
			}

			console.debug('removing listener...');
			window.removeEventListener('message', responseHandler);
		};

		if (isLoadingAuthenticators) {
			console.debug('adding listener...');
			window.addEventListener('message', responseHandler);
		}

		return () => resolve();
	}, [isLoadingAuthenticators, dispatch]);

	return (
		<Fragment>
			<Container component='section' sx={{ mt: 8, mb: 4 }}>
				<Typography variant='h4' marked='center' align='center' component='h2'>
					Profile
				</Typography>
				<Paper
					variant='outlined'
					sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
				>
					<Fragment>
						<Typography variant='h5' gutterBottom sx={{ mt: 2 }}>
							ATTRIBUTES
						</Typography>
						<Grid
							container
							spacing={2}
							sx={{
								justifyContent: 'flex-start',
								position: 'relative',
								minHeight: '200px',
							}}
						>
							{isLoadingProfile && <Loader />}
							{profile}
						</Grid>
					</Fragment>
				</Paper>
				<Paper
					variant='outlined'
					sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
				>
					<Fragment>
						<Typography variant='h5' gutterBottom sx={{ mt: 2 }}>
							AUTHENTICATORS
						</Typography>
						{authenticators}
					</Fragment>
				</Paper>
			</Container>
		</Fragment>
	);
};
