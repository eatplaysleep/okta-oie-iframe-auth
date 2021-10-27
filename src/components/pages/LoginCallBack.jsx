/** @format */
import { useEffect } from 'react';
import { Loader } from '../../components';
import { useAuthState, useAuthDispatch } from '../../providers';

const ORIGIN = process.env.REACT_APP_OKTA_URL;

export const LoginCallback = () => {
	const { login } = useAuthState();
	const dispatch = useAuthDispatch();

	useEffect(() => {
		return login(dispatch, { isStepUp: true }).then(() => {
			dispatch({ type: 'STEP_UP_COMPLETE' });
			window.top.postMessage(
				{
					error: false,
					type: 'callback',
					result: 'success',
				},
				ORIGIN
			);
		});
	}, []);

	return (
		<div>
			<Loader />
		</div>
	);
};
