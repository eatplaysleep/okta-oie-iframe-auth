/** @format */

import { createContext, useEffect, useReducer } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { getUserInfo } from '../../utils';
import {
	AuthDispatchContext,
	AuthReducer,
	initialState,
	useAuthActions,
} from '../index';

export const AuthStateContext = createContext();

export const AuthProvider = ({ children }) => {
	const { oktaAuth } = useOktaAuth();
	// const [state, setState] = useState({ isLoading: false });
	const [state, dispatch] = useReducer(AuthReducer, initialState);

	useEffect(() => {
		if (!state?.user) {
			return getUserInfo(oktaAuth).then(resp => {
				if (resp?.isAuthenticated) {
					return dispatch({
						type: 'SUCCESS',
						payload: { ...resp, isLoading: false },
					});
				}
			});
		}
	}, [oktaAuth, state]);

	const contextValues = {
		...useAuthActions(),
		...state,
	};
	// console.log('=== state ===');
	// console.log(state);
	return (
		<AuthStateContext.Provider value={contextValues}>
			<AuthDispatchContext.Provider value={dispatch}>
				{children}
			</AuthDispatchContext.Provider>
		</AuthStateContext.Provider>
	);
};
