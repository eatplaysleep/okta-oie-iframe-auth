/** @format */

import { useEffect } from 'react';
import { IconButton, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AuthDialog, Loader } from '../../components';
import { useAuthActions, useAuthDispatch, useAuthState } from '../../providers';

const ENV = process.env.NODE_ENV;
const ORIGINS = process.env.REACT_APP_ORIGIN_ALLOW?.split(/, {0,2}/) || [
	window.location.origin,
];

export const AuthModal = props => {
	const { onClose } = props;
	const dispatch = useAuthDispatch();
	const { login } = useAuthActions();
	const {
		authModalIsVisible,
		isLoadingLogin,
		iFrameIsVisible,
		authUrl,
		tokenParams,
	} = useAuthState();

	const ALLOW = process.env.REACT_APP_STEP_UP_ALLOW,
		modalWidth = '400px',
		modalHeight = '650px';

	const onCancel = () => {
		dispatch({ type: 'LOGIN_CANCEL' });
		return onClose();
	};

	useEffect(() => {
		console.debug('authModalIsVisible:', authModalIsVisible);
		if (authModalIsVisible) {
			login(dispatch, { authModalIsVisible });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authModalIsVisible]);
	useEffect(() => {
		if (tokenParams?.authorizationCode) {
			return login(dispatch, {
				tokenParams,
				authModalIsVisible,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tokenParams]);
	useEffect(() => {
		const responseHandler = ({ origin, data }) => {
			if (ENV === 'production') {
				const isAllowed = ORIGINS.includes(origin);
				if (!isAllowed) {
					return dispatch({
						type: 'LOGIN_ERROR',
						payload: { iFrameIsVisible: false, authModalIsVisible: false },
						error: `'origin' [${origin}] not allowed`,
					});
				}
			}

			if (data?.type === 'onload' && data?.result === 'success') {
				return dispatch({ type: 'LOGIN_STARTED' });
			}

			if (data?.code) {
				dispatch({
					type: 'EXCHANGE_CODE',
					payload: {
						tokenParams: {
							...tokenParams,
							authorizationCode: data?.code,
							interactionCode: data?.interaction_code,
						},
					},
				});
			}
		};

		const resolve = error => {
			if (error) {
				throw error;
			}

			console.debug('removing listener...');
			window.removeEventListener('message', responseHandler);
		};

		if (authModalIsVisible) {
			console.debug('adding listener...');
			window.addEventListener('message', responseHandler);
		}

		return () => resolve();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authModalIsVisible]);

	return (
		<AuthDialog open={authModalIsVisible} onClose={onClose}>
			<DialogTitle>
				<IconButton
					edge='end'
					size='small'
					onClick={onCancel}
					sx={{
						color: 'white',
						position: 'absolute',
						borderRadius: 25,
						background: 'rgba(0, 0, 0, 0.53)',
						right: -15,
						top: -15,
						'z-index': '10',
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ width: modalWidth, height: modalHeight }}>
				{isLoadingLogin && <Loader />}
				{authUrl && iFrameIsVisible && (
					<iframe
						src={authUrl}
						name='iframe-auth'
						title='Login'
						width={modalWidth}
						height={modalHeight}
						frameBorder='0'
						style={{ display: 'block', borderRadius: '4px' }}
						allow={ALLOW}
					/>
				)}
			</DialogContent>
		</AuthDialog>
	);
};
