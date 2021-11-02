/** @format */

import { useOktaAuth } from '@okta/okta-react';
import { getUserInfo as getUser } from '../utils';

const ORG_URL = process.env.REACT_APP_OKTA_ORG_URL;

export const useAuthActions = () => {
	const { authState, oktaAuth } = useOktaAuth();

	const login = async (dispatch, props) => {
		try {
			const { tokens, tokenParams } = props || {};
			const { authorizationCode, interaction_code } = tokenParams || {};

			const isCodeExchange = authorizationCode || interaction_code || false;

			if (isCodeExchange) {
				console.log(tokenParams);
				const response = await oktaAuth.token.exchangeCodeForTokens(
					tokenParams
				);

				if (!response?.tokens) {
					return dispatch({
						type: 'LOGIN_ERROR',
						error: `No tokens in response. Something went wrong! [${response}]`,
					});
				}

				await oktaAuth.tokenManager.setTokens(response.tokens);

				await oktaAuth.authStateManager.updateAuthState();

				return dispatch({ type: 'LOGIN_SUCCESS' });
			} else if (oktaAuth.isLoginRedirect() || tokens) {
				console.debug('handling Okta redirect...');

				dispatch({ type: 'LOGIN_REDIRECT' });

				await oktaAuth.storeTokensFromRedirect();

				oktaAuth.removeOriginalUri();

				await oktaAuth.authStateManager.updateAuthState();

				return;
			} else if (!authState?.isAuthenticated) {
				console.debug('setting original uri...');

				oktaAuth.setOriginalUri(window.location.href);

				console.debug('checking for existing Okta session...');

				const hasSession = await oktaAuth.session.exists();

				console.debug('session:', hasSession);

				if (!hasSession) {
					const loginHint = props?.loginhint;

					console.debug('loginHint:', loginHint);

					console.debug('generating URL...');

					dispatch({ type: 'LOGIN_START' });

					const { authUrl, tokenParams } = await generateAuthUrl(oktaAuth);

					console.log('authState:', authState);
					dispatch({
						type: 'LOGIN_AUTHORIZE',
						payload: { authUrl, tokenParams },
					});
				} else {
					const { tokens } = await oktaAuth.token.getWithoutPrompt();

					if (tokens) {
						await oktaAuth.tokenManager.setTokens(tokens);
					}
					return getUser(oktaAuth, dispatch);
				}
			}
		} catch (err) {
			if (dispatch) {
				dispatch({ type: 'LOGIN_ERROR', error: err });
			}
			return console.error('login error:', err);
		}
	};

	const logout = (dispatch, postLogoutRedirect) => {
		let config = {};

		if (postLogoutRedirect) {
			config = { postLogoutRedirectUri: postLogoutRedirect };
		}

		console.info('executing logout...');

		localStorage.removeItem('user');

		return oktaAuth
			.signOut(config)
			.then(() => dispatch({ type: 'LOGOUT_SUCCESS' }));
	};

	return {
		getUser,
		login,
		logout,
	};
};

const generateAuthUrl = async sdk => {
	try {
		const tokenParams = await sdk.token.prepareTokenParams(),
			{ issuer, authorizeUrl } = sdk.options || {};

		// Use the query params to build the authorize url

		// Get authorizeUrl and issuer
		const url = authorizeUrl ?? `${issuer}/v1/authorize`;

		const authUrl = url + buildAuthorizeParams(tokenParams);

		return { authUrl, tokenParams };
	} catch (error) {
		throw new Error(`Unable to generate auth url [${error}]`);
	}
};
const buildAuthorizeParams = tokenParams => {
	let params = {};

	const oAuthParamMap = {
		clientId: 'client_id',
		codeChallenge: 'code_challenge',
		codeChallengeMethod: 'code_challenge_method',
		display: 'display',
		idp: 'idp',
		idpScope: 'idp_scope',
		loginHint: 'login_hint',
		maxAge: 'max_age',
		nonce: 'nonce',
		prompt: 'prompt',
		redirectUri: 'redirect_uri',
		responseMode: 'response_mode',
		responseType: 'response_type',
		sessionToken: 'sessionToken',
		state: 'state',
		scopes: 'scope',
	};

	for (const [key, value] of Object.entries(tokenParams)) {
		let oAuthKey = oAuthParamMap[key];

		if (oAuthKey) {
			params[oAuthKey] = value;
		}
	}

	params.response_mode = 'okta_post_message';

	params = removeNils(params);

	return toQueryString(params);
};

const toQueryString = obj => {
	let str = [];
	if (obj) {
		for (const [key, value] of Object.entries(obj)) {
			if (value) {
				let output;
				if (typeof value === 'string') {
					output = encodeURIComponent(value);
				} else if (Array.isArray(value)) {
					output = value.join('+');
				}

				str.push(key + '=' + output);
			}
		}
	}
	if (str.length) {
		return '?' + str.join('&');
	} else {
		return '';
	}
};

const removeNils = obj => {
	let cleaned = {};

	for (const [key, value] of Object.entries(obj)) {
		if (value) {
			cleaned[key] = value;
		}
	}
	return cleaned;
};
