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

const parseFactors = async (res, { filter, enrolledAuthenticators }) => {
  try {
    if (res.ok) {
      const url = new URL(res.url),
        paths = url.pathname.split('/'),
        userId = paths[paths.indexOf('users') + 1],
        body = await res.json();

      let factors = [];

      // console.log('=== available factors ===');
      // console.log(JSON.stringify(body, null, 2));

      const { authenticators } = await getAuthenticators(true);

      const authenticatorsMeta = {};

      authenticators.forEach(
        (authenticator) =>
          (authenticatorsMeta[authenticator?.key] = {
            id: authenticator?.id,
            name: authenticator?.name,
          })
      );
      console.debug(authenticatorsMeta);
      body.forEach((factor) => {
        const _key = type2KeyMap[`${factor?.factorType}-${factor?.provider}`];

        if (factor?.factorType !== 'call' && _key) {
          let resp = {
            key: _key,
            _id: authenticatorsMeta[_key]?.id,
            userId: userId,
            name: authenticatorsMeta[_key]?.name,
            isRequired: factor?.enrollment === 'REQUIRED' ? true : false,
            authenticators: enrolledAuthenticators.filter(
              (authenticator) => _key === authenticator?.key
            ),
            ...factor,
          };

          delete resp._links;

          if (filter) {
            if (factor?.factorType === filter?.type || factor?.status === filter?.status) {
              factors.push(resp);
            }
          } else {
            factors.push(resp);
          }
        }
      });
      // console.log('==== parsed factors ===');
      // console.log(JSON.stringify(factors, null, 2));

      return factors;
    } else {
      throw new Error(`Response not ok! [${res}]`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const type2KeyMap = {
  'sms-OKTA': 'phone_number',
  'call-OKTA': 'phone_number',
  'email-OKTA': 'okta_email',
  'push-OKTA': 'okta_verify',
  'token:software:totp-GOOGLE': 'google_otp',
  'webauthn-FIDO': 'webauthn',
};

export const getAvailableFactors = async (req, res) => {
  try {
    const {
      query: { id },
      body,
    } = req || {};

    const enrolledAuthenticators = JSON.parse(body);

    const url = `${ORG_URL}/api/v1/users/${id}/factors/catalog`;

    const request = {
      method: 'get',
    };

    const response = await client.http.http(url, request);

    return res
      .status(response?.status)
      .send(await parseFactors(response, { enrolledAuthenticators }));
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

    // console.debug('==== factors ====');
    // console.debug(JSON.stringify(response, null, 2));

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
