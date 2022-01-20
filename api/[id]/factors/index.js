/** @format */

// const okta = require('@okta/okta-sdk-nodejs');

// const API_KEY = process.env.API_OKTA_KEY;
// const CLIENT_ID = process.env.API_OKTA_CLIENT_ID;
// const ORG_URL = 'https://expedia-oie.dannyfuhriman.com';

// const client = new okta.Client({
// 	orgUrl: ORG_URL,
// 	token: API_KEY,
// });

import * as okta from '@okta/okta-sdk-nodejs';

import { getAuthenticators } from '../../authenticators';

const API_KEY = process.env.API_KEY,
	ORG_URL = process.env.REACT_APP_OKTA_URL,
	client = new okta.Client({ orgUrl: ORG_URL, token: API_KEY });

const parseFactors = async (res, filter) => {
	try {
		if (res.ok) {
			const url = new URL(res.url),
				paths = url.pathname.split('/'),
				userId = paths[paths.indexOf('users') + 1],
				body = await res.json();

			let factors = [];

			const { authenticators } = await getAuthenticators();

			body.forEach(factor => {
				const _key = `${factor?.factorType}-${factor?.provider}`;

				let resp = {
					key: _key,
					userId: userId,
					name: factorMap[factor?.factorType] ?? 'Unknown',
					isRequired: factor?.enrollment === 'REQUIRED' ? true : false,
					authenticator: authenticators.filter(
						authenticator => _key === authenticatorMap[authenticator?.key]
					)[0],
					...factor,
				};

				delete resp._links;

				if (filter) {
					if (
						factor?.factorType === filter?.type ||
						factor?.status === filter?.status
					) {
						factors.push(resp);
					}
				} else {
					factors.push(resp);
				}
			});

			console.log(JSON.stringify(factors, null, 2));

			return factors;
		} else {
			throw new Error(`Response not ok! [${res}]`);
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const factorMap = {
	call: 'Call',
	email: 'Email',
	push: 'Okta Verify',
	question: 'Security Question',
	sms: 'SMS',
	'token:hardware': 'Hardware TOTP',
	'token:hotp': 'Custom HOTP',
	'token:software:totp': 'Software TOTP',
	token: 'OTP Device/Application',
	u2f: 'Hardware U2F',
	webauthn: 'WebAuthN',
};

const authenticatorMap = {
	google_otp: 'token:software:totp-GOOGLE',
	okta_verify: 'push-OKTA',
	okta_email: 'email-OKTA',
	webauthn: 'webauthn-FIDO',
	phone_number: 'sms-OKTA',
};

export const getAvailableFactors = async (req, res) => {
	try {
		const {
			query: { id },
		} = req || {};

		const url = `${ORG_URL}/api/v1/users/${id}/factors/catalog`;

		const request = {
			method: 'get',
		};

		const response = await client.http.http(url, request);

		return res.status(response?.status).send(await parseFactors(response));
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};

const getFactors = async (req, res) => {
	try {
		const {
			query: { id },
		} = req || {};

		const url = `${ORG_URL}/api/v1/users/${id}/factors`;

		const request = {
			method: 'get',
		};

		const response = await client.http.http(url, request);

		return res.status(response?.status).send(await parseFactors(response));
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};

const index = (req, res) => {
	try {
		return getFactors(req, res);
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};

export default index;
